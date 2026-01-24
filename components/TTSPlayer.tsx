import React, { useState, useRef } from 'react';
import { generateSpeech } from '../services/geminiService';
import { Volume2, Loader2, StopCircle } from 'lucide-react';

interface TTSPlayerProps {
    text: string;
}

/**
 * Decodes base64 string to Uint8Array.
 */
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

/**
 * Decodes raw PCM bytes to AudioBuffer.
 */
async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const TTSPlayer: React.FC<TTSPlayerProps> = ({ text }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [loading, setLoading] = useState(false);
    const audioContextRef = useRef<AudioContext | null>(null);
    const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);

    const handlePlay = async () => {
        if (isPlaying) {
            if (sourceNodeRef.current) {
                sourceNodeRef.current.stop();
                sourceNodeRef.current = null;
            }
            setIsPlaying(false);
            return;
        }

        setLoading(true);
        try {
            const base64Audio = await generateSpeech(text);
            if (base64Audio) {
                if (!audioContextRef.current) {
                    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
                }
                const ctx = audioContextRef.current;
                const audioData = decode(base64Audio);
                const audioBuffer = await decodeAudioData(audioData, ctx, 24000, 1);
                
                const source = ctx.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(ctx.destination);
                source.onended = () => {
                    setIsPlaying(false);
                    sourceNodeRef.current = null;
                };
                
                sourceNodeRef.current = source;
                source.start(0);
                setIsPlaying(true);
            }
        } catch (error) {
            console.error("Audio playback error", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button 
            onClick={handlePlay}
            disabled={loading}
            className="flex items-center gap-2 text-brand-gold hover:text-white transition-colors mb-4 border border-brand-gold/30 px-4 py-2 rounded-full bg-brand-900/50"
        >
            {loading ? <Loader2 size={18} className="animate-spin" /> : isPlaying ? <StopCircle size={18} /> : <Volume2 size={18} />}
            <span className="text-sm font-medium">{isPlaying ? 'Stop Listening' : 'Listen to Article'}</span>
        </button>
    );
};

export default TTSPlayer;