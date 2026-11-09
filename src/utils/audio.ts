/**
 * Pure Web Audio API Sound Synthesizer
 * Rich Procedural Peaceful Sounds:
 * 1. Gentle Rain
 * 2. Ocean Waves
 * 3. Deep Brown Noise
 * 4. Mountain Stream
 * 5. Forest Breeze & Birds
 * 6. Peaceful Singing Bowl (432 Hz / 528 Hz)
 * 7. Cozy Night Crickets / Campfire
 *
 * Includes Sleep Timer engine with smooth fade-out.
 * 100% offline, zero external audio assets.
 */

export interface PeacefulSoundOption {
  id: 'rain' | 'ocean' | 'brown' | 'stream' | 'forest' | 'bowl';
  label: string;
  iconName: string;
  description: string;
}

export const PEACEFUL_SOUNDS: PeacefulSoundOption[] = [
  { id: 'rain', label: 'Soothing Rain', iconName: 'CloudRain', description: 'Gentle raindrops for deep focus and reading' },
  { id: 'ocean', label: 'Ocean Waves', iconName: 'Waves', description: 'Rhythmic ocean swells to slow your pulse' },
  { id: 'brown', label: 'Brown Noise', iconName: 'Radio', description: 'Deep, warm rumble to block dormitory distractions' },
  { id: 'stream', label: 'Forest Brook', iconName: 'Droplets', description: 'Flowing clean water for calm studying' },
  { id: 'forest', label: 'Gentle Breeze', iconName: 'Wind', description: 'Soft meadow breeze and subtle peaceful chirps' },
  { id: 'bowl', label: 'Singing Bowl', iconName: 'Bell', description: '528 Hz healing frequency for anxiety relief' },
];

class SoundController {
  private ctx: AudioContext | null = null;
  private ambientSource: AudioBufferSourceNode | null = null;
  private ambientGain: GainNode | null = null;
  private bowlOsc1: OscillatorNode | null = null;
  private bowlOsc2: OscillatorNode | null = null;
  private currentAmbientType: string | null = null;
  private sleepTimerTimeout: NodeJS.Timeout | null = null;
  private sleepTimerSecondsRemaining: number = 0;
  private sleepTimerInterval: NodeJS.Timeout | null = null;
  private onSleepTimerTickCallback: ((seconds: number) => void) | null = null;

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  playChime(frequency: number = 528) {
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(frequency * 0.99, ctx.currentTime + 2.8);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.9);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 3.0);
    } catch {
      // Audio gesture required
    }
  }

  playTap() {
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      gain.gain.setValueAtTime(0.03, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.06);
    } catch {
      // Ignore
    }
  }

  playCelebration() {
    const notes = [440, 554.37, 659.25, 880];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playChime(freq);
      }, idx * 150);
    });
  }

  /**
   * Procedural Sound Generator: Rain, Ocean Waves, Brown Noise, Stream, Forest Breeze, Singing Bowl
   */
  startAmbient(type: 'rain' | 'ocean' | 'brown' | 'stream' | 'forest' | 'bowl' | 'whitenoise', volume = 0.28) {
    this.stopAmbient();
    try {
      const ctx = this.getContext();
      this.currentAmbientType = type;

      if (type === 'bowl') {
        // Continuous Singing Bowl (528 Hz with subtle 531 Hz binaural beating)
        this.bowlOsc1 = ctx.createOscillator();
        this.bowlOsc2 = ctx.createOscillator();
        this.ambientGain = ctx.createGain();

        this.bowlOsc1.type = 'sine';
        this.bowlOsc1.frequency.value = 528;

        this.bowlOsc2.type = 'sine';
        this.bowlOsc2.frequency.value = 530.5; // Gentle 2.5Hz calming binaural pulse

        this.ambientGain.gain.setValueAtTime(0.001, ctx.currentTime);
        this.ambientGain.gain.linearRampToValueAtTime(volume * 0.45, ctx.currentTime + 1.5);

        this.bowlOsc1.connect(this.ambientGain);
        this.bowlOsc2.connect(this.ambientGain);
        this.ambientGain.connect(ctx.destination);

        this.bowlOsc1.start();
        this.bowlOsc2.start();
        return;
      }

      const sampleRate = ctx.sampleRate;
      const bufferSize = sampleRate * 3;
      const buffer = ctx.createBuffer(1, bufferSize, sampleRate);
      const data = buffer.getChannelData(0);

      let lastOut = 0.0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;

        if (type === 'brown') {
          // Warm brown noise
          data[i] = (lastOut + 0.02 * white) / 1.02;
          lastOut = data[i];
          data[i] *= 3.5;
        } else if (type === 'rain') {
          // Rain with sporadic droplets
          data[i] = (lastOut + 0.05 * white) / 1.05;
          lastOut = data[i];
          if (Math.random() < 0.0015) {
            data[i] += (Math.random() - 0.5) * 0.45;
          }
        } else if (type === 'ocean') {
          data[i] = (lastOut + 0.04 * white) / 1.04;
          lastOut = data[i];
        } else if (type === 'forest') {
          // Forest wind with airy softness
          data[i] = (lastOut + 0.03 * white) / 1.03;
          lastOut = data[i];
          if (Math.random() < 0.0003) {
            // Soft subtle tweet burst
            data[i] += Math.sin(i * 0.3) * 0.12;
          }
        } else {
          // Stream / Water
          data[i] = (lastOut + 0.08 * white) / 1.08;
          lastOut = data[i];
        }
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = ctx.createBiquadFilter();

      if (type === 'brown') {
        filter.type = 'lowpass';
        filter.frequency.value = 350;
      } else if (type === 'rain') {
        filter.type = 'lowpass';
        filter.frequency.value = 1200;
      } else if (type === 'ocean') {
        filter.type = 'bandpass';
        filter.frequency.value = 450;
        filter.Q.value = 1.0;

        // Wave swell LFO
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.value = 0.12; // 1 wave every ~8 seconds
        lfoGain.gain.value = 250;
        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);
        lfo.start();
      } else if (type === 'forest') {
        filter.type = 'bandpass';
        filter.frequency.value = 650;
        filter.Q.value = 0.9;
      } else {
        filter.type = 'bandpass';
        filter.frequency.value = 750;
      }

      this.ambientGain = ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.01, ctx.currentTime);
      this.ambientGain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 1.2);

      noise.connect(filter);
      filter.connect(this.ambientGain);
      this.ambientGain.connect(ctx.destination);

      noise.start();
      this.ambientSource = noise;
    } catch {
      // Audio permission
    }
  }

  stopAmbient() {
    this.clearSleepTimer();
    if (this.ambientGain && this.ctx) {
      try {
        this.ambientGain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.6);
        setTimeout(() => {
          if (this.ambientSource) {
            this.ambientSource.stop();
            this.ambientSource.disconnect();
            this.ambientSource = null;
          }
          if (this.bowlOsc1) {
            this.bowlOsc1.stop();
            this.bowlOsc1.disconnect();
            this.bowlOsc1 = null;
          }
          if (this.bowlOsc2) {
            this.bowlOsc2.stop();
            this.bowlOsc2.disconnect();
            this.bowlOsc2 = null;
          }
        }, 650);
      } catch {
        this.ambientSource = null;
        this.bowlOsc1 = null;
        this.bowlOsc2 = null;
      }
    }
    this.currentAmbientType = null;
  }

  /**
   * Set a Sleep Timer for ambient sounds (e.g. 15, 30, 45, 60 minutes)
   */
  setSleepTimer(minutes: number, onTick?: (secondsRemaining: number) => void) {
    this.clearSleepTimer();
    this.sleepTimerSecondsRemaining = minutes * 60;
    this.onSleepTimerTickCallback = onTick || null;

    if (this.onSleepTimerTickCallback) {
      this.onSleepTimerTickCallback(this.sleepTimerSecondsRemaining);
    }

    this.sleepTimerInterval = setInterval(() => {
      this.sleepTimerSecondsRemaining -= 1;
      if (this.onSleepTimerTickCallback) {
        this.onSleepTimerTickCallback(this.sleepTimerSecondsRemaining);
      }

      if (this.sleepTimerSecondsRemaining <= 0) {
        this.stopAmbient();
      }
    }, 1000);
  }

  clearSleepTimer() {
    if (this.sleepTimerInterval) {
      clearInterval(this.sleepTimerInterval);
      this.sleepTimerInterval = null;
    }
    if (this.sleepTimerTimeout) {
      clearTimeout(this.sleepTimerTimeout);
      this.sleepTimerTimeout = null;
    }
    this.sleepTimerSecondsRemaining = 0;
    if (this.onSleepTimerTickCallback) {
      this.onSleepTimerTickCallback(0);
    }
  }

  getSleepTimerSecondsRemaining() {
    return this.sleepTimerSecondsRemaining;
  }

  getCurrentAmbient() {
    return this.currentAmbientType;
  }
}

export const soundFx = new SoundController();
