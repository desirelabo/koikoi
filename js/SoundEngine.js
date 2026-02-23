export class SoundEngine {
  constructor() { this.ctx = new (window.AudioContext || window.webkitAudioContext)(); }
  play(type) {
    if(this.ctx.state === 'suspended') this.ctx.resume();
    const osc = this.ctx.createOscillator(), gain = this.ctx.createGain();
    osc.connect(gain); gain.connect(this.ctx.destination);
    const now = this.ctx.currentTime;
    if(type==='select') { osc.type='sine'; osc.frequency.setValueAtTime(800, now); osc.frequency.exponentialRampToValueAtTime(1200, now+0.05); gain.gain.setValueAtTime(0.05, now); gain.gain.exponentialRampToValueAtTime(0.001, now+0.1); osc.start(now); osc.stop(now+0.1); }
    else if(type==='sync') { osc.type='triangle'; osc.frequency.setValueAtTime(400, now); osc.frequency.exponentialRampToValueAtTime(800, now+0.1); gain.gain.setValueAtTime(0.1, now); gain.gain.exponentialRampToValueAtTime(0.001, now+0.3); osc.start(now); osc.stop(now+0.3); }
    else if(type==='evolve') { osc.type='square'; osc.frequency.setValueAtTime(150, now); osc.frequency.linearRampToValueAtTime(300, now+0.4); gain.gain.setValueAtTime(0.1, now); gain.gain.linearRampToValueAtTime(0, now+0.5); osc.start(now); osc.stop(now+0.5); }
    else if(type==='critical') { osc.type='sawtooth'; osc.frequency.setValueAtTime(800, now); osc.frequency.exponentialRampToValueAtTime(100, now+0.3); gain.gain.setValueAtTime(0.15, now); gain.gain.exponentialRampToValueAtTime(0.001, now+0.5); osc.start(now); osc.stop(now+0.5); }
    else if(type==='yaku') { osc.type='square'; osc.frequency.setValueAtTime(300, now); osc.frequency.setValueAtTime(600, now+0.1); osc.frequency.setValueAtTime(1200, now+0.2); gain.gain.setValueAtTime(0.15, now); gain.gain.linearRampToValueAtTime(0, now+0.5); osc.start(now); osc.stop(now+0.5); }
  }
}
