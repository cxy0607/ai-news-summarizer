// src/app/api/search/route.ts
import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';  

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const kw    = (searchParams.get('kw')   ?? '').trim();
  const start = searchParams.get('start') ?? '2024-01-01';
  const end   = searchParams.get('end')   ?? new Date().toISOString().slice(0,10);
  const full  = searchParams.get('full')  === '1'; 
  if (!kw) return NextResponse.json([]);

  const sql = `
    SELECT id,title,summary,source,publishTime,url
    FROM   news
    WHERE  publishTime BETWEEN ? AND ?
    AND    (title LIKE ? OR summary LIKE ? ${full ? 'OR full_text LIKE ?' : ''})
    ORDER  BY publishTime DESC
    LIMIT  50`;
  const like = `%${kw}%`;
  const rows = await db.execute(sql, full
    ? [start, end, like, like, like]
    : [start, end, like, like]);

  return NextResponse.json(rows[0]);
}