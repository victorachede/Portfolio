import { FiMail, FiPhone, FiTwitter, FiArrowUpRight } from "react-icons/fi";
import AnimatedOnView from "../components/AnimatedOnView";

const Contact = () => {
  return (
    <section className="bg-black text-white py-24 px-8">
      <div className="max-w-5xl mx-auto">
        
        {/* THE BIG TITLE */}
        <div className="mb-20">
          <p className="text-zinc-600 text-[10px] tracking-widest uppercase mb-2">Ready to start?</p>
          <h2 className="text-6xl font-medium tracking-tighter">
            Get in <span className="text-zinc-800 italic">Touch.</span>
          </h2>
        </div>

        {/* THE INFO GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 border border-zinc-900">
          
          {/* EMAIL */}
          <a href="mailto:victorachede@gmail.com" className="p-10 border-b md:border-b-0 md:border-r border-zinc-900 hover:bg-zinc-950 transition-all">
            <FiMail className="mb-10 text-zinc-500" />
            <p className="text-[10px] text-zinc-600 uppercase mb-1">Email</p>
            <p className="text-sm">victorachede@gmail.com</p>
          </a>

          {/* PHONE */}
          <div className="p-10 border-b md:border-b-0 md:border-r border-zinc-900 hover:bg-zinc-950 transition-all">
            <FiPhone className="mb-10 text-zinc-500" />
            <p className="text-[10px] text-zinc-600 uppercase mb-1">Phone</p>
            <p className="text-sm">+234 9040237109</p>
          </div>

          {/* X (TWITTER) */}
          <a href="https://x.com/victorachede" target="_blank" className="p-10 hover:bg-zinc-950 transition-all">
            <FiTwitter className="mb-10 text-zinc-500" />
            <p className="text-[10px] text-zinc-600 uppercase mb-1">X / Twitter</p>
            <p className="text-sm">@victorachede</p>
          </a>

        </div>
      </div>
    </section>
  );
};

export default Contact;