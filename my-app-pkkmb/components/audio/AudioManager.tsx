'use client';

import { createContext, useContext, useEffect, useState, useRef, useCallback, Suspense } from 'react';
import { usePathname } from 'next/navigation';
import { Howl } from 'howler';

type AudioContextType = {
  isPlaying: boolean;
  toggleMusic: () => void;
  playOvertake: () => void;
  playStart: () => void;
  playFinish: () => void;
};

const AudioManagerCtx = createContext<AudioContextType>({
  isPlaying: false,
  toggleMusic: () => {},
  playOvertake: () => {},
  playStart: () => {},
  playFinish: () => {},
});

export function useAudio() {
  return useContext(AudioManagerCtx);
}

const TRACKS: Record<string, string> = {
  '/race': '/audio/bgm_action_1.mp3',
  default: '/audio/bgm_menu.mp3',
};

function getTrack(pathname: string): string {
  return TRACKS[pathname] ?? TRACKS.default;
}

function PathnameTracker({ onChange }: { onChange: (pathname: string) => void }) {
  const pathname = usePathname();
  useEffect(() => {
    onChange(pathname);
  }, [pathname, onChange]);
  return null;
}

function generateSFX(audioCtx: AudioContext, type: 'overtake' | 'start' | 'finish'): AudioBuffer {
  const sampleRate = audioCtx.sampleRate;
  let length: number;

  if (type === 'overtake') {
    length = sampleRate * 0.4;
    const buf = audioCtx.createBuffer(1, length, sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < length; i++) {
      const t = i / sampleRate;
      const freq = 800 + t * 2000;
      d[i] = Math.sign(Math.sin(2 * Math.PI * freq * t)) * Math.max(0, 1 - t * 3) * 0.3;
    }
    return buf;
  }

  if (type === 'start') {
    const noteLen = 0.15;
    const totalNotes = 4;
    length = sampleRate * noteLen * totalNotes;
    const buf = audioCtx.createBuffer(1, length, sampleRate);
    const d = buf.getChannelData(0);
    const freqs = [440, 554, 659, 880];
    for (let i = 0; i < length; i++) {
      const t = i / sampleRate;
      const noteIdx = Math.floor(t / noteLen) % totalNotes;
      const noteT = (t % noteLen) / noteLen;
      const freq = freqs[noteIdx];
      d[i] = Math.sign(Math.sin(2 * Math.PI * freq * t)) * Math.max(0, 1 - noteT * 2) * 0.3;
    }
    return buf;
  }

  // finish
  length = sampleRate * 1.0;
  const buf = audioCtx.createBuffer(1, length, sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < length; i++) {
    const t = i / sampleRate;
    const freq = 523 + Math.sin(t * 8) * 100;
    d[i] = Math.sign(Math.sin(2 * Math.PI * freq * t)) * Math.max(0, 1 - t * 0.8) * 0.3;
    if (t > 0.5) {
      const f2 = 659 + Math.sin(t * 10) * 80;
      d[i] += Math.sign(Math.sin(2 * Math.PI * f2 * t)) * Math.max(0, 1 - (t - 0.5) * 2) * 0.2;
    }
  }
  return buf;
}

function AudioManagerInner({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const bgmRef = useRef<Howl | null>(null);
  const bgmSrcRef = useRef<string | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }
    return audioCtxRef.current;
  }, []);

  const startTrack = useCallback((path: string) => {
    bgmRef.current?.stop();
    bgmRef.current = null;
    const src = getTrack(path);
    const howl = new Howl({
      src: [src],
      loop: true,
      volume: 0.4,
    });
    bgmRef.current = howl;
    bgmSrcRef.current = src;
    howl.play();
    setIsPlaying(true);
  }, []);

  const toggleMusic = useCallback(() => {
    if (bgmRef.current) {
      bgmRef.current.stop();
      bgmRef.current = null;
      bgmSrcRef.current = null;
      setIsPlaying(false);
      return;
    }
    startTrack(window.location.pathname);
  }, [startTrack]);

  const handlePathnameChange = useCallback(
    (next: string) => {
      if (bgmRef.current && bgmSrcRef.current !== getTrack(next)) {
        startTrack(next);
      }
    },
    [startTrack]
  );

  const playOvertake = useCallback(() => {
    try {
      const ctx = getAudioContext();
      const buffer = generateSFX(ctx, 'overtake');
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      const gain = ctx.createGain();
      gain.gain.value = 0.4;
      source.connect(gain);
      gain.connect(ctx.destination);
      source.start();
    } catch {}
  }, [getAudioContext]);

  const playStart = useCallback(() => {
    try {
      const ctx = getAudioContext();
      const buffer = generateSFX(ctx, 'start');
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      const gain = ctx.createGain();
      gain.gain.value = 0.4;
      source.connect(gain);
      gain.connect(ctx.destination);
      source.start();
    } catch {}
  }, [getAudioContext]);

  const playFinish = useCallback(() => {
    try {
      const ctx = getAudioContext();
      const buffer = generateSFX(ctx, 'finish');
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      const gain = ctx.createGain();
      gain.gain.value = 0.4;
      source.connect(gain);
      gain.connect(ctx.destination);
      source.start();
    } catch {}
  }, [getAudioContext]);

  useEffect(() => {
    const startedRef = { current: false };
    const attemptPlay = () => {
      if (startedRef.current) return;
      startedRef.current = true;
      startTrack(window.location.pathname);
    };
    const stopOnLeave = () => {
      bgmRef.current?.stop();
      bgmRef.current = null;
      bgmSrcRef.current = null;
      setIsPlaying(false);
    };
    attemptPlay();
    window.addEventListener('pointerdown', attemptPlay);
    window.addEventListener('keydown', attemptPlay);
    window.addEventListener('touchstart', attemptPlay);
    window.addEventListener('pagehide', stopOnLeave);
    window.addEventListener('beforeunload', stopOnLeave);
    return () => {
      bgmRef.current?.stop();
      bgmRef.current = null;
      window.removeEventListener('pointerdown', attemptPlay);
      window.removeEventListener('keydown', attemptPlay);
      window.removeEventListener('touchstart', attemptPlay);
      window.removeEventListener('pagehide', stopOnLeave);
      window.removeEventListener('beforeunload', stopOnLeave);
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, [startTrack]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (bgmRef.current?.playing()) {
          bgmRef.current.pause();
        }
      } else {
        if (bgmRef.current && !bgmRef.current.playing()) {
          bgmRef.current.play();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <AudioManagerCtx.Provider value={{ isPlaying, toggleMusic, playOvertake, playStart, playFinish }}>
      <Suspense fallback={null}>
        <PathnameTracker onChange={handlePathnameChange} />
      </Suspense>
      {children}
    </AudioManagerCtx.Provider>
  );
}

export default function AudioManager({ children }: { children: React.ReactNode }) {
  return <AudioManagerInner>{children}</AudioManagerInner>;
}

export function AudioControls() {
  const { isPlaying, toggleMusic } = useAudio();

  return (
    <button
      onClick={toggleMusic}
      className={`pixel-btn text-[9px] ${isPlaying ? 'pixel-btn-green' : ''}`}
      title={isPlaying ? 'Mute Music' : 'Play Music'}
    >
      {isPlaying ? '🔊 MUSIC ON' : '🔇 MUSIC OFF'}
    </button>
  );
}
