import Link from 'next/link';
import { Info, Github, ExternalLink, Mail } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
          <Info className="w-6 h-6 text-blue-500 mr-2" />
          关于智闻快览
        </h1>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">什么是智闻快览？</h2>
          <p className="text-gray-600 mb-4">
            智闻快览是一个基于AI技术的新闻解读平台，旨在帮助用户快速掌握新闻核心内容，
            理解复杂事件的本质和影响。
          </p>
          <p className="text-gray-600">
            通过先进的自然语言处理技术，我们为每条新闻提供精准摘要、关键时间线、
            核心知识点和未来影响分析，让您在30秒内了解事件全貌。
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">核心功能</h2>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span>AI智能摘要：自动提取新闻核心内容</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span>关键时间线：梳理事件发展脉络</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span>知识点解析：解释专业术语和背景知识</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span>影响分析：预测事件可能带来的影响</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span>收藏与历史：保存感兴趣的内容</span>
            </li>
          </ul>
        </section>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">技术架构</h2>
          <p className="text-gray-600 mb-2">
            本平台基于Next.js构建，采用以下技术栈：
          </p>
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">Next.js</span>
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">React</span>
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">TypeScript</span>
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">Tailwind CSS</span>
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">百度文心大模型</span>
          </div>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">联系我们</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
            >
              <Github className="w-5 h-5 mr-2" />
              GitHub
              <ExternalLink className="w-4 h-4 ml-1" />
            </a>
            <a 
              href="mailto:contact@example.com"
              className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
            >
              <Mail className="w-5 h-5 mr-2" />
              contact@example.com
            </a>
          </div>
        </section>
        
        <div className="mt-10 pt-6 border-t border-gray-100">
          <Link 
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
          >
            返回首页
          </Link>
        </div>
      </div>
    </div>
  );
}