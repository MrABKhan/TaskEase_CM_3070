import React, { useState } from 'react';
import { View, ScrollView, ViewProps } from 'react-native';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { ThemedText } from '../../components/ThemedText';

interface Task {
  title: string;
  duration: number;
  description?: string;
}

interface Template {
  id: number;
  name: string;
  description: string;
  category: string;
  tasks: Task[];
}

export default function Templates() {
  const [templates] = useState<Template[]>([
    {
      id: 1,
      name: "Weekly Team Meeting",
      description: "Standard setup for weekly team sync",
      category: "Meetings",
      tasks: [
        { title: "Prepare agenda", duration: 15, description: "Collect topics and create meeting outline" },
        { title: "Send meeting invite", duration: 5 },
        { title: "Create meeting notes doc", duration: 5 }
      ]
    },
    {
      id: 2,
      name: "Blog Post Creation",
      description: "Content creation workflow",
      category: "Content",
      tasks: [
        { title: "Research topic", duration: 30 },
        { title: "Create outline", duration: 20 },
        { title: "Write draft", duration: 60 },
        { title: "Edit and revise", duration: 30 }
      ]
    }
  ]);

  const applyTemplate = (template: Template) => {
    // TODO: Add tasks to user's task list
    console.log(`Applying template: ${template.name}`);
  };

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark p-4">
      <ThemedText type="title" className="mb-4">Task Templates</ThemedText>
      <ScrollView>
        {templates.map(template => (
          <Card key={template.id} className="mb-4">
            <View className="flex-row justify-between items-center mb-2">
              <ThemedText type="defaultSemiBold">{template.name}</ThemedText>
              <Badge text={template.category} />
            </View>
            <ThemedText className="text-text-light/70 dark:text-text-dark/70 mb-3">
              {template.description}
            </ThemedText>
            
            <View className="my-3">
              {template.tasks.map((task, index) => (
                <View key={index} className="flex-row justify-between py-1">
                  <ThemedText>• {task.title}</ThemedText>
                  <ThemedText className="text-text-light/70 dark:text-text-dark/70">
                    {task.duration}m
                  </ThemedText>
                </View>
              ))}
            </View>

            <Button 
              onPress={() => applyTemplate(template)}
              title="Use Template"
              className="mt-3"
            />
          </Card>
        ))}
      </ScrollView>
    </View>
  );
} 