// Lazy singleton — AudioContext must be created/resumed inside a user gesture
let ctx: AudioContext | null = null

function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext()
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

// Plays a single bell-like tone: sine fundamental + detuned harmonic for shimmer
function playBell(
  context: AudioContext,
  freq: number,
  startTime: number,
  duration: number,
  volume: number,
) {
  const gain = context.createGain()
  gain.connect(context.destination)
  gain.gain.setValueAtTime(0, startTime)
  gain.gain.linearRampToValueAtTime(volume, startTime + 0.012)
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration)

  for (const [ratio, vol] of [
    [1, 1],           // fundamental
    [2.756, 0.4],     // bell overtone
    [5.404, 0.15],    // shimmer
  ] as [number, number][]) {
    const osc = context.createOscillator()
    const oscGain = context.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(freq * ratio, startTime)
    oscGain.gain.setValueAtTime(vol, startTime)
    osc.connect(oscGain)
    oscGain.connect(gain)
    osc.start(startTime)
    osc.stop(startTime + duration)
  }
}

// Magical ascending fanfare: C major arpeggio with a pixie-dust sparkle finish
export function playFanfare(): void {
  const context = getCtx()
  const t = context.currentTime

  const notes: [freq: number, offset: number, duration: number, volume: number][] = [
    [523.25,  0.00, 0.55, 0.22],  // C5
    [659.25,  0.10, 0.50, 0.22],  // E5
    [783.99,  0.20, 0.50, 0.22],  // G5
    [1046.50, 0.32, 0.60, 0.26],  // C6  — the "ta-da" note
    [1318.51, 0.46, 0.35, 0.14],  // E6  — sparkle
    [1568.00, 0.54, 0.28, 0.10],  // G6  — sparkle
    [2093.00, 0.60, 0.22, 0.07],  // C7  — top shimmer
  ]

  for (const [freq, offset, duration, volume] of notes) {
    playBell(context, freq, t + offset, duration, volume)
  }
}
