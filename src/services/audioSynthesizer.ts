/**
 * Web Audio API synthesizer for authentic Yorùbá traditional soundscapes:
 * - Gangan (Talking Drum) with dynamic pitch bends
 * - Agogo (Double Iron Bell) with high and low tones
 * - Ọpọ́n Ifá wooden tapping / Ikin palm nuts cast sound
 * - Shekere gourd rattle
 * - Aláàfíà meditation singing bowl
 */

class YorubaAudioSynthesizer {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private rhythmTimer: number | null = null;
  private isRhythmPlaying: boolean = false;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted && this.isRhythmPlaying) {
      this.stopRhythm();
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public getIsRhythmPlaying(): boolean {
    return this.isRhythmPlaying;
  }

  /**
   * Plays the Agogo bell (traditional iron bell)
   * @param tone 'high' or 'low'
   */
  public playAgogo(tone: 'high' | 'low' = 'high') {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    // Fundamental frequencies for forged iron double bell
    const baseFreq = tone === 'high' ? 840 : 580;
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(baseFreq, t);

    // Metallic overtone
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(baseFreq * 2.37, t);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(baseFreq * 1.5, t);
    filter.Q.setValueAtTime(3.0, t);

    gainNode.gain.setValueAtTime(0.25, t);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, t + (tone === 'high' ? 0.35 : 0.45));

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + 0.5);
    osc2.stop(t + 0.5);
  }

  /**
   * Plays the Gangan (Talking Drum)
   * Models the goat skin membrane and the pitch rise when leather strings are squeezed
   */
  public playGangan(startPitch: number = 180, endPitch: number = 260, duration: number = 0.35) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(startPitch, t);
    // Pitch bending (squeeze effect of the talking drum)
    osc.frequency.exponentialRampToValueAtTime(Math.max(60, endPitch), t + duration * 0.7);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(900, t);
    filter.frequency.exponentialRampToValueAtTime(250, t + duration);

    // Initial sharp mallet contact
    gainNode.gain.setValueAtTime(0.4, t);
    gainNode.gain.exponentialRampToValueAtTime(0.001, t + duration);

    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + duration);
  }

  /**
   * Sound of casting sacred Ikin (palm nuts) onto the wooden Ọpọ́n Ifá
   */
  public playIkinCast() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    // Simulate multiple small woody clacks in rapid succession
    const clackCount = 5;
    for (let i = 0; i < clackCount; i++) {
      const delay = i * 0.045 + Math.random() * 0.02;
      setTimeout(() => {
        if (!this.ctx) return;
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'triangle';
        const freq = 420 + Math.random() * 200;
        osc.frequency.setValueAtTime(freq, t);
        osc.frequency.exponentialRampToValueAtTime(160, t + 0.08);

        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(700, t);
        filter.Q.setValueAtTime(2.5, t);

        gain.gain.setValueAtTime(0.18, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + 0.09);
      }, delay * 1000);
    }
  }

  /**
   * Sound of Shekere (beaded gourd shaker)
   */
  public playShekere() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.12;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(2800, t);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.15, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(t);
  }

  /**
   * Deep serene meditation chime for Orí alignment & peace
   */
  public playOriMeditationChime() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const frequencies = [216, 432, 648]; // Calming harmonics
    frequencies.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = idx === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, t);

      const amp = 0.18 / (idx + 1);
      gain.gain.setValueAtTime(amp, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 3.2);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(t);
      osc.stop(t + 3.3);
    });
  }

  /**
   * Toggle gentle ancestral rhythm loop (Gangan + Agogo pulse)
   */
  public toggleRhythm(onStateChange?: (isPlaying: boolean) => void) {
    if (this.isRhythmPlaying) {
      this.stopRhythm();
      onStateChange?.(false);
    } else {
      this.startRhythm();
      onStateChange?.(true);
    }
  }

  public startRhythm() {
    if (this.isRhythmPlaying || this.isMuted) return;
    this.initContext();
    this.isRhythmPlaying = true;

    // Traditional standard 12/8 bell key pattern simplified into 8-step cycle
    let step = 0;
    const stepDuration = 280; // ms

    this.rhythmTimer = window.setInterval(() => {
      // Step 0: Low Agogo + Low Gangan hit
      if (step === 0) {
        this.playAgogo('low');
        this.playGangan(140, 180, 0.28);
      } else if (step === 2) {
        this.playAgogo('high');
        this.playShekere();
      } else if (step === 3) {
        this.playGangan(210, 290, 0.2); // upward squeeze tone
      } else if (step === 4) {
        this.playAgogo('high');
      } else if (step === 6) {
        this.playAgogo('low');
        this.playShekere();
        this.playGangan(160, 220, 0.25);
      }

      step = (step + 1) % 8;
    }, stepDuration);
  }

  public stopRhythm() {
    if (this.rhythmTimer !== null) {
      clearInterval(this.rhythmTimer);
      this.rhythmTimer = null;
    }
    this.isRhythmPlaying = false;
  }
}

export const yorubaAudio = new YorubaAudioSynthesizer();
