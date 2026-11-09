// ═══════════════════════════════════════════════════════════
// Fully offline trigonometry knowledge engine.
// No network calls, no API keys — pure pattern matching + live math.
// Every answer is generated instantly from the current angle/sin/cos/tan.
// ═══════════════════════════════════════════════════════════

const SPECIAL_ANGLES = [
  { deg: 0,   rad: 0,            sin: 0,      cos: 1,      tan: 0      },
  { deg: 30,  rad: Math.PI/6,    sin: 0.5,    cos: 0.866,  tan: 0.577  },
  { deg: 45,  rad: Math.PI/4,    sin: 0.707,  cos: 0.707,  tan: 1      },
  { deg: 60,  rad: Math.PI/3,    sin: 0.866,  cos: 0.5,    tan: 1.732  },
  { deg: 90,  rad: Math.PI/2,    sin: 1,      cos: 0,      tan: Infinity },
  { deg: 120, rad: 2*Math.PI/3,  sin: 0.866,  cos: -0.5,   tan: -1.732 },
  { deg: 135, rad: 3*Math.PI/4,  sin: 0.707,  cos: -0.707, tan: -1     },
  { deg: 150, rad: 5*Math.PI/6,  sin: 0.5,    cos: -0.866, tan: -0.577 },
  { deg: 180, rad: Math.PI,      sin: 0,      cos: -1,     tan: 0      },
  { deg: 270, rad: 3*Math.PI/2,  sin: -1,     cos: 0,      tan: Infinity },
  { deg: 360, rad: 2*Math.PI,    sin: 0,      cos: 1,      tan: 0      },
];

function nearestSpecialAngle(deg) {
  let best = SPECIAL_ANGLES[0], bestDiff = Infinity;
  for (const a of SPECIAL_ANGLES) {
    const diff = Math.abs(a.deg - deg);
    if (diff < bestDiff) { bestDiff = diff; best = a; }
  }
  return { ...best, diff: bestDiff };
}

function quadrantOf(deg) {
  const d = ((deg % 360) + 360) % 360;
  if (d === 0 || d === 90 || d === 180 || d === 270 || d === 360) return 'on an axis';
  if (d < 90)  return 'Quadrant I (sin +, cos +, tan +)';
  if (d < 180) return 'Quadrant II (sin +, cos −, tan −)';
  if (d < 270) return 'Quadrant III (sin −, cos −, tan +)';
  return 'Quadrant IV (sin −, cos +, tan −)';
}

// Rule definitions: each has a test (keywords) and a responder(ctx) -> string
const RULES = [
  {
    test: /\bsin\b/i,
    reply: (c) => `Right now sin(θ) = ${c.sinV.toFixed(3)} at θ = ${c.degV.toFixed(1)}°. Sine is the cyan vertical vector in the 3D scene — it's the y-coordinate of the point on the unit circle. It ranges from -1 to 1, hits 0 at 0°/180°/360°, and peaks at 1 when θ = 90°.`,
  },
  {
    test: /\bcos\b/i,
    reply: (c) => `cos(θ) = ${c.cosV.toFixed(3)} at θ = ${c.degV.toFixed(1)}°. Cosine is the magenta horizontal vector — the x-coordinate of the point on the unit circle. It equals 1 at θ = 0°, drops to 0 at 90°, and reaches -1 at 180°.`,
  },
  {
    test: /\btan\b/i,
    reply: (c) => {
      if (Math.abs(c.cosV) < 0.015) return `tan(θ) is undefined right now because cos(θ) ≈ 0 at θ = ${c.degV.toFixed(1)}°. Division by zero! Watch the lime tangent line shoot off toward infinity as you get close to 90° or 270°.`;
      return `tan(θ) = sin(θ)/cos(θ) = ${c.tanV.toFixed(3)} at θ = ${c.degV.toFixed(1)}°. That's the lime-green line in the scene — its length on the vertical line x=±1 equals exactly this value.`;
    },
  },
  {
    test: /pythagorean|sin.*cos.*2|identity/i,
    reply: (c) => `The Pythagorean identity says sin²θ + cos²θ = 1, always. Right now: ${c.sinV.toFixed(3)}² + ${c.cosV.toFixed(3)}² = ${(c.sinV**2 + c.cosV**2).toFixed(5)}. It comes directly from the unit circle equation x² + y² = 1 — try the Formula tab to see 7 more identities update live.`,
  },
  {
    test: /unit circle|what is.*circle/i,
    reply: () => `The unit circle is a circle of radius 1 centered at the origin. For any angle θ, the point where the radius meets the circle has coordinates (cos θ, sin θ). That's the whole foundation of trigonometry — drag the amber knob in the 3D scene and watch the coordinates change!`,
  },
  {
    test: /quadrant/i,
    reply: (c) => `At θ = ${c.degV.toFixed(1)}°, you're in ${quadrantOf(c.degV)}. The sign of sin and cos flips every 90° as you go around the circle — that's why tan changes sign too, since tan = sin/cos.`,
  },
  {
    test: /45|pi\s*\/\s*4|π\/4/i,
    reply: () => `At 45° (π/4 radians): sin(45°) = cos(45°) = √2/2 ≈ 0.707. This is the only angle in Quadrant I where sine and cosine are exactly equal — geometrically it's where the 45-45-90 triangle's two legs are equal. tan(45°) = 1.`,
  },
  {
    test: /30/i,
    reply: () => `At 30° (π/6): sin(30°) = 0.5, cos(30°) = √3/2 ≈ 0.866, tan(30°) = 1/√3 ≈ 0.577. This comes from the 30-60-90 triangle — the side opposite 30° is always half the hypotenuse.`,
  },
  {
    test: /60/i,
    reply: () => `At 60° (π/3): sin(60°) = √3/2 ≈ 0.866, cos(60°) = 0.5, tan(60°) = √3 ≈ 1.732. Notice it's the mirror image of 30° — sin and cos swap values, which is the co-function identity.`,
  },
  {
    test: /90/i,
    reply: () => `At 90° (π/2): sin(90°) = 1 (maximum value), cos(90°) = 0, and tan(90°) is undefined since you'd divide by zero. This is where the cosine vector (magenta) completely vanishes.`,
  },
  {
    test: /180/i,
    reply: () => `At 180° (π): sin(180°) = 0, cos(180°) = -1, tan(180°) = 0. The point has swung to the far left of the circle — the sine vector vanishes again, same as at 0°.`,
  },
  {
    test: /csc|cosecant/i,
    reply: (c) => Math.abs(c.sinV) < 0.015 ? `csc(θ) is undefined — sin(θ) ≈ 0 right now.` : `csc(θ) = 1/sin(θ) = ${(1/c.sinV).toFixed(3)}. It's the reciprocal of sine, so it blows up to infinity wherever sine is zero.`,
  },
  {
    test: /sec(?!ond)|secant/i,
    reply: (c) => Math.abs(c.cosV) < 0.015 ? `sec(θ) is undefined — cos(θ) ≈ 0 right now.` : `sec(θ) = 1/cos(θ) = ${(1/c.cosV).toFixed(3)}. The reciprocal of cosine — undefined at 90° and 270°.`,
  },
  {
    test: /cot|cotangent/i,
    reply: (c) => Math.abs(c.sinV) < 0.015 ? `cot(θ) is undefined — sin(θ) ≈ 0 right now.` : `cot(θ) = cos(θ)/sin(θ) = ${(c.cosV/c.sinV).toFixed(3)}. The reciprocal of tangent.`,
  },
  {
    test: /wave|amplitude|frequency|period/i,
    reply: () => `The wave equation y = A·sin(Bx + C) + D controls four things: A stretches it vertically (amplitude), B compresses/stretches it horizontally (frequency — period = 2π/B), C shifts it left/right (phase), and D shifts it up/down. Try the Wave tab and drag each slider to see the effect isolated.`,
  },
  {
    test: /double angle/i,
    reply: () => `Double angle formulas: sin(2θ) = 2 sin(θ) cos(θ), and cos(2θ) = cos²θ − sin²θ (also equals 2cos²θ−1 or 1−2sin²θ). They come from applying the angle-sum formula to sin(θ+θ) and cos(θ+θ). Check the Formula tab to see both verified live.`,
  },
  {
    test: /radian/i,
    reply: (c) => `Radians measure angle by arc length: one full circle = 2π radians = 360°. Your current angle is ${c.angleV.toFixed(3)} radians, which equals ${c.degV.toFixed(1)}°. To convert: radians = degrees × π/180.`,
  },
  {
    test: /negative|below.*axis|quadrant (3|4|iii|iv)/i,
    reply: (c) => `Below the x-axis (180°–360°), sine is negative because the y-coordinate is negative. In Quadrant III (180°–270°) both sin and cos are negative, so tan is positive (negative ÷ negative). In Quadrant IV (270°–360°), sin is negative but cos is positive, so tan is negative again.`,
  },
  {
    test: /hello|hi\b|hey/i,
    reply: () => `Hello! I'm TrigMentor, running fully offline right inside your browser. Ask me about sin, cos, tan, the unit circle, identities, special angles (30°, 45°, 60°, 90°), quadrants, or the wave equation — I'll always answer using your current live angle.`,
  },
  {
    test: /thank/i,
    reply: () => `You're welcome! Keep exploring — drag the amber knob around the circle and watch every value update in real time.`,
  },
];

export function askTrigMentor(question, { angle, sin, cos, tan }) {
  const degV = (angle * 180) / Math.PI;
  const ctx = { angleV: angle, degV, sinV: sin, cosV: cos, tanV: tan };

  for (const rule of RULES) {
    if (rule.test.test(question)) {
      return rule.reply(ctx);
    }
  }

  // Fallback: give a useful summary of current state plus nearby special angle
  const near = nearestSpecialAngle(degV);
  return `I can best help with sin, cos, tan, identities, the unit circle, quadrants, or special angles (30°/45°/60°/90°). ` +
    `Right now θ = ${degV.toFixed(1)}° (closest special angle: ${near.deg}°), sin = ${sin.toFixed(3)}, cos = ${cos.toFixed(3)}, ` +
    `tan = ${Math.abs(cos) < 0.015 ? '∞' : tan.toFixed(3)}. Try asking "what is sin" or "explain the unit circle".`;
}
