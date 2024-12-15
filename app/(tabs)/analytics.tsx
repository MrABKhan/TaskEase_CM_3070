import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { Text, Card, Surface, ProgressBar } from 'react-native-paper';
import { StyleSheet } from 'react-native';

export default function AnalyticsScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Analytics 📈</Text>

      <Surface style={styles.surface} elevation={1}>
        <Text variant="titleMedium" style={styles.sectionTitle}>Weekly Progress</Text>
        
        <View style={styles.progressSection}>
          <Text variant="bodyMedium">Work Tasks</Text>
          <ProgressBar progress={0.7} style={styles.progressBar} />
          
          <Text variant="bodyMedium">Personal Tasks</Text>
          <ProgressBar progress={0.5} style={styles.progressBar} />
          
          <Text variant="bodyMedium">Study Tasks</Text>
          <ProgressBar progress={0.3} style={styles.progressBar} />
        </View>
      </Surface>

      <View style={styles.cardsContainer}>
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium">Productivity Score</Text>
            <Text variant="displaySmall" style={styles.scoreText}>85%</Text>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium">Tasks Completed</Text>
            <Text variant="displaySmall" style={styles.scoreText}>24</Text>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    marginBottom: 20,
    textAlign: 'center',
  },
  surface: {
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  progressSection: {
    gap: 12,
  },
  progressBar: {
    height: 8,
    marginBottom: 16,
  },
  cardsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  card: {
    flex: 1,
  },
  scoreText: {
    textAlign: 'center',
    marginTop: 8,
  },
}); 