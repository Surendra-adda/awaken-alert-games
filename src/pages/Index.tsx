import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Clock, Plus, Settings, Moon } from 'lucide-react';
import AlarmCard from '@/components/AlarmCard';
import WakeUpChallenge from '@/components/WakeUpChallenge';
import { useToast } from '@/hooks/use-toast';

interface Alarm {
  id: string;
  time: string;
  label: string;
  isActive: boolean;
  days: string[];
  challengeType: 'math' | 'tictactoe' | 'memory' | 'match' | 'shake';
}

const Index = () => {
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [showAddAlarm, setShowAddAlarm] = useState(false);
  const [activeChallenge, setActiveChallenge] = useState<Alarm | null>(null);
  const [newAlarm, setNewAlarm] = useState({
    time: '',
    label: '',
    challengeType: 'math' as 'math' | 'tictactoe' | 'memory' | 'match' | 'shake',
    days: [] as string[]
  });
  const { toast } = useToast();

  const weekdays = [
    { short: 'Mon', full: 'Monday' },
    { short: 'Tue', full: 'Tuesday' },
    { short: 'Wed', full: 'Wednesday' },
    { short: 'Thu', full: 'Thursday' },
    { short: 'Fri', full: 'Friday' },
    { short: 'Sat', full: 'Saturday' },
    { short: 'Sun', full: 'Sunday' }
  ];

  // Simulate alarm trigger for demo
  useEffect(() => {
    const checkAlarms = () => {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      const triggeredAlarm = alarms.find(alarm => 
        alarm.isActive && alarm.time === currentTime
      );
      
      if (triggeredAlarm) {
        setActiveChallenge(triggeredAlarm);
      }
    };

    const interval = setInterval(checkAlarms, 1000);
    return () => clearInterval(interval);
  }, [alarms]);

  const addAlarm = () => {
    if (!newAlarm.time) {
      toast({
        title: "Error",
        description: "Please set a time for the alarm",
        variant: "destructive"
      });
      return;
    }

    if (newAlarm.days.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one day",
        variant: "destructive"
      });
      return;
    }

    const alarm: Alarm = {
      id: Date.now().toString(),
      time: newAlarm.time,
      label: newAlarm.label || 'Wake up!',
      isActive: true,
      days: newAlarm.days,
      challengeType: newAlarm.challengeType
    };

    setAlarms([...alarms, alarm]);
    setShowAddAlarm(false);
    setNewAlarm({ time: '', label: '', challengeType: 'math', days: [] });
    
    toast({
      title: "Alarm Created!",
      description: `Your smart alarm is set for ${newAlarm.time}`,
    });
  };

  const toggleDay = (day: string) => {
    setNewAlarm(prev => ({
      ...prev,
      days: prev.days.includes(day) 
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day]
    }));
  };

  const toggleAlarm = (id: string) => {
    setAlarms(alarms.map(alarm =>
      alarm.id === id ? { ...alarm, isActive: !alarm.isActive } : alarm
    ));
  };

  const deleteAlarm = (id: string) => {
    setAlarms(alarms.filter(alarm => alarm.id !== id));
  };

  const handleChallengeComplete = () => {
    setActiveChallenge(null);
    toast({
      title: "Good Morning! 🌅",
      description: "Challenge completed successfully. You're awake!",
    });
  };

  if (activeChallenge) {
    return (
      <WakeUpChallenge 
        alarm={activeChallenge}
        onComplete={handleChallengeComplete}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-orange-500 to-blue-500 rounded-full">
              <Clock className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-blue-600 bg-clip-text text-transparent">
              Smart Alarm
            </h1>
          </div>
          <p className="text-lg text-gray-600">
            Wake up with purpose. Complete games to prove you're truly awake.
          </p>
        </div>

        {/* Add Alarm Button */}
        <div className="text-center mb-8">
          <Button 
            onClick={() => setShowAddAlarm(true)}
            className="bg-gradient-to-r from-orange-500 to-blue-500 hover:from-orange-600 hover:to-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg transform hover:scale-105 transition-all"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create Smart Alarm
          </Button>
        </div>

        {/* Add Alarm Form */}
        {showAddAlarm && (
          <Card className="max-w-md mx-auto mb-8 p-6 border-2 border-orange-200 shadow-xl">
            <h3 className="text-xl font-bold mb-4 text-center">New Smart Alarm</h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={newAlarm.time}
                  onChange={(e) => setNewAlarm({...newAlarm, time: e.target.value})}
                  className="border-orange-200 focus:border-orange-500"
                />
              </div>
              
              <div>
                <Label htmlFor="label">Label (optional)</Label>
                <Input
                  id="label"
                  placeholder="Wake up for work"
                  value={newAlarm.label}
                  onChange={(e) => setNewAlarm({...newAlarm, label: e.target.value})}
                  className="border-orange-200 focus:border-orange-500"
                />
              </div>

              <div>
                <Label>Days of the Week</Label>
                <div className="grid grid-cols-7 gap-1 mt-2">
                  {weekdays.map((day) => (
                    <Button
                      key={day.short}
                      variant={newAlarm.days.includes(day.short) ? 'default' : 'outline'}
                      onClick={() => toggleDay(day.short)}
                      className="h-10 text-xs p-0"
                      size="sm"
                    >
                      {day.short}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div>
                <Label>Challenge Type</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {[
                    { type: 'math', label: '🔢 Math' },
                    { type: 'tictactoe', label: '⭕ Tic Tac Toe' },
                    { type: 'memory', label: '🧠 Memory Game' },
                    { type: 'match', label: '🎯 Match Objects' },
                    { type: 'shake', label: '📱 Shake to Stop' }
                  ].map(({ type, label }) => (
                    <Button
                      key={type}
                      variant={newAlarm.challengeType === type ? 'default' : 'outline'}
                      onClick={() => setNewAlarm({...newAlarm, challengeType: type as any})}
                      className="text-sm"
                    >
                      {label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 mt-6">
              <Button onClick={addAlarm} className="flex-1 bg-orange-500 hover:bg-orange-600">
                Create Alarm
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowAddAlarm(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </Card>
        )}

        {/* Alarms List */}
        <div className="max-w-2xl mx-auto space-y-4">
          {alarms.length === 0 ? (
            <Card className="p-8 text-center border-dashed border-2 border-gray-300">
              <Moon className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No alarms set</h3>
              <p className="text-gray-500">Create your first smart alarm to get started!</p>
            </Card>
          ) : (
            alarms.map((alarm) => (
              <AlarmCard
                key={alarm.id}
                alarm={alarm}
                onToggle={toggleAlarm}
                onDelete={deleteAlarm}
              />
            ))
          )}
        </div>

        {/* Features Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Why Smart Alarm Works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: '🎮',
                title: 'Interactive Games',
                description: 'Play engaging mini-games like Tic Tac Toe and Memory cards to prove you\'re awake.'
              },
              {
                icon: '🔒',
                title: 'Override Silent Mode',
                description: 'Your alarm will sound even when your phone is on silent or Do Not Disturb.'
              },
              {
                icon: '📈',
                title: 'Progressive Difficulty',
                description: 'Games get harder if you fail, ensuring you wake up completely.'
              }
            ].map((feature, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
