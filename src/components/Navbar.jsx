import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Rocket } from 'lucide-react';
import RegisterModal from './RegisterModal';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { label: 'HOME', href: '/' },
    { label: 'ABOUT', href: '/about' },
    { label: 'EVENTS', href: '/events' },
    { label: 'SHOWCASE', href: '/showcase' },
    { label: 'TEAM', href: '/team' },
    { label: 'CONTACT', href: '/contact' },
  ];

  const menuVariants = {
    closed: {
      opacity: 0,
      transition: {
        duration: 0.5,
        ease: [0.76, 0, 0.24, 1],
      },
    },
    open: {
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.76, 0, 0.24, 1],
      },
    },
  };

  const linkVariants = {
    closed: { y: 50, opacity: 0 },
    open: (i) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: [0.76, 0, 0.24, 1],
      },
    }),
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 px-4 md:px-8 lg:px-16 transition-all duration-300" style={{ paddingTop: isScrolled ? '0.5rem' : '0.75rem', paddingBottom: isScrolled ? '0.5rem' : '0.75rem' }}>
        <div className="flex items-center justify-between border border-white/10 rounded-full backdrop-blur-sm bg-black/20 transition-all duration-300" style={{ paddingLeft: isScrolled ? '1rem' : '1.2rem', paddingRight: isScrolled ? '1rem' : '1.2rem', paddingTop: isScrolled ? '0.5rem' : '0.6rem', paddingBottom: isScrolled ? '0.5rem' : '0.6rem' }}>
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center text-white"
          >
            <Link 
              to="/" 
              className={`rounded-full flex items-center justify-center p-1 overflow-hidden transition-all duration-300 hover:opacity-80 ${isScrolled ? 'w-10 h-10 md:w-12 md:h-12' : 'w-12 h-12 md:w-14 md:h-14'}`}
            >
              <img src="/logo/IIMS_Logo.png" alt="IIM Shillong" className="h-full w-full object-contain" />
            </Link>
            <div className="w-[1px] h-6 bg-white/30 ml-3 mr-4"></div>
            <Link to="/" className="flex items-center gap-2">
              <img src="/logo/produx_logo.svg" alt="ProdUX" className={`w-auto object-contain transition-all duration-300 ${isScrolled ? 'h-5 md:h-8' : 'h-6 md:h-9'}`} />
              <span className={`font-bold tracking-wide transition-all duration-300 ${isScrolled ? 'text-lg md:text-xl' : 'text-lg md:text-2xl'}`}>ProdUX'26</span>
            </Link>
          </motion.div>

          {/* Desktop Nav */}
          <motion.div
            className="hidden min-[1155px]:flex items-center gap-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {menuItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.label}
                  to={item.href}
                  className={`font-medium transition-all rounded-full ${isScrolled ? 'text-lg px-2.5 py-1' : 'text-xl px-3 py-1.5'} ${
                    isActive 
                      ? 'bg-white text-black' 
                      : 'text-white/70 hover:text-black hover:bg-white'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </motion.div>

          {/* CTA Button */}
          <motion.button
            onClick={() => setIsRegisterOpen(true)}
            className={`hidden min-[1155px]:flex items-center gap-2 bg-brand-orange text-white rounded-full font-bold tracking-[0.2em] uppercase shadow-[0_0_20px_rgba(255,102,0,0.5)] hover:shadow-[0_0_35px_rgba(255,102,0,0.9)] transition-all transform hover:scale-105 group relative ${isScrolled ? 'px-4 py-1.5 text-sm' : 'px-5 py-2 text-sm'}`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Rocket size={20} className="group-hover:rotate-12 transition-transform" />
            REGISTER NOW
          </motion.button>

          {/* Mobile Menu Button */}
          <motion.button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="min-[1155px]:hidden z-50 flex flex-col gap-1.5 p-2 cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <motion.span
              className="w-8 h-0.5 bg-white block"
              animate={{
                rotate: isMenuOpen ? 45 : 0,
                y: isMenuOpen ? 8 : 0,
              }}
            />
            <motion.span
              className="w-8 h-0.5 bg-white block"
              animate={{ opacity: isMenuOpen ? 0 : 1 }}
            />
            <motion.span
              className="w-8 h-0.5 bg-white block"
              animate={{
                rotate: isMenuOpen ? -45 : 0,
                y: isMenuOpen ? -8 : 0,
              }}
            />
          </motion.button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-[#0a0a0a]/95 backdrop-blur-xl flex flex-col items-center justify-center pt-24"
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            <div className="flex flex-col items-center gap-6">
              {menuItems.map((item, i) => {
                const isActive = location.pathname === item.href;
                return (
                  <motion.div
                    key={item.label}
                    variants={linkVariants}
                    custom={i}
                    initial="closed"
                    animate="open"
                    exit="closed"
                  >
                     <Link
                      to={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`text-4xl md:text-5xl font-bold transition-colors cursor-pointer tracking-tight ${
                        isActive ? 'text-brand-orange' : 'text-white hover:text-brand-orange'
                      }`}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                );
              })}
              <motion.button
                onClick={() => {
                  setIsRegisterOpen(true);
                  setIsMenuOpen(false);
                }}
                className="mt-6 px-6 py-2 bg-brand-orange text-white rounded-full text-xl font-bold tracking-[0.2em] uppercase shadow-[0_0_20px_rgba(255,102,0,0.5)] transition-all flex items-center gap-2"
                variants={linkVariants}
                custom={menuItems.length}
                initial="closed"
                animate="open"
                exit="closed"
              >
                <Rocket size={22} />
                REGISTER NOW
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <RegisterModal isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} />
    </>
  );
}
