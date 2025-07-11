import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit, Clock } from 'lucide-react';

interface Alarm {
  id: string;
  time: string;
  label: string;
  isActive: boolean;
  days: string[];
  challengeType: 'math' | 'tictactoe' | 'memory';
}

interface AlarmCardProps {
  alarm: Alarm;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const AlarmCard: React.FC<AlarmCardProps> = ({ alarm, onToggle, onDelete }) => {
  const getChallengeTypeLabel = (type: string) => {
    switch (type) {
      case 'math': return '🔢 Math';
      case 'tictactoe': return '⭕ Tic Tac Toe';
      case 'memory': return '🧠 Memory Game';
      default: return '🔢 Math';
    }
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour24 = parseInt(hours);
    const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
    const ampm = hour24 >= 12 ? 'PM' : 'AM';
    return `${hour12}:${minutes} ${ampm}`;
  };

  return (
    <Card className={`p-6 transition-all transform hover:scale-[1.02] ${
      alarm.isActive 
        ? 'border-2 border-orange-300 bg-gradient-to-r from-orange-50 to-blue-50 shadow-lg' 
        : 'border-gray-200 bg-gray-50'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-2">
            <div className="flex items-center gap-2">
              <Clock className={`h-5 w-5 ${alarm.isActive ? 'text-orange-500' : 'text-gray-400'}`} />
              <span className={`text-2xl font-bold ${
                alarm.isActive ? 'text-gray-800' : 'text-gray-400'
              }`}>
                {formatTime(alarm.time)}
              </span>
            </div>
            <Badge variant={alarm.isActive ? 'default' : 'secondary'} className="text-xs">
              {getChallengeTypeLabel(alarm.challengeType)}
            </Badge>
          </div>
          
          <p className={`text-sm font-medium mb-2 ${
            alarm.isActive ? 'text-gray-700' : 'text-gray-400'
          }`}>
            {alarm.label}
          </p>
          
          <div className="flex gap-1">
            {alarm.days.map((day) => (
              <span 
                key={day}
                className={`text-xs px-2 py-1 rounded ${
                  alarm.isActive 
                    ? 'bg-orange-100 text-orange-700' 
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {day}
              </span>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Switch 
            checked={alarm.isActive}
            onCheckedChange={() => onToggle(alarm.id)}
            className="data-[state=checked]:bg-orange-500"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(alarm.id)}
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default AlarmCard;
