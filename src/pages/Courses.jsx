import React, { useState, useMemo, useEffect } from 'react';
import { FiArrowRight, FiCheck, FiCopy, FiX, FiSearch } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import emailjs from '@emailjs/browser';
import AnimatedOnView from "../components/AnimatedOnView";
import SEO from '../components/SEO';

const Courses = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [copied, setCopied] = useState(false);

    const bankDetails = "9040237109";

    const coursesData = useMemo(() => [
        { 
            id: '01', title: 'Distributed Infra', category: 'Architecture', price: 150000,
            longDesc: "Deep dive into building systems that never fail. Coverage includes global load balancing, database sharding, and consensus algorithms.",
            syllabus: ["Global Edge Routing", "Multi-region Replication", "Kubernetes Orchestration", "Zero-Trust Security"],
            specs: { duration: "8 Weeks", level: "L4 Engineer", tools: "Go / K8s / Redis" }
        },
        { 
            id: '02', title: 'Applied Intelligence', category: 'AI/ML', price: 125000,
            longDesc: "Build custom RAG pipelines, fine-tune open-source models (Llama 3), and manage vector embeddings at scale.",
            syllabus: ["Vector DB Design", "Prompt Engineering Patterns", "Model Quantization", "Agentic Frameworks"],
            specs: { duration: "6 Weeks", level: "Mid-Senior", tools: "Python / Pinecone / LangChain" }
        },
        { 
            id: '03', title: 'Next.js Engine', category: 'Frontend', price: 85000,
            longDesc: "Master the internals of Next.js. Server Components, advanced hydration strategies, and edge-side rendering for performance.",
            syllabus: ["RSC Architecture", "Partial Prerendering", "Streaming SSR", "Middleware Auth"],
            specs: { duration: "4 Weeks", level: "Intermediate", tools: "TS / Next.js / Vercel" }
        },
        ...Array.from({ length: 47 }, (_, i) => ({
            id: (i + 4).toString().padStart(2, '0'),
            title: i % 3 === 0 ? `Scalable Systems ${i+4}` : `Backend Core ${i+4}`,
            category: i % 2 === 0 ? 'Engineering' : 'Systems Design',
            price: 45000 + (i * 1500),
            longDesc: "Specialized engineering module focused on industrial-grade software patterns and efficiency.",
            syllabus: ["Performance Profiling", "Memory Management", "CI/CD Automations", "Security Auditing"],
            specs: { duration: "2 Weeks", level: "L2-L3", tools: "Production Ready" }
        }))
    ], []);

    // TRACKER & AUTO-REPLY LOGIC
    const sendAlertEmail = (course) => {
        const emailData = {
            course_title: course.title,
            course_id: course.id,
            time: new Date().toLocaleString('en-GB', { timeZone: 'Africa/Lagos' })
        };

        emailjs.send(
            'service_jq7kamg',    // Service ID
            'template_tesirae',   // Template ID
            emailData, 
            'HbgcpHcHNV2pBEO0w'   // Public Key
        )
        .then(() => console.log("Protocol Alert: Email Sent Successfully"))
        .catch((err) => console.log("Protocol Error: Check EmailJS Dashboard Configuration"));
    };

    const filtered = coursesData.filter(c => 
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const copyAccount = () => {
        navigator.clipboard.writeText(bankDetails);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    useEffect(() => {
        if (selectedCourse) {
            document.body.style.overflow = 'hidden';
            sendAlertEmail(selectedCourse); 
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [selectedCourse]);

    return (
        <div className="min-h-screen bg-black text-white selection:bg-zinc-800">
            <SEO title="Protocol // Academy" />

            <section className="max-w-7xl mx-auto px-8 pt-32 pb-40">
                <div className="sticky top-0 z-40 bg-black pt-4 pb-12 border-b border-zinc-900 mb-12 flex flex-col md:flex-row justify-between items-baseline gap-6">
                    <h1 className="text-4xl font-medium tracking-tighter">
                        Protocol. <span className="text-zinc-600 italic">Curriculum</span>
                    </h1>
                    <div className="relative w-full md:w-80">
                        <FiSearch className="absolute left-0 top-1/2 -translate-y-1/2 text-zinc-700" size={14} />
                        <input 
                            type="text"
                            placeholder="FILTER 50+ MODULES..."
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-transparent border-none pl-6 py-2 text-[10px] tracking-[0.3em] uppercase focus:outline-none placeholder:text-zinc-800 text-zinc-100"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12">
                    {filtered.map((course) => (
                        <div 
                            key={course.id} 
                            onClick={() => setSelectedCourse(course)}
                            className="group py-6 border-b border-zinc-900 cursor-pointer flex justify-between items-center hover:bg-zinc-950/50 transition-all px-2"
                        >
                            <div className="flex flex-col">
                                <span className="text-[9px] font-mono text-zinc-700 mb-1 tracking-widest">ID_{course.id}</span>
                                <h3 className="text-base font-medium tracking-tight text-zinc-400 group-hover:text-white transition-colors">
                                    {course.title}
                                </h3>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-[11px] text-zinc-600 font-mono">₦{(course.price/1000).toFixed(0)}K</span>
                                <FiArrowRight className="text-zinc-800 group-hover:text-white group-hover:translate-x-1 transition-all" size={14} />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <AnimatePresence>
                {selectedCourse && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setSelectedCourse(null)}
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[150]" 
                        />
                        <motion.div 
                            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 h-full w-full md:w-[500px] bg-[#050505] border-l border-zinc-800 z-[160] p-8 md:p-12 overflow-y-auto"
                        >
                            <button onClick={() => setSelectedCourse(null)} className="mb-12 text-zinc-500 hover:text-white flex items-center gap-2 text-[10px] uppercase tracking-widest transition-colors">
                                <FiX /> Close Protocol
                            </button>

                            <div className="space-y-12">
                                <header className="space-y-6">
                                    <span className="px-2 py-1 bg-zinc-900 text-zinc-500 text-[9px] uppercase tracking-widest rounded-sm">
                                        {selectedCourse.category}
                                    </span>
                                    <h2 className="text-5xl font-medium tracking-tighter leading-[0.9]">
                                        {selectedCourse.title}
                                    </h2>
                                    <p className="text-zinc-400 leading-relaxed font-light text-lg">
                                        {selectedCourse.longDesc}
                                    </p>
                                </header>

                                <div className="grid grid-cols-3 gap-6 border-y border-zinc-900 py-10">
                                    {Object.entries(selectedCourse.specs).map(([label, val]) => (
                                        <div key={label}>
                                            <p className="text-[8px] uppercase tracking-[0.2em] text-zinc-600 mb-2">{label}</p>
                                            <p className="text-xs font-medium text-zinc-200">{val}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-6">
                                    <h4 className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-bold">Curriculum Breakout</h4>
                                    <div className="space-y-4">
                                        {selectedCourse.syllabus.map((item, i) => (
                                            <div key={i} className="flex items-start gap-3 text-sm text-zinc-400 group">
                                                <span className="text-zinc-800 font-mono text-[10px] pt-1">0{i+1}</span>
                                                <span className="group-hover:text-zinc-100 transition-colors">{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-10">
                                    <div className="bg-zinc-900/40 p-8 rounded-3xl border border-zinc-800 space-y-6">
                                        <div className="flex justify-between items-end">
                                            <div className="space-y-1">
                                                <p className="text-[8px] text-zinc-600 uppercase tracking-widest">Enrollment Fee</p>
                                                <p className="text-3xl font-medium tracking-tighter">₦{selectedCourse.price.toLocaleString()}</p>
                                            </div>
                                            <button 
                                                onClick={copyAccount} 
                                                className={`text-[10px] uppercase tracking-widest px-6 py-3 rounded-full font-bold transition-all ${copied ? 'bg-emerald-500 text-black' : 'bg-white text-black hover:bg-zinc-200'}`}
                                            >
                                                {copied ? "Copied" : "Get Account Details"}
                                            </button>
                                        </div>
                                        <div className="pt-4 border-t border-zinc-800">
                                            <p className="text-[9px] text-zinc-500 leading-relaxed uppercase tracking-widest">
                                                Bank: OPAY / Number: 9040237109 <br />
                                                Finalize by sending proof to victorachede@gmail.com
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Courses;