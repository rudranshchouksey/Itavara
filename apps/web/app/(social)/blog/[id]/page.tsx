import React from 'react';
import Image from 'next/image';
import { Heart, MessageCircle, Share2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { InlineItineraryCard } from '@itvara/ui';

async function getMiniBlog(id: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/posts/mini-blog/${id}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data;
  } catch (e) {
    return null;
  }
}

export default async function BlogPage({ params }: { params: { id: string } }) {
  const post = await getMiniBlog(params.id);

  if (!post) {
    notFound();
  }

  // Simple Markdown parsing for Table of Contents (H2/H3)
  const toc = post.content.split('\n').filter((line: string) => line.startsWith('## ') || line.startsWith('### ')).map((line: string) => {
    const level = line.startsWith('### ') ? 3 : 2;
    const text = line.replace(/^#+\s/, '');
    return { level, text };
  });

  const wordCount = post.content.trim().split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200);

  // Parse blocks separating standard text and itinerary JSON
  const blocks = [];
  const parts = post.content.split(/(```json itinerary\n[\s\S]*?\n```)/);
  for (const part of parts) {
    if (part.startsWith('```json itinerary')) {
      try {
        const jsonStr = part.replace(/```json itinerary\n/, '').replace(/\n```$/, '');
        blocks.push({ type: 'itinerary', data: JSON.parse(jsonStr) });
      } catch (e) {
        blocks.push({ type: 'text', content: part }); // Fallback to text if invalid JSON
      }
    } else {
      blocks.push({ type: 'text', content: part });
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Scroll Progress Bar - would typically be implemented with a client component hook, simplified here */}
      <div className="fixed top-0 left-0 h-1 bg-[#FF385C] z-50 w-full" style={{ transform: 'scaleX(0)', transformOrigin: 'left' }} id="progress-bar"></div>

      {/* Top Nav */}
      <nav className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex justify-between items-center z-40">
        <Link href="/" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div className="flex space-x-4">
          <button className="p-2 hover:bg-gray-100 rounded-full"><Heart size={20} /></button>
          <button className="p-2 hover:bg-gray-100 rounded-full"><MessageCircle size={20} /></button>
          <button className="p-2 hover:bg-gray-100 rounded-full"><Share2 size={20} /></button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="mb-12">
          {post.mediaUrls?.[0] && (
            <div className="w-full h-80 rounded-3xl overflow-hidden mb-10 relative">
              <Image src={post.mediaUrls[0]} alt="Cover" fill className="object-cover" />
            </div>
          )}
          
          <h1 className="text-5xl font-bold text-gray-900 mb-8 leading-tight tracking-tight">
            {post.title}
          </h1>

          <div className="flex items-center justify-between border-b border-gray-100 pb-8">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-200 relative">
                {post.user.profilePhoto && <Image src={post.user.profilePhoto} alt={post.user.name} fill className="object-cover" />}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">{post.user.name}</h3>
                <p className="text-gray-500 text-sm">{post.user.bio || 'Wanderer'}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-gray-500 text-sm mb-1">{new Date(post.createdAt).toLocaleDateString()}</p>
              <p className="text-[#FF385C] font-medium text-sm">{readingTime} min read</p>
            </div>
          </div>
        </header>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Content */}
          <article className="flex-1 prose prose-lg prose-rose max-w-none text-gray-800">
            {blocks.map((block, blockIdx) => {
              if (block.type === 'itinerary') {
                return (
                  <InlineItineraryCard 
                    key={blockIdx}
                    day={block.data.day}
                    description={block.data.description}
                    stay={block.data.stay}
                    guideAvailable={block.data.guideAvailable}
                    guidePrice={block.data.guidePrice}
                  />
                );
              }
              
              // Text block fallback rendering
              return block.content.split('\n').map((paragraph: string, idx: number) => {
                if (paragraph.startsWith('## ')) return <h2 key={`${blockIdx}-${idx}`} className="text-3xl font-bold mt-10 mb-4">{paragraph.replace('## ', '')}</h2>;
                if (paragraph.startsWith('### ')) return <h3 key={`${blockIdx}-${idx}`} className="text-2xl font-bold mt-8 mb-4">{paragraph.replace('### ', '')}</h3>;
                if (paragraph.startsWith('- ')) return <li key={`${blockIdx}-${idx}`} className="ml-4 mb-2">{paragraph.replace('- ', '')}</li>;
                if (paragraph.trim() === '') return <br key={`${blockIdx}-${idx}`} />;
                return <p key={`${blockIdx}-${idx}`} className="mb-6 leading-relaxed">{paragraph}</p>;
              });
            })}
          </article>

          {/* Sidebar / Table of Contents */}
          {toc.length > 0 && (
            <aside className="w-full lg:w-64 hidden lg:block">
              <div className="sticky top-28 bg-gray-50 rounded-2xl p-6">
                <h4 className="font-bold text-gray-900 mb-4 uppercase text-xs tracking-wider">In this story</h4>
                <ul className="space-y-3">
                  {toc.map((item: any, i: number) => (
                    <li key={i} className={`${item.level === 3 ? 'ml-4 text-sm' : 'text-base font-medium'} text-gray-600 hover:text-[#FF385C] cursor-pointer transition-colors line-clamp-2`}>
                      {item.text}
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          )}
        </div>
      </main>

      {/* Floating Action Bar (Mobile only) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-8 py-4 rounded-full flex items-center justify-between w-[90%] max-w-sm lg:hidden shadow-xl z-50">
        <button className="flex items-center space-x-2"><Heart size={20} /> <span>{post._count.likes}</span></button>
        <div className="w-px h-6 bg-gray-700"></div>
        <button className="flex items-center space-x-2"><MessageCircle size={20} /> <span>{post._count.comments}</span></button>
        <div className="w-px h-6 bg-gray-700"></div>
        <button><Share2 size={20} /></button>
      </div>
    </div>
  );
}
