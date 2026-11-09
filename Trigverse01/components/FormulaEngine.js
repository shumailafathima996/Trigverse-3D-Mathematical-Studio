'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const IDENTITIES = [
  {
    name: 'Pythagorean',
    eq:   'sin²θ + cos²θ = 1',
    color: '#00f2fe',
    calc: (s,c) => `${(s*s+c*c).toFixed(5)} ✓`,
    desc: 'The fundamental identity — the x² + y² = 1 equation of the unit circle is exactly this. Watch the value stay at 1.00000 as you move the knob.',
  },
  {
    name: 'Double Angle sin',
    eq:   'sin(2θ) = 2 sin(θ) cos(θ)',
    color: '#f355da',
    calc: (s,c,t,a) => `${(2*s*c).toFixed(4)} = ${Math.sin(2*a).toFixed(4)}`,
    desc: 'Both sides always match. Expanding sin of a doubled angle using the angle addition formula.',
  },
  {
    name: 'Double Angle cos',
    eq:   'cos(2θ) = cos²θ − sin²θ',
    color: '#a855f7',
    calc: (s,c,t,a) => `${(c*c-s*s).toFixed(4)} = ${Math.cos(2*a).toFixed(4)}`,
    desc: 'Three equivalent forms: cos²θ−sin²θ, 2cos²θ−1, and 1−2sin²θ. All give the same result.',
  },
  {
    name: 'Quotient Identity',
    eq:   'tan θ = sin θ / cos θ',
    color: '#00ff87',
    calc: (s,c,t) => Math.abs(c)<0.01 ? 'undefined' : `${(s/c).toFixed(4)} = ${t.toFixed(4)}`,
    desc: 'The lime tangent line length is exactly this ratio. Watch it grow as cos approaches zero at 90° and 270°.',
  },
  {
    name: 'Reciprocal: Cosecant',
    eq:   'csc θ = 1 / sin θ',
    color: '#3b82f6',
    calc: (s) => Math.abs(s)<0.01 ? 'undefined' : (1/s).toFixed(4),
    desc: 'Undefined wherever the cyan sine vector is zero — at 0° and 180°.',
  },
  {
    name: 'Reciprocal: Secant',
    eq:   'sec θ = 1 / cos θ',
    color: '#ffb300',
    calc: (s,c) => Math.abs(c)<0.01 ? 'undefined' : (1/c).toFixed(4),
    desc: 'Undefined wherever the magenta cosine vector is zero — at 90° and 270°.',
  },
  {
    name: 'Reciprocal: Cotangent',
    eq:   'cot θ = cos θ / sin θ',
    color: '#f97316',
    calc: (s,c) => Math.abs(s)<0.01 ? 'undefined' : (c/s).toFixed(4),
    desc: 'The reciprocal of tangent. Undefined at 0° and 180° where sine is zero.',
  },
  {
    name: 'Pythagorean (tan)',
    eq:   '1 + tan²θ = sec²θ',
    color: '#ec4899',
    calc: (s,c,t) => Math.abs(c)<0.01 ? 'undefined' : `${(1+t*t).toFixed(4)} = ${(1/(c*c)).toFixed(4)}`,
    desc: 'Dividing the main Pythagorean identity by cos²θ gives this form. Useful in integration and simplification.',
  },
];

export default function FormulaEngine({ sin, cos, tan, angle }) {
  const [open, setOpen] = useState(0);

  return (
    <div className="space-y-2">
      {IDENTITIES.map((id, i) => {
        const isOpen = open === i;
        return (
          <motion.div
            key={id.name}
            className="rounded-xl overflow-hidden cursor-pointer"
            style={{ border: `1px solid ${id.color}30`, background: `${id.color}08` }}
            whileHover={{ borderColor: `${id.color}70`, boxShadow: `0 0 14px ${id.color}25` }}
            onClick={() => setOpen(isOpen ? -1 : i)}
          >
            <div className="flex items-center justify-between px-4 py-3">
              <div>
                <div className="text-xs font-semibold mb-1" style={{ fontFamily: 'Orbitron,monospace', color: id.color }}>{id.name}</div>
                <div className="text-xs opacity-60" style={{ fontFamily: 'Orbitron,monospace', color: id.color }}>{id.eq}</div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold" style={{ fontFamily: 'Orbitron,monospace', color: '#fff' }}>
                  {id.calc(sin, cos, tan, angle)}
                </span>
                <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.25 }}>
                  <ChevronDown size={15} style={{ color: id.color, opacity: 0.7 }} />
                </motion.div>
              </div>
            </div>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  style={{ borderTop: `1px solid ${id.color}20` }}
                >
                  <p className="px-4 py-3 text-sm leading-relaxed" style={{ color: '#94a3b8' }}>
                    {id.desc}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
