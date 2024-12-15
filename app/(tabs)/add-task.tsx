import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedView } from '../../components/ThemedView';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';

export default function AddTask() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [priority, setPriority] = useState('medium');

  const handleSubmit = () => {
    // TODO: Implement task creation
    console.log({ title, description, duration, priority });
  };

  return (
    <ThemedView style={styles.container}>
      <Card style={styles.card}>
        <Input
          placeholder="Task Title"
          value={title}
          onChangeText={setTitle}
        />
        <Input
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
        />
        <Input
          placeholder="Estimated Duration (minutes)"
          value={duration}
          onChangeText={setDuration}
          keyboardType="numeric"
        />
        <Button title="Add Task" onPress={handleSubmit} />
      </Card>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    padding: 16,
  },
});

