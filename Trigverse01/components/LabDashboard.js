'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { ArrowLeft, ArrowRight, Bot, BookOpen, CircleDot, Sparkles, Trophy } from 'lucide-react';
import WaveSimulator from './WaveSimulator';
import FormulaEngine from './FormulaEngine';
import AiAssistant from './AiAssistant';
import QuizSystem from './QuizSystem';

const TrigCanvas = dynamic(() => import('./TrigCanvas'), { ssr: false });

const PAGES = [
  {
    id: 'triglab',
    title: 'TrigLab',
    description: 'Explore the unit circle in 3D and see how angles shape sine, cosine, and tangent.',
    detail: '3D INTERACTIVE LAB',
    icon: CircleDot,
    color: '#00f2fe',
    background: 'linear-gradient(135deg,rgba(0,242,254,.18),rgba(59,130,246,.08))',
  },
  {
    id: 'equations',
    title: 'Trig Equations',
    description: 'Learn essential trigonometric identities, formulas, and how they relate to the live angle.',
    detail: 'FORMULAS & IDENTITIES',
    icon: BookOpen,
    color: '#f355da',
    background: 'linear-gradient(135deg,rgba(243,85,218,.18),rgba(168,85,247,.08))',
  },
  {
    id: 'quiz',
    title: 'Quiz',
    description: 'Test your knowledge with five questions about trigonometric identities and formulas.',
    detail: '5 QUESTION CHALLENGE',
    icon: Trophy,
    color: '#ffb300',
    background: 'linear-gradient(135deg,rgba(255,179,0,.18),rgba(243,85,218,.08))',
  },
  {
    id: 'mentor',
    title: 'AI Mentor',
    description: 'Ask TrigMentor for an explanation using your current angle and trigonometric values.',
    detail: 'OFFLINE AI TUTOR',
    icon: Bot,
    color: '#00ff87',
    background: 'linear-gradient(135deg,rgba(0,255,135,.16),rgba(0,242,254,.07))',
  },
];

function SliderRow({ label, value, min, max, step, onChange, color }) {
  return (
    <div>
      <div className="mb-2 flex justify-between text-xs">
        <span style={{ fontFamily: 'Orbitron,monospace', color, opacity: 0.8 }}>{label}</span>
        <span style={{ fontFamily: 'Orbitron,monospace', color }}>{value.toFixed(2)}</span>
      </div>
      <input
        type="range"
        className="blue-thumb"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={event => onChange(parseFloat(event.target.value))}
        style={{ accentColor: color }}
      />
    </div>
  );
}

function ValueCard({ label, value, color }) {
  return (
    <div
      className="rounded-xl p-3 text-center"
      style={{ border: `1px solid ${color}35`, background: `${color}0d` }}
    >
      <div className="mb-1 text-xs" style={{ fontFamily: 'Orbitron,monospace', color, opacity: 0.65 }}>{label}</div>
      <div className="text-xl font-black" style={{ fontFamily: 'Orbitron,monospace', color }}>{value}</div>
    </div>
  );
}

export default function LabDashboard() {
  const [activePage, setActivePage] = useState(null);
  const [angle, setAngle] = useState(Math.PI / 4);
  const [amplitude, setAmplitude] = useState(1);
  const [frequency, setFrequency] = useState(1);
  const [phase, setPhase] = useState(0);
  const [verticalShift, setVerticalShift] = useState(0);

  const sin = Math.sin(angle);
  const cos = Math.cos(angle);
  const tan = Math.tan(angle);
  const degrees = (angle * 180) / Math.PI;
  const tangent = Math.abs(cos) < 0.01 ? '∞' : tan.toFixed(3);

  const selectedPage = PAGES.find(page => page.id === activePage);

  return (
    <div className="min-h-screen" style={{ background: 'radial-gradient(ellipse at 50% 0%,rgba(15,35,70,.55),transparent 55%),linear-gradient(135deg,#020617 0%,#0f172a 100%)' }}>
      <header
        className="sticky top-0 z-50 flex items-center justify-between gap-4 px-4 py-3 sm:px-6"
        style={{ background: 'rgba(2,6,23,.88)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(0,242,254,.12)' }}
      >
        <div className="flex items-center gap-3">
          {activePage && (
            <button
              type="button"
              onClick={() => setActivePage(null)}
              aria-label="Back to TrigVerse Studio"
              className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-white/10"
              style={{ color: '#00f2fe', border: '1px solid rgba(0,242,254,.2)' }}
            >
              <ArrowLeft size={18} />
            </button>
          )}
          <div>
            <h1 className="font-black" style={{ fontFamily: 'Orbitron,monospace', fontSize: '1.05rem', background: 'linear-gradient(90deg,#00f2fe,#3b82f6,#f355da)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              ⚡ TrigVerse Studio
            </h1>
            <p className="hidden text-[10px] tracking-[0.15em] sm:block" style={{ fontFamily: 'Orbitron,monospace', color: 'rgba(0,242,254,.45)' }}>
              INTERACTIVE TRIGONOMETRY LAB
            </p>
          </div>
        </div>

        {activePage === 'triglab' && (
          <div className="flex items-center gap-2 text-right sm:gap-3">
            <div>
              <div className="text-[10px]" style={{ fontFamily: 'Orbitron,monospace', color: 'rgba(255,179,0,.65)' }}>LIVE ANGLE</div>
              <div className="text-sm font-bold sm:text-base" style={{ fontFamily: 'Orbitron,monospace', color: '#ffb300' }}>{degrees.toFixed(1)}°</div>
            </div>
            <motion.div
              className="h-2 w-2 rounded-full"
              style={{ background: '#00ff87' }}
              animate={{ boxShadow: ['0 0 4px #00ff87', '0 0 14px #00ff87', '0 0 4px #00ff87'] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        )}
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
        <AnimatePresence mode="wait">
          {!activePage ? (
            <motion.section
              key="studio-home"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mx-auto max-w-5xl"
            >
              <div className="mb-8 text-center sm:mb-12">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] tracking-[0.18em] sm:text-xs" style={{ fontFamily: 'Orbitron,monospace', color: '#00f2fe', border: '1px solid rgba(0,242,254,.22)', background: 'rgba(0,242,254,.06)' }}>
                  <Sparkles size={13} /> YOUR INTERACTIVE MATH SPACE
                </div>
                <h2 className="mb-3 text-3xl font-black sm:text-5xl" style={{ fontFamily: 'Orbitron,monospace', background: 'linear-gradient(90deg,#00f2fe,#3b82f6,#f355da)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  TrigVerse Studio
                </h2>
                <p className="mx-auto max-w-xl text-sm leading-relaxed text-slate-400 sm:text-base">
                  Choose a dashboard to explore trigonometry, practice identities, or get help from your AI mentor.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
                {PAGES.map((page, index) => {
                  const Icon = page.icon;
                  return (
                    <motion.button
                      key={page.id}
                      type="button"
                      onClick={() => setActivePage(page.id)}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.07 }}
                      whileHover={{ y: -4, boxShadow: `0 14px 36px ${page.color}20`, borderColor: `${page.color}70` }}
                      whileTap={{ scale: 0.98 }}
                      className="group relative overflow-hidden rounded-2xl p-5 text-left sm:p-6"
                      style={{ minHeight: 172, border: `1px solid ${page.color}35`, background: `${page.background},rgba(15,23,42,.72)`, cursor: 'pointer' }}
                    >
                      <div className="mb-5 flex items-start justify-between">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ color: page.color, background: `${page.color}16`, border: `1px solid ${page.color}35` }}>
                          <Icon size={22} />
                        </div>
                        <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" style={{ color: page.color, opacity: 0.7 }} />
                      </div>
                      <div className="mb-1 text-[10px] tracking-[0.16em]" style={{ fontFamily: 'Orbitron,monospace', color: page.color, opacity: 0.8 }}>
                        {page.detail}
                      </div>
                      <h3 className="mb-2 text-lg font-bold text-white sm:text-xl" style={{ fontFamily: 'Orbitron,monospace' }}>{page.title}</h3>
                      <p className="max-w-md text-xs leading-relaxed text-slate-400 sm:text-sm">{page.description}</p>
                    </motion.button>
                  );
                })}
              </div>

              <p className="mt-8 text-center text-[10px] tracking-[0.2em] text-slate-600" style={{ fontFamily: 'Orbitron,monospace' }}>
                LEARN · EXPLORE · PRACTICE
              </p>
            </motion.section>
          ) : (
            <motion.section
              key={activePage}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >
              <div className="mb-6 sm:mb-8">
                <div className="mb-2 text-[10px] tracking-[0.18em] sm:text-xs" style={{ fontFamily: 'Orbitron,monospace', color: selectedPage.color }}>
                  {selectedPage.detail}
                </div>
                <h2 className="mb-2 text-2xl font-black text-white sm:text-3xl" style={{ fontFamily: 'Orbitron,monospace' }}>
                  {selectedPage.title}
                </h2>
                <p className="max-w-3xl text-sm leading-relaxed text-slate-400">{selectedPage.description}</p>
              </div>

              {activePage === 'triglab' && (
                <div className="space-y-5">
                  <div className="grid gap-5 lg:grid-cols-[minmax(0,1.5fr)_minmax(300px,0.8fr)]">
                    <div className="glass overflow-hidden rounded-2xl">
                      <div className="flex items-center justify-between border-b border-cyan-400/10 px-4 py-3">
                        <span className="text-xs tracking-wider" style={{ fontFamily: 'Orbitron,monospace', color: '#00f2fe' }}>3D UNIT CIRCLE</span>
                        <span className="text-[10px]" style={{ fontFamily: 'Orbitron,monospace', color: '#00ff87' }}>● INTERACTIVE</span>
                      </div>
                      <div style={{ height: 'min(62vh,640px)', minHeight: 380 }}>
                        <TrigCanvas angle={angle} setAngle={setAngle} sin={sin} cos={cos} tan={tan} />
                      </div>
                    </div>

                    <div className="flex flex-col gap-5">
                      <div className="glass rounded-2xl p-5">
                        <div className="mb-4 flex items-center justify-between gap-3">
                          <span className="text-xs tracking-wider" style={{ fontFamily: 'Orbitron,monospace', color: '#ffb300' }}>ANGLE CONTROL</span>
                          <span className="text-xs font-bold" style={{ fontFamily: 'Orbitron,monospace', color: '#f355da' }}>{degrees.toFixed(1)}° / {angle.toFixed(3)} rad</span>
                        </div>
                        <input type="range" className="cyan-thumb w-full" min="0" max={2 * Math.PI} step="0.01" value={angle} onChange={event => setAngle(parseFloat(event.target.value))} />
                        <div className="mt-2 flex justify-between text-[10px]" style={{ fontFamily: 'Orbitron,monospace', color: 'rgba(255,255,255,.35)' }}>
                          <span>0°</span><span>90°</span><span>180°</span><span>270°</span><span>360°</span>
                        </div>
                      </div>

                      <div className="glass rounded-2xl p-5">
                        <div className="mb-5 text-xs tracking-wider" style={{ fontFamily: 'Orbitron,monospace', color: '#3b82f6' }}>WAVE PARAMETERS</div>
                        <div className="space-y-5">
                          <SliderRow label="Amplitude A" value={amplitude} min={0.1} max={3} step={0.05} onChange={setAmplitude} color="#3b82f6" />
                          <SliderRow label="Frequency B" value={frequency} min={0.5} max={4} step={0.05} onChange={setFrequency} color="#3b82f6" />
                          <SliderRow label="Phase C" value={phase} min={-Math.PI} max={Math.PI} step={0.05} onChange={setPhase} color="#3b82f6" />
                          <SliderRow label="Shift D" value={verticalShift} min={-2} max={2} step={0.05} onChange={setVerticalShift} color="#3b82f6" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                    <ValueCard label="sin(θ)" value={sin.toFixed(3)} color="#00f2fe" />
                    <ValueCard label="cos(θ)" value={cos.toFixed(3)} color="#f355da" />
                    <ValueCard label="tan(θ)" value={tangent} color="#00ff87" />
                    <ValueCard label="csc(θ)" value={Math.abs(sin) < 0.01 ? '∞' : (1 / sin).toFixed(3)} color="#a855f7" />
                    <ValueCard label="sec(θ)" value={Math.abs(cos) < 0.01 ? '∞' : (1 / cos).toFixed(3)} color="#3b82f6" />
                    <ValueCard label="cot(θ)" value={Math.abs(sin) < 0.01 ? '∞' : (cos / sin).toFixed(3)} color="#ffb300" />
                  </div>

                  <div className="glass rounded-2xl p-4 sm:p-6">
                    <div className="mb-4 text-xs tracking-wider" style={{ fontFamily: 'Orbitron,monospace', color: '#3b82f6' }}>SINE WAVE SIMULATOR</div>
                    <WaveSimulator angle={angle} amplitude={amplitude} frequency={frequency} phase={phase} verticalShift={verticalShift} />
                  </div>
                </div>
              )}

              {activePage === 'equations' && (
                <div className="glass rounded-2xl p-4 sm:p-6">
                  <FormulaEngine sin={sin} cos={cos} tan={tan} angle={angle} />
                </div>
              )}

              {activePage === 'quiz' && (
                <div className="glass rounded-2xl p-4 sm:p-8">
                  <QuizSystem />
                </div>
              )}

              {activePage === 'mentor' && (
                <div className="glass mx-auto max-w-4xl rounded-2xl p-4 sm:p-8">
                  <AiAssistant sin={sin} cos={cos} tan={tan} angle={angle} />
                </div>
              )}

              <button
                type="button"
                onClick={() => setActivePage(null)}
                className="mt-6 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs transition-colors hover:bg-white/10"
                style={{ fontFamily: 'Orbitron,monospace', color: '#94a3b8', border: '1px solid rgba(255,255,255,.1)' }}
              >
                <ArrowLeft size={14} /> BACK TO STUDIO
              </button>
            </motion.section>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
