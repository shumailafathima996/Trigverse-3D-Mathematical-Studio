'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Award, CheckCircle2, RotateCcw, XCircle } from 'lucide-react';

const QUESTIONS = [
  {
    question: 'Which equation is the fundamental Pythagorean identity?',
    options: ['sin θ + cos θ = 1', 'sin² θ + cos² θ = 1', 'tan² θ + sec² θ = 1', 'sin θ · cos θ = 1'],
    answer: 1,
  },
  {
    question: 'What is the double-angle formula for sin(2θ)?',
    options: ['sin² θ − cos² θ', '2 sin θ cos θ', 'sin θ + cos θ', '2 tan θ'],
    answer: 1,
  },
  {
    question: 'Which expression is equal to tan θ?',
    options: ['cos θ / sin θ', '1 / sin θ', 'sin θ / cos θ', '1 / cos θ'],
    answer: 2,
  },
  {
    question: 'Which is an equivalent formula for cos(2θ)?',
    options: ['cos² θ − sin² θ', '2 sin θ cos θ', 'sin² θ + cos² θ', '1 + tan² θ'],
    answer: 0,
  },
  {
    question: 'Complete the identity: 1 + tan² θ = ?',
    options: ['csc² θ', 'sin² θ', 'sec² θ', 'cot² θ'],
    answer: 2,
  },
];

const cyan = '#00f2fe';
const green = '#00ff87';
const pink = '#f355da';

export default function QuizSystem() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [finished, setFinished] = useState(false);

  const question = QUESTIONS[questionIndex];
  const score = answers.filter((answer, index) => answer === QUESTIONS[index].answer).length;

  const submitAnswer = () => {
    if (selected === null || submitted) return;
    setAnswers(previous => [...previous, selected]);
    setSubmitted(true);
  };

  const nextQuestion = () => {
    if (questionIndex === QUESTIONS.length - 1) {
      setFinished(true);
      return;
    }

    setQuestionIndex(index => index + 1);
    setSelected(null);
    setSubmitted(false);
  };

  const restartQuiz = () => {
    setQuestionIndex(0);
    setSelected(null);
    setAnswers([]);
    setSubmitted(false);
    setFinished(false);
  };

  if (finished) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-3xl rounded-2xl p-6 sm:p-8"
        style={{ border: '1px solid rgba(0,242,254,.25)', background: 'rgba(0,242,254,.04)' }}
      >
        <div className="text-center">
          <Award size={44} className="mx-auto mb-3" style={{ color: '#ffb300' }} />
          <div className="mb-2 text-sm tracking-widest" style={{ fontFamily: 'Orbitron,monospace', color: cyan }}>
            QUIZ COMPLETE
          </div>
          <div className="mb-2 text-4xl font-black" style={{ fontFamily: 'Orbitron,monospace', color: '#fff' }}>
            {score} / {QUESTIONS.length}
          </div>
          <p className="mb-6 text-sm" style={{ color: '#94a3b8' }}>
            {score === QUESTIONS.length ? 'Perfect score! You know your trig identities.' : `${Math.round((score / QUESTIONS.length) * 100)}% correct — review the answers below and try again.`}
          </p>
        </div>

        <div className="mb-6 space-y-2">
          {QUESTIONS.map((item, index) => {
            const correct = answers[index] === item.answer;
            return (
              <div
                key={item.question}
                className="flex items-start gap-3 rounded-lg p-3"
                style={{ border: `1px solid ${correct ? `${green}35` : `${pink}35`}`, background: correct ? `${green}08` : `${pink}08` }}
              >
                {correct
                  ? <CheckCircle2 size={17} className="mt-0.5 flex-shrink-0" style={{ color: green }} />
                  : <XCircle size={17} className="mt-0.5 flex-shrink-0" style={{ color: pink }} />}
                <div>
                  <div className="mb-1 text-sm text-slate-200">{item.question}</div>
                  <div className="text-xs" style={{ color: correct ? green : '#fda4af' }}>
                    Correct answer: {item.options[item.answer]}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={restartQuiz}
          className="mx-auto flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-bold"
          style={{ fontFamily: 'Orbitron,monospace', color: '#020617', background: `linear-gradient(135deg,${cyan},#3b82f6)`, border: 'none', cursor: 'pointer' }}
        >
          <RotateCcw size={16} /> TRY AGAIN
        </button>
      </motion.div>
    );
  }

  const isCorrect = selected === question.answer;

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div className="flex items-center justify-between">
        <span className="text-xs tracking-widest" style={{ fontFamily: 'Orbitron,monospace', color: cyan }}>
          IDENTITIES &amp; FORMULAS
        </span>
        <span className="text-xs" style={{ fontFamily: 'Orbitron,monospace', color: '#94a3b8' }}>
          QUESTION {questionIndex + 1} / {QUESTIONS.length}
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full" style={{ background: 'rgba(255,255,255,.08)' }}>
        <motion.div
          className="h-full rounded-full"
          animate={{ width: `${((questionIndex + 1) / QUESTIONS.length) * 100}%` }}
          style={{ background: `linear-gradient(90deg,${cyan},#a855f7)` }}
        />
      </div>

      <motion.div
        key={questionIndex}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-5 sm:p-7"
        style={{ border: '1px solid rgba(243,85,218,.25)', background: 'rgba(243,85,218,.04)' }}
      >
        <h2 className="mb-6 text-lg font-semibold leading-relaxed text-white sm:text-xl">
          {question.question}
        </h2>

        <div className="space-y-3">
          {question.options.map((option, index) => {
            const isSelected = selected === index;
            const isAnswer = question.answer === index;
            let color = 'rgba(255,255,255,.12)';
            let background = 'rgba(255,255,255,.03)';
            if (submitted && isAnswer) {
              color = `${green}90`;
              background = `${green}12`;
            } else if (submitted && isSelected) {
              color = `${pink}90`;
              background = `${pink}12`;
            } else if (isSelected) {
              color = `${cyan}90`;
              background = `${cyan}10`;
            }

            return (
              <button
                key={option}
                type="button"
                onClick={() => !submitted && setSelected(index)}
                disabled={submitted}
                className="flex w-full items-center gap-3 rounded-xl p-4 text-left text-sm transition-colors sm:text-base"
                style={{ border: `1px solid ${color}`, background, color: '#e2e8f0', cursor: submitted ? 'default' : 'pointer' }}
              >
                <span
                  className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold"
                  style={{ fontFamily: 'Orbitron,monospace', color: submitted && isAnswer ? green : cyan, background: 'rgba(0,0,0,.25)' }}
                >
                  {String.fromCharCode(65 + index)}
                </span>
                {option}
              </button>
            );
          })}
        </div>

        {submitted && (
          <div className="mt-4 flex items-center gap-2 text-sm" style={{ color: isCorrect ? green : pink }}>
            {isCorrect ? <CheckCircle2 size={17} /> : <XCircle size={17} />}
            {isCorrect ? 'Correct!' : `Not quite. The answer is ${question.options[question.answer]}.`}
          </div>
        )}
      </motion.div>

      <button
        type="button"
        onClick={submitted ? nextQuestion : submitAnswer}
        disabled={!submitted && selected === null}
        className="w-full rounded-xl py-4 text-sm font-bold tracking-widest transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
        style={{ fontFamily: 'Orbitron,monospace', color: '#020617', background: `linear-gradient(135deg,${pink},#a855f7)`, border: 'none', cursor: !submitted && selected === null ? 'not-allowed' : 'pointer' }}
      >
        {!submitted ? 'CHECK ANSWER' : questionIndex === QUESTIONS.length - 1 ? 'SEE MY SCORE' : 'NEXT QUESTION'}
      </button>
    </div>
  );
}
