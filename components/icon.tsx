import { type LucideIcon } from 'lucide-react-native';
import {
  Plus,
  List,
  BarChart3,
  Settings,
  ImagePlus,
  X,
  ChevronLeft,
} from 'lucide-react-native';
import { useTheme } from 'tamagui';

const iconMap: Record<string, LucideIcon> = {
  Plus,
  List,
  BarChart3,
  Settings,
  ImagePlus,
  X,
  ChevronLeft,
};

interface IconProps {
  name: keyof typeof iconMap;
  size?: number;
  color?: string;
}

export function Icon({ name, size = 24, color }: IconProps) {
  const theme = useTheme();
  const iconColor = color ?? theme.textPrimary?.val ?? '#111111';
  const LucideIcon = iconMap[name];
  if (!LucideIcon) return null;
  return <LucideIcon size={size} color={iconColor} />;
}

export { Plus, List, BarChart3, Settings, ImagePlus, X, ChevronLeft };
