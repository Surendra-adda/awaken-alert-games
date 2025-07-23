import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Volume2, Music, VolumeX } from 'lucide-react';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

interface AlarmSoundSettingsProps {
  selectedSound: string;
  onSoundChange: (sound: string) => void;
}

const AlarmSoundSettings: React.FC<AlarmSoundSettingsProps> = ({ selectedSound, onSoundChange }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);

  const defaultSounds = [
    { id: 'classic', name: 'Classic Alarm', file: '/sounds/classic-alarm.mp3' },
    { id: 'gentle', name: 'Gentle Wake', file: '/sounds/gentle-wake.mp3' },
    { id: 'energetic', name: 'Energetic Beat', file: '/sounds/energetic-beat.mp3' },
    { id: 'nature', name: 'Nature Sounds', file: '/sounds/nature-sounds.mp3' },
    { id: 'bells', name: 'Church Bells', file: '/sounds/church-bells.mp3' }
  ];

  useEffect(() => {
    return () => {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.src = '';
      }
    };
  }, [currentAudio]);

  const playPreview = async (soundFile: string) => {
    try {
      // Haptic feedback for mobile
      if (window.DeviceMotionEvent) {
        await Haptics.impact({ style: ImpactStyle.Light });
      }

      if (currentAudio) {
        currentAudio.pause();
      }

      const audio = new Audio(soundFile);
      audio.volume = 0.5;
      setCurrentAudio(audio);
      setIsPlaying(true);

      audio.addEventListener('ended', () => {
        setIsPlaying(false);
      });

      await audio.play();
      
      // Stop preview after 3 seconds
      setTimeout(() => {
        if (audio) {
          audio.pause();
          setIsPlaying(false);
        }
      }, 3000);
    } catch (error) {
      console.log('Audio preview not available in this environment');
      setIsPlaying(false);
    }
  };

  const stopPreview = () => {
    if (currentAudio) {
      currentAudio.pause();
      setIsPlaying(false);
    }
  };

  const handleSoundSelect = (soundId: string) => {
    onSoundChange(soundId);
    stopPreview();
  };

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Music className="h-5 w-5 text-blue-500" />
          <Label className="text-lg font-semibold">Alarm Sound</Label>
        </div>

        <div className="space-y-3">
          <Label>Default Ringtones</Label>
          <Select value={selectedSound} onValueChange={handleSoundSelect}>
            <SelectTrigger>
              <SelectValue placeholder="Select a ringtone" />
            </SelectTrigger>
            <SelectContent>
              {defaultSounds.map((sound) => (
                <SelectItem key={sound.id} value={sound.id}>
                  {sound.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedSound && (
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  const sound = defaultSounds.find(s => s.id === selectedSound);
                  if (sound) {
                    isPlaying ? stopPreview() : playPreview(sound.file);
                  }
                }}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                {isPlaying ? (
                  <>
                    <VolumeX className="h-4 w-4" />
                    Stop Preview
                  </>
                ) : (
                  <>
                    <Volume2 className="h-4 w-4" />
                    Preview Sound
                  </>
                )}
              </Button>
            </div>
          )}
        </div>

        <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
          <p className="font-medium mb-1">📱 Mobile Features:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Custom ringtones from your device (requires mobile app)</li>
            <li>Vibration patterns and haptic feedback</li>
            <li>Volume bypass for silent/DND mode</li>
          </ul>
        </div>
      </div>
    </Card>
  );
};

export default AlarmSoundSettings;