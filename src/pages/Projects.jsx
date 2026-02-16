import React, { useState, useEffect } from "react";
import { FiArrowUpRight, FiX, FiExternalLink, FiMessageSquare } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedOnView from "../components/AnimatedOnView";
import SEO from '../components/SEO';

const projects = [
  {
    id: "01",
    title: "SkyCount",
    category: "Data / Analytics",
    desc: "Precision tracking and counting protocol for cloud-scale metrics.",
    longDesc: "SkyCount is a high-performance analytics node designed for real-time data visualization. It processes rapid input streams to provide precise counting metrics with a focus on UI clarity and low-latency feedback loops.",
    stack: ["Cloud Architecture", "Next.js", "Tailwind CSS", "Real-time API"],
    url: "https://skycount.pxxl.click/",
  },
  {
    id: "02",
    title: "Giftcard Protocol",
    category: "Fintech / E-commerce",
    desc: "Secure digital asset exchange for institutional and retail giftcards.",
    longDesc: "A specialized trading interface for digital assets. This platform handles complex transaction flows, secure balance verification, and a streamlined user experience for giftcard liquidation and exchange.",
    stack: ["Fintech UI", "React", "State Management", "Secure Auth"],
    url: "https://giftcard-platform-zeta.vercel.app/",
  },
  {
    id: "03",
    title: "AskTC",
    category: "Real-time / Events",
    desc: "A high-concurrency Q&A platform built for DLBC events.",
    longDesc: "Similar to Slido, AskTC allows thousands of concurrent users to submit and upvote questions during live sessions. It features a moderator dashboard with real-time filtering and sentiment analysis of incoming queries.",
    stack: ["Socket.io", "Redis", "Next.js", "Framer Motion"],
    url: "https://asktc.vercel.app",
  },
  {
    id: "04",
    title: "Kiddos AI",
    category: "LLM / EdTech",
    desc: "Autonomous learning architecture with intelligent course synthesis.",
    longDesc: "Kiddos is a next-generation education platform. It uses LLMs to analyze a student's pace and dynamically restructure curriculum. The system handles real-time telemetry to track engagement and adjust difficulty levels on the fly.",
    stack: ["OpenAI API", "Next.js 15", "Supabase", "Tailwind CSS"],
    url: "https://kiddo-eight-henna.vercel.app/",
  },
  {
    id: "05",
    title: "Faith Portal",
    category: "Infrastructure",
    desc: "A comprehensive institutional management system for high-volume data.",
    longDesc: "Built for Faith Secondary School, this portal manages student records, fee processing, and results computation. The focus was on creating a zero-latency experience for staff in regions with fluctuating internet stability.",
    stack: ["React", "Node.js", "MongoDB", "Express"],
    url: "https://faith-secondary-school-app.vercel.app/",
  },
  {
    id: "06",
    title: "CanvaX",
    category: "Mobile Design",
    desc: "A minimalist mobile graphics engine for rapid asset creation.",
    longDesc: "CanvaX was an exploration into mobile-first design tools. It prioritizes gesture-based editing and low-overhead rendering, allowing users to create social assets in seconds with professional-grade typography.",
    stack: ["React Native", "Skia", "Firebase", "Zustand"],
    url: null,
  },
];

const jokes = [
  "Why do programmers prefer dark mode? Because light attracts bugs.",
  "Real programmers count from 0.",
  "An SQL query walks into a bar, walks up to two tables, and asks, 'Can I join you?'",
  "A user interface is like a joke. If you have to explain it, it’s not that good.",
  "There are 10 types of people in the world: those who understand binary, and those who don't.",
  "Debugging is like being the detective in a crime movie where you are also the murderer."
];

const Projects = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [currentJoke, setCurrentJoke] = useState("");

  const triggerJoke = () => {
    const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
    setCurrentJoke(randomJoke);
  };

  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
      triggerJoke();
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [selectedProject]);

  return (
    <div className="min-h-screen bg-black text-white pt-40 pb-20 selection:bg-zinc-800">
      <SEO title="Deployments // Victor Achede" />
      
      <section className="max-w-6xl mx-auto px-8">
        <div className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <AnimatedOnView>
            <h2 className="text-7xl md:text-9xl font-medium tracking-tighter leading-none">
                Selected <br />
                <span className="text-zinc-800 italic">Works.</span>
            </h2>
          </AnimatedOnView>
          <div className="hidden md:block text-[10px] text-zinc-700 uppercase tracking-[0.5em] font-bold mb-4">
            Curated Deployments / 2026
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-zinc-900 border border-zinc-900 overflow-hidden">
          {projects.map((project, i) => (
            <AnimatedOnView key={i} delay={i * 0.1}>
              <div 
                onClick={() => setSelectedProject(project)}
                className="group relative bg-black p-12 h-[500px] flex flex-col justify-between hover:bg-zinc-950/40 transition-all duration-500 cursor-pointer overflow-hidden"
              >
                <span className="absolute -right-4 -bottom-4 text-[180px] font-black text-white/[0.02] group-hover:text-white/[0.07] group-hover:-translate-y-8 group-hover:-translate-x-4 transition-all duration-700 ease-out pointer-events-none uppercase italic">
                  {project.id}
                </span>

                <div className="relative z-10 space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-mono text-zinc-700 tracking-widest uppercase">
                      Build_{project.id}
                    </span>
                    <div className="h-px w-8 bg-zinc-900 group-hover:w-16 transition-all duration-500" />
                  </div>
                  <h3 className="text-5xl font-medium tracking-tighter text-zinc-400 group-hover:text-white transition-all duration-500">
                    {project.title}
                  </h3>
                  <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.2em]">{project.category}</p>
                </div>

                <div className="relative z-10 space-y-6">
                  <p className="text-zinc-500 text-lg leading-relaxed max-w-xs group-hover:text-zinc-300 transition-colors">
                    {project.desc}
                  </p>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 group-hover:text-white flex items-center gap-2 transition-all">
                    Open Project Protocol <FiArrowUpRight />
                  </span>
                </div>
              </div>
            </AnimatedOnView>
          ))}
        </div>
      </section>

      <AnimatePresence>
        {selectedProject && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="fixed inset-0 bg-black/90 backdrop-blur-md z-[150]" 
            />
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full md:w-[600px] bg-[#050505] border-l border-zinc-900 z-[160] flex flex-col"
            >
              <div className="flex-grow p-10 md:p-16 overflow-y-auto">
                <button onClick={() => setSelectedProject(null)} className="mb-16 text-zinc-500 hover:text-white transition-colors text-[10px] uppercase tracking-[0.3em] font-black flex items-center gap-2">
                    <FiX /> Terminate Session
                </button>

                <div className="space-y-16">
                    <div className="space-y-6">
                      <span className="text-xs font-mono text-zinc-700 tracking-[0.4em] uppercase">Status: Deployed</span>
                      <h2 className="text-6xl md:text-7xl font-medium tracking-tighter leading-none">{selectedProject.title}</h2>
                      {selectedProject.url && (
                        <a href={selectedProject.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-all">
                          Access Live Node <FiExternalLink />
                        </a>
                      )}
                    </div>

                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 bg-zinc-900/30 border border-zinc-800 rounded-2xl flex gap-4 items-start shadow-inner">
                        <FiMessageSquare className="text-zinc-600 mt-1 flex-shrink-0" />
                        <p className="text-xs font-mono text-zinc-500 leading-relaxed italic">"{currentJoke}"</p>
                    </motion.div>

                    <div className="space-y-4">
                      <h4 className="text-[10px] uppercase tracking-[0.3em] text-zinc-700 font-black">Engineering Logic</h4>
                      <p className="text-xl text-zinc-400 font-light leading-relaxed">{selectedProject.longDesc}</p>
                    </div>

                    <div className="space-y-6">
                      <h4 className="text-[10px] uppercase tracking-[0.3em] text-zinc-700 font-black">Architecture Stack</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedProject.stack.map(tech => (
                          <span key={tech} className="px-4 py-2 bg-zinc-950 border border-zinc-900 rounded-sm text-[10px] font-mono text-zinc-500 uppercase tracking-widest">{tech}</span>
                        ))}
                      </div>
                    </div>
                </div>
              </div>
              <div className="p-8 border-t border-zinc-900 bg-[#050505]">
                 <p className="text-[9px] text-zinc-800 font-black uppercase tracking-[0.5em] text-center">Achede Virtual Archive // Vol. {selectedProject.id}</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Projects;