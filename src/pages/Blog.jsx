import React from 'react';
import { FiArrowRight } from 'react-icons/fi';
import AnimatedOnView from "../components/AnimatedOnView";

// This is our "Shelf" - later, Sanity will fill this up automatically
const blogLogs = [
  {
    id: "01",
    title: "The Future of Distributed Systems",
    date: "Feb 16, 2026",
    category: "Architecture",
    description: "How we're building apps that stay online even when the world goes offline."
  },
  {
    id: "02",
    title: "Why I Switched to Sanity CMS",
    date: "Feb 14, 2026",
    category: "Workflow",
    description: "A deep dive into managing content without touching the code."
  }
];

const Blog = () => {
  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-20 px-8">
      <div className="max-w-5xl mx-auto">
        
        {/* HEADER */}
        <header className="mb-24">
          <p className="text-zinc-600 text-[10px] tracking-[0.4em] uppercase mb-4">Journal // Logs</p>
          <h1 className="text-7xl font-medium tracking-tighter">
            Technical <span className="text-zinc-800 italic">Archive.</span>
          </h1>
        </header>

        {/* POST LIST */}
        <div className="border-t border-zinc-900">
          {blogLogs.map((log) => (
            <AnimatedOnView key={log.id}>
              <div className="group py-12 border-b border-zinc-900 flex justify-between items-center cursor-pointer hover:bg-zinc-950/50 transition-all px-4">
                <div className="space-y-2">
                  <div className="flex gap-4 text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
                    <span>{log.date}</span>
                    <span>/</span>
                    <span className="text-emerald-500">{log.category}</span>
                  </div>
                  <h3 className="text-3xl font-medium tracking-tight group-hover:text-white transition-colors">
                    {log.title}
                  </h3>
                  <p className="text-zinc-500 max-w-xl font-light leading-relaxed">
                    {log.description}
                  </p>
                </div>

                <div className="h-12 w-12 border border-zinc-800 rounded-full flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                  <FiArrowRight />
                </div>
              </div>
            </AnimatedOnView>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Blog;
