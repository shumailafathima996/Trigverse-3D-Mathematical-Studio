'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer,
} from 'recharts';

export default function WaveSimulator({ angle, amplitude, frequency, phase, verticalShift }) {
  const data = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 160; i++) {
      const x = -2 * Math.PI + (i / 160) * 4 * Math.PI;
      pts.push({
        x: parseFloat(x.toFixed(2)),
        y: parseFloat((amplitude * Math.sin(frequency * x + phase) + verticalShift).toFixed(4)),
      });
    }
    return pts;
  }, [amplitude, frequency, phase, verticalShift]);

  const currentY = amplitude * Math.sin(frequency * angle + phase) + verticalShift;

  const stats = [
    { label: 'Period',   value: (2 * Math.PI / frequency).toFixed(3), color: '#a855f7' },
    { label: 'Peak',     value: (amplitude + verticalShift).toFixed(3), color: '#00f2fe' },
    { label: 'Trough',   value: (-amplitude + verticalShift).toFixed(3), color: '#f355da' },
    { label: 'Y now',    value: currentY.toFixed(3), color: '#ffb300' },
  ];

  return (
    <div className="space-y-4">
      <div
        className="text-xs tracking-wider"
        style={{ fontFamily: 'Orbitron,monospace', color: '#3b82f6' }}
      >
        y = {amplitude.toFixed(2)} sin({frequency.toFixed(2)}x + {phase.toFixed(2)}) + {verticalShift.toFixed(2)}
      </div>

      <div style={{ height: 380 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid stroke="rgba(255,255,255,.07)" strokeDasharray="3 3" />
            <XAxis dataKey="x" stroke="rgba(255,255,255,.2)" tick={{ fontSize: 10, fill: 'rgba(255,255,255,.35)' }} tickCount={7} />
            <YAxis stroke="rgba(255,255,255,.2)" tick={{ fontSize: 10, fill: 'rgba(255,255,255,.35)' }}
                   domain={[-(amplitude + Math.abs(verticalShift) + 0.5), amplitude + Math.abs(verticalShift) + 0.5]} />
            <Tooltip
              contentStyle={{ background: 'rgba(2,6,23,.95)', border: '1px solid rgba(59,130,246,.4)', borderRadius: 8, fontSize: 11, fontFamily: 'Orbitron,monospace' }}
              labelStyle={{ color: '#3b82f6' }}
              formatter={v => [v, 'y']}
            />
            <ReferenceLine y={0} stroke="rgba(255,255,255,.15)" />
            <ReferenceLine x={parseFloat(angle.toFixed(2))} stroke="#ffb300" strokeDasharray="4 2" />
            <Line type="monotone" dataKey="y" stroke="#3b82f6" dot={false} strokeWidth={2.5} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {stats.map(s => (
          <motion.div
            key={s.label}
            className="rounded-lg p-2 text-center"
            style={{ border: `1px solid ${s.color}40`, background: `${s.color}0d` }}
            whileHover={{ boxShadow: `0 0 14px ${s.color}60` }}
          >
            <div className="text-xs mb-1" style={{ fontFamily: 'Orbitron,monospace', color: s.color, opacity: 0.7 }}>{s.label}</div>
            <div className="font-semibold text-sm" style={{ fontFamily: 'Orbitron,monospace', color: s.color }}>{s.value}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
