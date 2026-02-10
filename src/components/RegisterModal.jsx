import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown, Users, User, Rocket, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ref, push } from 'firebase/database';
import { db } from '../firebase';
import { useGoogleReCaptcha, GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

export default function RegisterModal({ isOpen, onClose, selectedEvent }) {
  if (!isOpen) return null;

  return (
      <GoogleReCaptchaProvider reCaptchaKey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}>
          <RegisterModalContent isOpen={isOpen} onClose={onClose} selectedEvent={selectedEvent} />
      </GoogleReCaptchaProvider>
  );
}

function RegisterModalContent({ isOpen, onClose, selectedEvent }) {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    mobileNumber: '',
    eventType: selectedEvent || '',
    teamName: '',
    member2Name: '',
    member2Email: '',
    member2Phone: '',
    member3Name: '',
    member3Email: '',
    member3Phone: '',
    email: ''
  });
  
  // Sync selectedEvent when it changes or when modal opens

  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (selectedEvent) {
      setFormData(prev => ({ ...prev, eventType: selectedEvent }));
    }
  }, [selectedEvent, isOpen]);

  const eventOptions = [
    "TECHVENTURES",
    "PRECISE PROMPT",
    "FIGMAFORGE",
    "BOARDROOM BATTLEGROUND",
    "bITeWARS",
    "PRODUCT PIONEERS"
  ];

  const teamEvents = ["BOARDROOM BATTLEGROUND", "bITeWARS"];
  const isTeamEvent = teamEvents.includes(formData.eventType);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!executeRecaptcha) {
        console.error("ReCAPTCHA hook not ready");
        alert("Security service is initializing. Please wait a moment and try again.");
        setIsSubmitting(false);
        return;
      }

      const token = await executeRecaptcha('registration_submit');
      if (!token) {
        alert("Security check failed. Please refresh and try again.");
        setIsSubmitting(false);
        return;
      }
      
      // Validate Logic (Basic)
      if (isTeamEvent && !formData.teamName) {
        alert("Team Name is required for this event.");
        setIsSubmitting(false);
        return;
      }
      
      // Basic Email Validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        alert("Please enter a valid email address.");
        setIsSubmitting(false);
        return;
      }

      // Validate team member emails for team events
      if (isTeamEvent) {
         if (formData.member2Email && !emailRegex.test(formData.member2Email)) {
             alert("Please enter a valid email for Member 2.");
             setIsSubmitting(false);
             return;
         }
         if (formData.member3Email && !emailRegex.test(formData.member3Email)) {
             alert("Please enter a valid email for Member 3.");
             setIsSubmitting(false);
             return;
         }
      }

      // Safe Data Construction
      const submissionData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        mobileNumber: formData.mobileNumber,
        eventType: formData.eventType,
        email: formData.email,
        timestamp: new Date().toISOString()
      };

      if (isTeamEvent) {
        submissionData.teamName = formData.teamName;
        submissionData.member2Name = formData.member2Name;
        submissionData.member2Email = formData.member2Email;
        submissionData.member2Phone = formData.member2Phone;
        submissionData.member3Name = formData.member3Name;
        submissionData.member3Email = formData.member3Email;
        submissionData.member3Phone = formData.member3Phone;
      }

      // Push to Firebase
      const registrationsRef = ref(db, 'registrations');
      await push(registrationsRef, submissionData);

      setIsSuccess(true);
      setIsSubmitting(false);

    } catch (error) {
      console.error("Error submitting registration:", error);
      alert("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    onClose();
    setTimeout(() => {
        setIsSuccess(false);
         setFormData({
            firstName: '',
            lastName: '',
            mobileNumber: '',
            eventType: '',
            teamName: '',
            member2Name: '',
            member2Email: '',
            member2Phone: '',
            member3Name: '',
            member3Email: '',
            member3Phone: '',
            email: ''
        });
    }, 500);
  };

  
  // if (!isOpen) return null; // MOVED TO OUTER COMPONENT

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 font-sans">
           {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, filter: "blur(10px)" }}
            transition={{ type: "spring", duration: 0.6, bounce: 0.3 }}
            className={`relative bg-[#050505] border-2 border-brand-red/50 w-full max-w-2xl rounded-3xl p-8 md:p-10 shadow-[0_0_50px_rgba(194,0,35,0.3)] overflow-hidden max-h-[90vh] ${isSuccess ? '' : 'overflow-y-auto'}`}
          >
             <button
              onClick={onClose}
              className="absolute top-6 right-6 text-white/50 hover:text-brand-orange transition-colors z-20"
            >
              <X size={24} />
            </button> 

            {/* Form Content */}             {isSuccess ? (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative z-10 flex flex-col items-center justify-center text-center py-12"
                >
                    <div className="w-20 h-20 rounded-full bg-gradient-to-r from-brand-red to-brand-orange flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(255,102,0,0.5)]">
                        <CheckCircle size={40} className="text-white" />
                    </div>
                    <h2 className="text-3xl font-bold mb-2 text-white font-tech tracking-widest">
                        REGISTRATION COMPLETE
                    </h2>
                    <p className="text-xl text-brand-yellow font-bold mb-2 font-mono">
                        {formData.firstName} {formData.lastName}
                    </p>
                    <p className="text-white/60 mb-8 max-w-xs mx-auto">
                        Your spot for <span className="text-brand-orange">{formData.eventType}</span> has been confirmed.
                    </p>
                    <button 
                        onClick={handleCloseModal}
                        className="px-8 py-3 bg-white/10 border border-white/20 hover:border-brand-orange hover:bg-brand-orange hover:text-black rounded text-white font-mono uppercase tracking-widest text-sm transition-all duration-300"
                    >
                        Close
                    </button>
                </motion.div>
             ) : (             <div className="relative z-10">
                <h2 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-[linear-gradient(to_right,#c20023,#ff6600,#fffb00)] drop-shadow-lg pb-1">
                    Mission Registration
                </h2>
                <p className="text-white mb-8 text-lg">Secure your spot in the next era of growth.</p>

                <form className="space-y-5" onSubmit={handleSubmit}>
                   {/* Personal Info Grid */}
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-1">
                        <label className="text-sm font-mono text-white uppercase tracking-widest pl-1">First Name <span className="text-brand-red">*</span></label>
                        <input 
                            required 
                            type="text" 
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className="w-full bg-white/5 border border-brand-red/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-orange focus:bg-white/10 transition-all placeholder:text-white/30 validated-input" 
                            placeholder="Neo" 
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-mono text-white uppercase tracking-widest pl-1">Last Name <span className="text-brand-red">*</span></label>
                        <input 
                            required 
                            type="text" 
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            className="w-full bg-white/5 border border-brand-red/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-orange focus:bg-white/10 transition-all placeholder:text-white/30 validated-input" 
                            placeholder="Anderson" 
                        />
                      </div>
                   </div>
                   
                   {/* Event Selection */}
                   <div className="space-y-1">
                      <label className="text-sm font-mono text-white uppercase tracking-widest pl-1">Target Mission (Event) <span className="text-brand-red">*</span></label>
                      <div className="relative">
                        <select 
                            required
                            name="eventType"
                            value={formData.eventType}
                            onChange={handleChange}
                            style={{ colorScheme: 'dark' }}
                            className="w-full bg-white/5 border border-brand-red/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-orange focus:bg-white/10 transition-all appearance-none cursor-pointer validated-input"
                        >
                            <option value="" disabled className="bg-[#050505] text-white">Select an Event</option>
                            {eventOptions.map(evt => <option key={evt} value={evt} className="bg-[#050505] text-white hover:bg-brand-orange hover:text-black">{evt}</option>)}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" size={18} />
                      </div>
                   </div>

                   {/* Conditional Team Fields */}
                   <AnimatePresence mode="popLayout">
                        {isTeamEvent && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="space-y-5 overflow-hidden"
                            >
                                <div className="p-5 border border-brand-red border-opacity-30 bg-brand-red bg-opacity-5 rounded-xl space-y-4">
                                    <div className="flex items-center gap-2 text-white mb-2">
                                        <Users size={16} />
                                        <span className="text-sm font-bold uppercase tracking-widest">Squad Details</span>
                                    </div>
                                    
                                    <div className="space-y-1">
                                        <label className="text-sm font-mono text-white uppercase tracking-widest pl-1">Team Name <span className="text-red-500">*</span></label>
                                        <input 
                                            required 
                                            type="text" 
                                            name="teamName"
                                            value={formData.teamName}
                                            onChange={handleChange}
                                            className="w-full bg-black/20 border border-brand-red border-opacity-20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-red border-opacity-50 transition-all validated-input" 
                                            placeholder="The Avengers" 
                                        />
                                    </div>

                                    {/* Member 2 */}
                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                                        <div className="md:col-span-4 space-y-1">
                                            <label className="text-sm font-mono text-white uppercase pl-1">Member 2 Name (Optional)</label>
                                            <input 
                                                type="text" 
                                                name="member2Name"
                                                value={formData.member2Name}
                                                onChange={handleChange}
                                                className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-red border-opacity-50 transition-all" 
                                            />
                                        </div>
                                         <div className="md:col-span-4 space-y-1">
                                            <label className="text-sm font-mono text-white uppercase pl-1">Member 2 Email (Optional)</label>
                                            <input 
                                                type="email" 
                                                name="member2Email"
                                                value={formData.member2Email}
                                                onChange={handleChange}
                                                className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-red border-opacity-50 transition-all" 
                                            />
                                        </div>
                                        <div className="md:col-span-4 space-y-1">
                                            <label className="text-sm font-mono text-white uppercase pl-1">Member 2 Phone (Optional)</label>
                                            <input 
                                                type="tel" 
                                                name="member2Phone"
                                                value={formData.member2Phone}
                                                onChange={handleChange}
                                                className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-red border-opacity-50 transition-all" 
                                            />
                                        </div>
                                    </div>

                                    {/* Member 3 */}
                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                                        <div className="md:col-span-4 space-y-1">
                                            <label className="text-xs font-mono text-white uppercase pl-1">Member 3 Name (Optional)</label>
                                            <input 
                                                type="text" 
                                                name="member3Name"
                                                value={formData.member3Name}
                                                onChange={handleChange}
                                                className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-red border-opacity-50 transition-all" 
                                            />
                                        </div>
                                         <div className="md:col-span-4 space-y-1">
                                            <label className="text-xs font-mono text-white uppercase pl-1">Member 3 Email (Optional)</label>
                                            <input 
                                                type="email" 
                                                name="member3Email"
                                                value={formData.member3Email}
                                                onChange={handleChange}
                                                className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-red border-opacity-50 transition-all" 
                                            />
                                        </div>
                                        <div className="md:col-span-4 space-y-1">
                                            <label className="text-xs font-mono text-white uppercase pl-1">Member 3 Phone (Optional)</label>
                                            <input 
                                                type="tel" 
                                                name="member3Phone"
                                                value={formData.member3Phone}
                                                onChange={handleChange}
                                                className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-red border-opacity-50 transition-all" 
                                            />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                   </AnimatePresence>
                   
                   {/* Standard Contact Info */}
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                       <div className="space-y-1">
                          <label className="text-xs font-mono text-white uppercase tracking-widest pl-1">Email <span className="text-brand-red">*</span></label>
                          <input 
                              required 
                              type="email" 
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              className="w-full bg-white/5 border border-brand-red/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-orange focus:bg-white/10 transition-all placeholder:text-white/30 validated-input" 
                              placeholder="neo@matrix.com" 
                          />
                       </div>
                       <div className="space-y-1">
                          <label className="text-xs font-mono text-white uppercase tracking-widest pl-1">Mobile (WhatsApp) <span className="text-brand-red">*</span></label>
                          <input 
                              required 
                              type="tel" 
                              name="mobileNumber"
                              value={formData.mobileNumber}
                              onChange={handleChange}
                              className="w-full bg-white/5 border border-brand-red/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-orange focus:bg-white/10 transition-all placeholder:text-white/30 validated-input" 
                              placeholder="+91 98765 43210" 
                          />
                       </div>
                   </div>
                   
                   <div className="pt-4">
                      <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full flex items-center justify-center gap-2 px-6 py-4 border border-brand-orange text-white bg-transparent rounded-full font-bold tracking-[0.2em] uppercase hover:bg-brand-orange hover:text-black transition-all transform hover:scale-105 group relative disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                          <span className="flex items-center justify-center gap-2">
                             {isSubmitting ? 'INITIATING...' : 'INITIATE REGISTRATION'}
                          </span>
                      </button>
                   </div>
                </form>
             </div>
             )}
             
             {/* Decorative Background Elements */}
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-red/15 rounded-full blur-[120px] -mr-32 -mt-32 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-orange/10 rounded-full blur-[120px] -ml-20 -mb-20 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#ffd700]/5 rounded-full blur-[80px] pointer-events-none" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
