import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home } from 'lucide-react';
import NetworkBackground from './NetworkBackground';

export default function NotFound() {
  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <NetworkBackground />
      </div>
      
      <div className="relative z-10 text-center px-4">
        <motion.h1 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 0.8 }}
          className="text-9xl font-bold font-tech text-transparent bg-clip-text bg-gradient-to-r from-brand-red via-brand-orange to-[#fffb00] mb-4"
        >
          404
        </motion.h1>
        
        <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
        >
            <h2 className="text-2xl md:text-4xl font-mono mb-6 uppercase tracking-widest">
                Mission Aborted
            </h2>
            <p className="text-white/60 max-w-md mx-auto mb-8 font-light">
                The coordinates you are trying to reach do not exist in this sector.
                Please return to base immediately.
            </p>
            
            <Link 
                to="/"
                className="inline-flex items-center gap-2 px-8 py-3 bg-brand-orange/10 border border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-black rounded-full font-bold tracking-widest uppercase transition-all group"
            >
                <Home size={18} />
                <span>Return to Base</span>
            </Link>
        </motion.div>
      </div>
      
      {/* Glitch Overlay Effect */}
      <div className="absolute inset-0 pointer-events-none opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
    </div>
  );
}
