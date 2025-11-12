// src/app/api/cron/fetch.ts
import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';   
import Parser from 'rss-parser';
import crypto from 'crypto';
import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';

const parser = new Parser();

/* 1. RSS 源（免费 & 无版权争议） */
const RSS_SOURCES = [
  { name: 'Solidot',        url: 'https://www.solidot.org/index.rss',           category: '科技' },
  { name: 'cnBeta',         url: 'https://www.cnbeta.com/backend.php',          category: '科技' },
  { name: 'Engadget中文',   url: 'https://chinese.engadget.com/rss.xml',        category: '科技' },
  { name: '虎嗅',           url: 'https://rss.huxiu.com/',                      category: '商业' },
  { name: 'BBC中文网',      url: 'https://feeds.bbci.co.uk/zh/rss.xml',         category: '国际' }
];

/* 2. 无反爬 HTML 源（36Kr 快讯） */
const HTML_SOURCES = [
  {
    name: '36Kr快讯',
    url: 'https://36kr.com/information/web_news/',
    category: '商业',
    rules: {
      list: '.article-item',
      title: '.article-item-title',
      link: 'a',
      time: '.article-item-time',
      desc: '.article-item-desc'
    }
  }
];

/* 3. 工具：生成 hash 去重 */
const hash = (t: string, l: string) =>
  crypto.createHash('md5').update(t + l).digest('hex');

/* 4. 通用入库 */
async function saveNews(list: any[]) {
  const sql = `
    INSERT IGNORE INTO news
      (id, title, summary, source, publishTime, url, category, hash, full_text, is_manual)
    VALUES ?
  `;
  const values = list.map((n) => [
    n.id, n.title, n.summary, n.source, n.publishTime, n.url,
    n.category, n.hash, n.fullText ?? '', 0
  ]);
  if (values.length) await db.query(sql, [values]);
}

/* 5. RSS 抓 */
async function fetchRSS() {
  for (const src of RSS_SOURCES) {
    try {
      const proxy = `/api/proxy?url=${encodeURIComponent(src.url)}&isHtml=false`;
      const xml  = await fetch(proxy).then((r) => r.text());
      const feed = await parser.parseString(xml);
      const items = (feed.rss?.channel?.[0]?.item ?? []).map((it: any) => ({
        id: `rss-${it.guid?.[0] ?? it.link?.[0]}`,
        title: it.title?.[0],
        summary: it.description?.[0]?.slice(0, 200),
        source: src.name,
        publishTime: new Date(it.pubDate?.[0] ?? Date.now()).toISOString(),
        url: it.link?.[0],
        category: src.category,
        hash: hash(it.title?.[0], it.link?.[0])
      }));
      await saveNews(items);
    } catch (e) {
      console.error(`RSS fail ${src.name}:`, e);
    }
  }
}

/* 6. 36Kr HTML 抓 */
async function fetchHTML() {
  for (const src of HTML_SOURCES) {
    try {
      const html = await fetch(`/api/proxy?url=${encodeURIComponent(src.url)}&isHtml=true`)
        .then((r) => r.text());
      const dom = new JSDOM(html);
      const doc = dom.window.document;
      const items = Array.from(doc.querySelectorAll(src.rules.list)).map((el, i) => {
        const title = el.querySelector(src.rules.title)?.textContent?.trim() ?? '';
        const link = (el.querySelector(src.rules.link) as HTMLAnchorElement)?.href ?? '';
        const time = el.querySelector(src.rules.time)?.textContent?.trim() ?? '';
        const desc = el.querySelector(src.rules.desc)?.textContent?.trim().slice(0, 150) ?? '';
        return {
          id: `kr-${Date.now()}-${i}`,
          title,
          summary: desc,
          source: src.name,
          publishTime: new Date(time || Date.now()).toISOString(),
          url: link.startsWith('http') ? link : `https://36kr.com${link}`,
          category: src.category,
          hash: hash(title, link)
        };
      });
      await saveNews(items);
    } catch (e) {
      console.error(`HTML fail ${src.name}:`, e);
    }
  }
}

/* 7. 主函数：增量抓取 */
export async function GET(_: NextRequest) {
  await fetchRSS();
  await fetchHTML();
  return NextResponse.json({ message: '抓取完成' });
}