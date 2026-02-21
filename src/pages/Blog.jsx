import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import { db } from '../firebaseConfig'; 
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import AnimatedOnView from "../components/AnimatedOnView";

const Blog = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const q = query(collection(db, "logs"), orderBy("date", "desc"));
        const querySnapshot = await getDocs(q);
        const fetchedLogs = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setLogs(fetchedLogs);
      } catch (error) {
        console.error("Archive sync error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white pt-24 md:pt-32 pb-20 px-6 md:px-8 font-sans">
      <div className="max-w-5xl mx-auto">
        <header className="mb-16 md:mb-24">
          <p className="text-zinc-600 text-[9px] md:text-[10px] tracking-[0.4em] uppercase mb-4 font-mono">
            {loading ? "Establishing Connection..." : "Journal // Logs"}
          </p>
          {/* Responsive Heading: smaller on mobile */}
          <h1 className="text-5xl md:text-7xl font-medium tracking-tighter leading-tight">
            Technical <span className="text-zinc-800 italic">Archive.</span>
          </h1>
        </header>

        <div className="border-t border-zinc-900">
          {logs.map((log) => (
            <AnimatedOnView key={log.id}>
              <Link to={`/blog/${log.slug}`} className="block group">
                {/* MOBILE TWEAK: 
                  - Changed to flex-col on small screens 
                  - Changed py-8 on mobile, py-12 on desktop
                */}
                <div className="py-8 md:py-12 border-b border-zinc-900 flex flex-col md:flex-row justify-between items-start md:items-center cursor-pointer hover:bg-zinc-950/50 transition-all px-2 md:px-4 gap-6 md:gap-0">
                  
                  <div className="space-y-3 md:space-y-2 w-full">
                    <div className="flex gap-4 text-[9px] md:text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
                      <span>{log.date}</span>
                      <span>/</span>
                      <span className="text-emerald-500">{log.category}</span>
                    </div>
                    
                    {/* Title scaling for small screens */}
                    <h3 className="text-2xl md:text-3xl font-medium tracking-tight group-hover:text-white transition-colors">
                      {log.title}
                    </h3>
                    
                    <p className="text-zinc-500 max-w-xl text-sm md:text-base font-light leading-relaxed whitespace-pre-line line-clamp-2">
                      {log.description}
                    </p>
                  </div>

                  {/* Arrow hidden on very small screens or moved to a better position */}
                  <div className="self-end md:self-center h-10 w-10 md:h-12 md:w-12 border border-zinc-800 rounded-full flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                    <FiArrowRight />
                  </div>
                </div>
              </Link>
            </AnimatedOnView>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;