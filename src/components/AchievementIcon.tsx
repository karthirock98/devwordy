import { BookOpen, Bug, CalendarCheck, Flame, Moon, Sparkles, Swords, Target, Trophy, type LucideProps } from 'lucide-react';
import type { Achievement } from '../game/progression';

const ICONS = { Swords, Bug, Moon, BookOpen, Sparkles, Flame, Target, CalendarCheck, Trophy };

export default function AchievementIcon({ icon, ...props }: { icon: Achievement['icon'] } & LucideProps) {
  const Icon = ICONS[icon];
  return <Icon {...props} />;
}
