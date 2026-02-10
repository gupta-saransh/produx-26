import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CustomAlert = ({ isOpen, message, onClose, type = 'error' }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Alert Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-black border border-white/10 rounded-xl p-6 md:p-8 max-w-md w-full shadow-2xl overflow-hidden"
          >
            {/* Glow Effects */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-red/20 rounded-full blur-[50px] -mr-16 -mt-16 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand-orange/20 rounded-full blur-[50px] -ml-16 -mb-16 pointer-events-none" />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center text-center">
              {/* Icon based on type */}
              <div className="mb-4">
                {type === 'success' ? (
                   <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/50 text-green-500 text-2xl">
                     ✓
                   </div>
                ) : (
                   <div className="w-12 h-12 rounded-full bg-brand-red/20 flex items-center justify-center border border-brand-red/50 text-brand-red text-2xl font-bold">
                     !
                   </div>
                )}
              </div>

              <h3 className="text-xl md:text-2xl font-bold text-white mb-2 tracking-wider">
                {type === 'success' ? 'SUCCESS' : 'ATTENTION'}
              </h3>
              
              <p className="text-gray-300 text-sm md:text-base mb-6 leading-relaxed">
                {message}
              </p>

              <button
                onClick={onClose}
                className="group relative px-6 py-2 bg-white/5 hover:bg-white/10 border border-brand-orange/60 hover:border-brand-orange rounded overflow-hidden transition-all duration-300"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-500" />
                <span className="relative text-white font-medium tracking-wide">
                  OK
                </span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CustomAlert;
