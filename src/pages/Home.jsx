import React from "react";
import { FiArrowRight, FiGithub, FiTwitter } from "react-icons/fi";
import { techIcons } from "../data/tech";
import AnimatedOnView from "../components/AnimatedOnView";
import SEO from '../components/SEO';

const Home = () => {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-zinc-800">
      <SEO title="Victor Achede // Software Engineer" />

      <section className="max-w-5xl mx-auto px-8 pt-40 pb-20">
        
        {/* CLEAN HERO */}
        <div className="max-w-3xl space-y-10 mb-40">
          <AnimatedOnView>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/30 text-zinc-400 text-xs font-medium tracking-tight">
              <span className="h-1.5 w-1.5 rounded-full bg-zinc-500"></span>
              Available for new projects
            </div>
          </AnimatedOnView>

          <AnimatedOnView delay={0.1}>
            <h1 className="text-5xl md:text-7xl font-semibold tracking-tight leading-[1.1] text-zinc-100">
              Developing products with <br />
              <span className="text-zinc-500">technical precision.</span>
            </h1>
          </AnimatedOnView>

          <AnimatedOnView delay={0.2}>
            <p className="text-zinc-400 text-lg md:text-xl font-normal leading-relaxed">
              Victor Achede. I specialize in building refined web applications 
              and scalable architecture. Currently focused on React, Node, and Cloud Infrastructure.
            </p>
          </AnimatedOnView>

          <AnimatedOnView delay={0.3}>
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center pt-4">
              <a href="/projects" className="group flex items-center gap-2 px-6 py-3 bg-white text-black rounded-md text-sm font-medium hover:bg-zinc-200 transition-all">
                View Projects <FiArrowRight className="group-hover:translate-x-0.5 transition-transform" />
              </a>
              <div className="flex gap-6 items-center">
                 <a href="https://github.com/victorachede" className="text-zinc-500 hover:text-zinc-100 transition-colors">
                  <FiGithub size={20} />
                </a>
                <a href="https://x.com/victorachede" className="text-zinc-500 hover:text-zinc-100 transition-colors">
                  <FiTwitter size={20} />
                </a>
              </div>
            </div>
          </AnimatedOnView>
        </div>

        {/* TECH STACK - MINIMAL GRID */}
        <div className="border-t border-zinc-900 pt-16">
          <AnimatedOnView>
            <h2 className="text-zinc-500 text-xs font-medium uppercase tracking-[0.2em] mb-12">Expertise</h2>
          </AnimatedOnView>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-y-12 gap-x-8">
            {techIcons.map(({ Icon, label }, idx) => (
              <AnimatedOnView key={label} delay={idx * 0.02}>
                <div className="flex items-center gap-3 group">
                  <Icon size={18} className="text-zinc-600 group-hover:text-zinc-100 transition-colors" />
                  <span className="text-sm font-medium text-zinc-500 group-hover:text-zinc-100 transition-colors">{label}</span>
                </div>
              </AnimatedOnView>
            ))}
          </div>
        </div>

      </section>
    </div>
  );
};

export default Home;