import { View } from 'react-native';
import { FocusMode } from '../../components/FocusMode';

export default function FocusPage() {
  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark">
      <FocusMode />
    </View>
  );
} 