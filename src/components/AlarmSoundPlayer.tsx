import React, { useEffect, useRef } from 'react';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

interface AlarmSoundPlayerProps {
  soundId: string;
  isPlaying: boolean;
  volume?: number;
}

const AlarmSoundPlayer: React.FC<AlarmSoundPlayerProps> = ({ 
  soundId, 
  isPlaying, 
  volume = 0.8 
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const vibrationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const soundFiles = {
    'classic': '/sounds/classic-alarm.mp3',
    'gentle': '/sounds/gentle-wake.mp3',
    'energetic': '/sounds/energetic-beat.mp3',
    'nature': '/sounds/nature-sounds.mp3',
    'bells': '/sounds/church-bells.mp3'
  };

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.loop = true;
      audioRef.current.volume = volume;
    }

    const audio = audioRef.current;
    const soundFile = soundFiles[soundId as keyof typeof soundFiles] || soundFiles.classic;
    
    if (audio.src !== soundFile) {
      audio.src = soundFile;
    }

    if (isPlaying) {
      audio.play().catch(() => {
        console.log('Audio playback failed - user interaction may be required');
      });
      
      // Start haptic feedback for mobile devices
      startVibration();
    } else {
      audio.pause();
      stopVibration();
    }

    return () => {
      if (audio) {
        audio.pause();
      }
      stopVibration();
    };
  }, [isPlaying, soundId, volume]);

  const startVibration = async () => {
    try {
      // Check if device supports haptics
      if (window.DeviceMotionEvent) {
        vibrationIntervalRef.current = setInterval(async () => {
          await Haptics.impact({ style: ImpactStyle.Heavy });
        }, 1000);
      }
    } catch (error) {
      console.log('Haptics not available');
    }
  };

  const stopVibration = () => {
    if (vibrationIntervalRef.current) {
      clearInterval(vibrationIntervalRef.current);
      vibrationIntervalRef.current = null;
    }
  };

  // This component doesn't render anything visible
  return null;
};

export default AlarmSoundPlayer;