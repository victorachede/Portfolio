import { useState, useEffect } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { name: "Work", path: "/projects" },
  { name: "Learn", path: "/courses" },
  { name: "Writing", path: "/blog" },
  { name: "Signal", path: "/contact" }
];

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // EFFECT: Close menu automatically when the URL changes
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  // EFFECT: Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [menuOpen]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 h-24 flex items-center justify-between px-8 md:px-16 z-[100] bg-transparent">
        
        <Link to="/" className="z-[110] group">
          <span className="text-sm font-medium tracking-tighter text-zinc-100 uppercase">
            Achede<span className="text-zinc-600 font-normal">©</span>
          </span>
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-10">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `text-[11px] font-medium uppercase tracking-[0.2em] transition-colors ${
                  isActive ? "text-white" : "text-zinc-500 hover:text-zinc-200"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* MOBILE TRIGGER */}
        <button 
          className="md:hidden z-[110] text-zinc-400 text-[11px] font-bold uppercase tracking-widest"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "Close" : "Menu"}
        </button>

        {/* MOBILE OVERLAY */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-0 bg-black flex flex-col justify-center px-12 gap-6 md:hidden z-[105]"
            >
              {navItems.map((item, idx) => (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + idx * 0.05 }}
                >
                  <NavLink
                    to={item.path}
                    className="text-5xl font-light tracking-tighter text-zinc-500 hover:text-white transition-colors block"
                  >
                    {item.name}
                  </NavLink>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};

export default Header;