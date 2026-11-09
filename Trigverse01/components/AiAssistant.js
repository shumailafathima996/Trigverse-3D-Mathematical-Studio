'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Volume2, VolumeX, Cpu } from 'lucide-react';
import { askTrigMentor } from './trigKnowledge';

const SUGGESTIONS = ['What is sin?', 'Explain the unit circle', 'Pythagorean identity', 'What quadrant am I in?'];

export default function AiAssistant({ sin, cos, tan, angle }) {
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      text: 'Hello! I am TrigMentor — a fully offline tutor built into this app, no internet or API key required. Ask me about sin, cos, tan, the unit circle, identities, or special angles. I always answer using your current live angle.',
    },
  ]);
  const [input, setInput]       = useState('');
  const [speaking, setSpeaking] = useState(false);
  const bottomRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const speak = (text) => {
    if (!window.speechSynthesis) return;
    if (speaking) { window.speechSynthesis.cancel(); setSpeaking(false); return; }
    setSpeaking(true);
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.95; u.pitch = 1;
    u.onend = () => setSpeaking(false);
    window.speechSynthesis.speak(u);
  };

  const send = (text) => {
    const msg = (text ?? input).trim();
    if (!msg) return;
    setInput('');
    setMessages(m => [...m, { role: 'user', text: msg }]);

    // Instant local answer — no network, no latency, no failure
    const answer = askTrigMentor(msg, { angle, sin, cos, tan });
    setTimeout(() => {
      setMessages(m => [...m, { role: 'ai', text: answer }]);
    }, 280); // tiny delay so it feels alive, not an API wait
  };

  const deg = ((angle * 180) / Math.PI).toFixed(1);

  return (
    <div className="flex flex-col h-full" style={{ minHeight: 560 }}>
      {/* Offline badge */}
      <div
        className="mb-3 flex items-center justify-between px-3 py-2 rounded-lg text-xs"
        style={{ fontFamily: 'Orbitron,monospace', border: '1px solid rgba(0,255,135,.25)', background: 'rgba(0,255,135,.06)' }}
      >
        <span style={{ color: '#00ff87', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Cpu size={12} /> OFFLINE ENGINE — NO API KEY NEEDED
        </span>
        <span style={{ color: '#475569' }}>θ={deg}°</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 mb-3" style={{ maxHeight: 440 }}>
        {messages.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className="max-w-[86%] rounded-xl px-4 py-3 text-sm leading-relaxed"
              style={
                m.role === 'user'
                  ? { background: 'rgba(0,242,254,.1)', border: '1px solid rgba(0,242,254,.3)', color: '#a5f3fc' }
                  : { background: 'rgba(168,85,247,.1)', border: '1px solid rgba(168,85,247,.3)', color: '#ddd6fe' }
              }
            >
              {m.text}
              {m.role === 'ai' && (
                <button
                  onClick={() => speak(m.text)}
                  className="mt-2 flex items-center gap-1 text-xs opacity-50 hover:opacity-100 transition-opacity"
                  style={{ color: '#a855f7' }}
                >
                  {speaking ? <VolumeX size={12} /> : <Volume2 size={12} />}
                  {speaking ? 'Stop' : 'Speak'}
                </button>
              )}
            </div>
          </motion.div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Quick suggestions */}
      <div className="flex flex-wrap gap-2 mb-3">
        {SUGGESTIONS.map(s => (
          <button
            key={s}
            onClick={() => send(s)}
            className="text-xs px-3 py-1.5 rounded-full transition-colors"
            style={{ border: '1px solid rgba(0,242,254,.25)', color: '#00f2fe', background: 'rgba(0,242,254,.05)' }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Ask about sin, cos, identities…"
          className="flex-1 px-4 py-2 rounded-lg text-sm outline-none"
          style={{ background: 'rgba(0,0,0,.4)', border: '1px solid rgba(0,242,254,.25)', color: '#fff', fontFamily: 'Inter,sans-serif' }}
        />
        <motion.button
          onClick={() => send()}
          disabled={!input.trim()}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          className="px-4 py-2 rounded-lg flex items-center gap-1 text-sm font-semibold disabled:opacity-40"
          style={{ background: 'linear-gradient(135deg,#00f2fe,#3b82f6)', color: '#000', fontFamily: 'Orbitron,monospace', fontSize: '0.7rem' }}
        >
          <Send size={14} />
        </motion.button>
      </div>
    </div>
  );
}
