import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function TaskDetail() {
  const { id } = useLocalSearchParams();
  
  return (
    <View className="flex-1 items-center justify-center">
      <Text>Task Detail Screen - Task ID: {id}</Text>
    </View>
  );
}

