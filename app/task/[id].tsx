import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function TaskPage() {
  const { id } = useLocalSearchParams();
  
  return (
    <View className="flex-1 items-center justify-center">
      <Text>Task Page - ID: {id}</Text>
    </View>
  );
} 