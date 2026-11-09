'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LabDashboard from '@/components/LabDashboard';

const SYMBOLS = ['sin(θ)', 'cos(θ)', 'tan(θ)', 'π', '∫', 'Σ', 'θ', '∞'];

export default function Home() {
  const [progress, setProgress] = useState(0);
  const [ready, setReady]       = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setProgress(p => {
        const next = Math.min(p + Math.random() * 18 + 4, 100);
        if (next >= 100) {
          clearInterval(id);
          setTimeout(() => setReady(true), 600);
        }
        return next;
      });
    }, 110);
    return () => clearInterval(id);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {!ready ? (
        <motion.div
          key="loader"
          className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden"
          style={{ background: 'linear-gradient(135deg,#020617,#0f172a)' }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.5 }}
        >
          {/* Background grid */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                'linear-gradient(rgba(0,242,254,.12) 1px,transparent 1px),linear-gradient(90deg,rgba(243,85,218,.08) 1px,transparent 1px)',
              backgroundSize: '48px 48px',
            }}
          />

          {/* Corner glows */}
          <div className="absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"
               style={{ background: 'rgba(0,242,254,.12)' }} />
          <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"
               style={{ background: 'rgba(243,85,218,.12)' }} />

          {/* Floating symbols */}
          {SYMBOLS.map((sym, i) => (
            <motion.span
              key={sym}
              className="absolute select-none pointer-events-none"
              style={{
                fontFamily: 'Orbitron,monospace',
                fontSize: `${1.2 + (i % 3) * 0.4}rem`,
                color: ['#00f2fe','#f355da','#00ff87','#ffb300','#a855f7'][i % 5],
                left: `${10 + i * 11}%`,
                top: `${20 + (i % 4) * 18}%`,
                opacity: 0.15,
              }}
              animate={{ y: [0, -24, 0], rotate: [0, 15, 0] }}
              transition={{ duration: 4 + i * 0.7, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
            >
              {sym}
            </motion.span>
          ))}

          {/* Title */}
          <motion.h1
            className="font-orbitron font-black text-center mb-3 relative z-10"
            style={{
              fontFamily: 'Orbitron,monospace',
              fontSize: 'clamp(2.2rem,6vw,4.5rem)',
              background: 'linear-gradient(90deg,#00f2fe,#3b82f6,#f355da)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
            animate={{ filter: ['drop-shadow(0 0 10px rgba(0,242,254,.3))','drop-shadow(0 0 30px rgba(243,85,218,.5))','drop-shadow(0 0 10px rgba(0,242,254,.3))'] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          >
            TrigVerse Studio
          </motion.h1>

          <motion.p
            className="relative z-10 mb-10 tracking-widest text-sm"
            style={{ fontFamily: 'Orbitron,monospace', color: '#00f2fe' }}
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          >
            INITIALIZING TRIGVERSE STUDIO
          </motion.p>

          {/* Progress bar */}
          <div className="relative z-10 w-72">
            <div className="h-[3px] rounded-full mb-2 overflow-hidden" style={{ background: 'rgba(255,255,255,.08)', border: '1px solid rgba(0,242,254,.2)' }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg,#00f2fe,#f355da,#00ff87)', width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
            <p className="text-center text-xs tracking-widest" style={{ fontFamily: 'Orbitron,monospace', color: '#00f2fe' }}>
              {Math.round(progress)}% COMPLETE
            </p>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="app"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <LabDashboard />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
