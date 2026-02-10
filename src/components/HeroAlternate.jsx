import { useRef, useState, useEffect, useMemo } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Particle System that forms text
function ParticleText() {
  const meshRef = useRef();
  const { mouse, viewport } = useThree();
  const [hovered, setHovered] = useState(false);
  
  // Create particle positions
  const particles = useMemo(() => {
    const temp = [];
    const gridSize = 50;
    const spacing = 0.3;
    
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        temp.push({
          position: [
            (i - gridSize / 2) * spacing,
            (j - gridSize / 2) * spacing,
            (Math.random() - 0.5) * 2
          ],
          originalZ: (Math.random() - 0.5) * 2,
          speed: Math.random() * 0.5 + 0.5,
          offset: Math.random() * Math.PI * 2
        });
      }
    }
    return temp;
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime;
      const positions = meshRef.current.geometry.attributes.position.array;
      
      particles.forEach((particle, i) => {
        const i3 = i * 3;
        const mouseInfluence = 2;
        const mouseX = mouse.x * viewport.width / 2;
        const mouseY = mouse.y * viewport.height / 2;
        
        const dx = positions[i3] - mouseX;
        const dy = positions[i3 + 1] - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < mouseInfluence) {
          positions[i3] += (dx / dist) * 0.05;
          positions[i3 + 1] += (dy / dist) * 0.05;
        } else {
          // Return to original position
          positions[i3] = THREE.MathUtils.lerp(positions[i3], particle.position[0], 0.01);
          positions[i3 + 1] = THREE.MathUtils.lerp(positions[i3 + 1], particle.position[1], 0.01);
        }
        
        // Wave motion
        positions[i3 + 2] = particle.originalZ + Math.sin(time * particle.speed + particle.offset) * 0.5;
      });
      
      meshRef.current.geometry.attributes.position.needsUpdate = true;
      meshRef.current.rotation.y = Math.sin(time * 0.1) * 0.1;
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length}
          array={new Float32Array(particles.flatMap(p => p.position))}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#EA912D"
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Orbiting rings
function OrbitingRings() {
  const group = useRef();
  
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.x = state.clock.elapsedTime * 0.2;
      group.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <group ref={group}>
      {[...Array(3)].map((_, i) => (
        <mesh key={i} rotation={[0, 0, (i * Math.PI) / 3]}>
          <torusGeometry args={[3 + i * 0.5, 0.03, 16, 100]} />
          <meshStandardMaterial
            color={i === 0 ? '#c20023' : i === 1 ? '#EA912D' : '#FFD700'}
            emissive={i === 0 ? '#c20023' : i === 1 ? '#EA912D' : '#FFD700'}
            emissiveIntensity={1}
            transparent
            opacity={0.6}
          />
        </mesh>
      ))}
    </group>
  );
}

// Glitch text effect
function GlitchText({ children, delay = 0 }) {
  const [isGlitching, setIsGlitching] = useState(false);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 100);
    }, 3000 + Math.random() * 2000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay }}
    >
      <div className="relative">
        {children}
        {isGlitching && (
          <>
            <div
              className="absolute inset-0 text-red-500"
              style={{
                transform: 'translate(-2px, -2px)',
                opacity: 0.8,
                mixBlendMode: 'screen'
              }}
            >
              {children}
            </div>
            <div
              className="absolute inset-0 text-cyan-500"
              style={{
                transform: 'translate(2px, 2px)',
                opacity: 0.8,
                mixBlendMode: 'screen'
              }}
            >
              {children}
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}

// Typing animation component
function TypingText({ text, delay = 0 }) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const startTimeout = setTimeout(() => {
      if (currentIndex < text.length) {
        const timeout = setTimeout(() => {
          setDisplayText(text.slice(0, currentIndex + 1));
          setCurrentIndex(currentIndex + 1);
        }, 50);
        return () => clearTimeout(timeout);
      }
    }, delay);

    return () => clearTimeout(startTimeout);
  }, [currentIndex, text, delay]);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <span>
      {displayText}
      {currentIndex < text.length && showCursor && (
        <span className="animate-pulse text-orange-500">|</span>
      )}
    </span>
  );
}

// Interactive countdown with hover effects
const InteractiveCountdown = () => {
  const calculateTimeLeft = () => {
    const targetDate = new Date('February 16, 2026 12:00:00').getTime();
    const now = new Date().getTime();
    const difference = targetDate - now;

    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearTimeout(timer);
  });

  return (
    <div className="flex gap-4 md:gap-6 mt-8">
      {Object.keys(timeLeft).map((interval, index) => (
        <motion.div
          key={interval}
          className="relative group"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
          whileHover={{ scale: 1.1 }}
        >
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-orange-500/20 to-red-600/20 backdrop-blur-sm border border-orange-500/30 p-4 md:p-6">
            {/* Animated background */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-orange-500/0 to-red-600/40"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
            
            <div className="relative z-10 flex flex-col items-center">
              <motion.span
                className="text-3xl md:text-5xl font-bold font-mono tabular-nums"
                style={{
                  backgroundImage: 'linear-gradient(135deg, #EA912D 0%, #FFD700 50%, #c20023 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
                key={timeLeft[interval]}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {String(timeLeft[interval] || '0').padStart(2, '0')}
              </motion.span>
              <span className="text-xs md:text-sm text-white/60 uppercase tracking-[0.2em] mt-2 font-medium">
                {interval}
              </span>
            </div>
            
            {/* Hover glow effect */}
            <motion.div
              className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                boxShadow: '0 0 20px rgba(234, 145, 45, 0.5), inset 0 0 20px rgba(234, 145, 45, 0.1)'
              }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// Mouse follower effect
function MouseFollower() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const springConfig = { damping: 25, stiffness: 150 };
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, []);

  useEffect(() => {
    x.set(mousePosition.x);
    y.set(mousePosition.y);
  }, [mousePosition, x, y]);

  return (
    <>
      <motion.div
        className="fixed w-96 h-96 rounded-full pointer-events-none z-0"
        style={{
          x,
          y,
          translateX: '-50%',
          translateY: '-50%',
          background: 'radial-gradient(circle, rgba(234, 145, 45, 0.15) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />
      <motion.div
        className="fixed w-4 h-4 rounded-full bg-orange-500/50 pointer-events-none z-50 mix-blend-screen"
        style={{
          x,
          y,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />
    </>
  );
}

export default function HeroAlternate() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden bg-[#0a0a0a]"
    >
      {/* Mouse follower */}
      <MouseFollower />

      {/* 3D Canvas Background */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 8], fov: 75 }} gl={{ alpha: true, antialias: true }}>
          <ambientLight intensity={0.3} />
          <pointLight position={[10, 10, 10]} intensity={1} color="#EA912D" />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#c20023" />
          <ParticleText />
          <OrbitingRings />
          <fog attach="fog" args={['#0a0a0a', 5, 15]} />
        </Canvas>
      </div>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/50 via-transparent to-[#0a0a0a] z-10 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-transparent to-red-500/5 z-10 pointer-events-none" />

      {/* Scanline effect */}
      <div className="absolute inset-0 z-10 pointer-events-none opacity-10">
        <div className="w-full h-full" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.05) 2px, rgba(255,255,255,0.05) 4px)'
        }} />
      </div>

      {/* Content */}
      <motion.div
        className="relative z-20 h-full flex flex-col items-center justify-center px-6 text-center"
        style={{ y, opacity }}
      >
        {/* Main heading with glitch effect */}
        <GlitchText delay={0.3}>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold font-tech tracking-wider leading-tight">
            <span className="inline-block bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(234,145,45,0.5)]">
              ProdUX
            </span>
          </h1>
        </GlitchText>

        {/* Year with typing effect */}
        <motion.div
          className="text-6xl md:text-8xl lg:text-9xl font-black font-tech mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <span className="text-white/20">
            <TypingText text="2026" delay={800} />
          </span>
        </motion.div>

        {/* Tagline */}
        <motion.div
          className="mt-8 max-w-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          <p className="text-xl md:text-3xl font-grotesk tracking-wide">
            <span className="inline-block bg-gradient-to-r from-yellow-200 via-orange-400 to-red-500 bg-clip-text text-transparent font-semibold">
              Designing the Next Era of Growth
            </span>
          </p>
          <p className="text-sm md:text-base text-white/40 font-mono tracking-[0.3em] uppercase mt-4 font-light">
            16th — 22nd February, 2026
          </p>
        </motion.div>

        {/* Interactive countdown */}
        <InteractiveCountdown />

        {/* CTA Button */}
        <motion.button
          className="mt-12 relative group overflow-hidden"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
          <div className="relative px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 rounded-full font-semibold text-lg tracking-wider uppercase border border-orange-400/50 shadow-lg">
            <span className="relative z-10">Explore Events</span>
          </div>
        </motion.button>

        {/* Floating decorative elements */}
        <motion.div
          className="absolute bottom-20 left-10 w-20 h-20 rounded-full bg-orange-500/10 blur-2xl"
          animate={{
            y: [0, -20, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-40 right-20 w-32 h-32 rounded-full bg-red-500/10 blur-2xl"
          animate={{
            y: [0, 20, 0],
            scale: [1, 0.8, 1],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2 }}
      >
        <span className="text-xs text-white/40 uppercase tracking-widest font-mono">Scroll</span>
        <motion.div
          className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-1"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            className="w-1.5 h-2 bg-orange-500 rounded-full"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
