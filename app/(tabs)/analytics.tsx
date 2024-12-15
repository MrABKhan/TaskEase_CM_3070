import React, { useState } from 'react';
import { View, ScrollView, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { ThemedView } from '../../components/ThemedView';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';

interface ChartData {
  labels: string[];
  datasets: {
    data: number[];
    color?: (opacity: number) => string;
  }[];
}

interface TaskMetrics {
  completed: number;
  inProgress: number;
  overdue: number;
  totalFocusTime: number;
  averageTaskDuration: number;
  productivityScore: number;
}

export default function Analytics() {
  const [timeFrame, setTimeFrame] = useState<'week' | 'month'>('week');
  const [metrics] = useState<TaskMetrics>({
    completed: 23,
    inProgress: 7,
    overdue: 2,
    totalFocusTime: 14.5,
    averageTaskDuration: 45,
    productivityScore: 85,
  });

  const productivityData: ChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      data: [85, 70, 95, 88, 92, 75, 89],
      color: (opacity = 1) => `rgba(65, 131, 215, ${opacity})`,
    }]
  };

  const taskCategoryData: ChartData = {
    labels: ['Work', 'Personal', 'Study', 'Health', 'Other'],
    datasets: [{
      data: [35, 25, 20, 15, 5],
    }]
  };

  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    decimalPlaces: 0,
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Summary Cards */}
        <View style={styles.summaryContainer}>
          <Card style={styles.summaryCard}>
            <Text style={styles.metricValue}>{metrics.completed}</Text>
            <Text style={styles.metricLabel}>Completed</Text>
          </Card>
          <Card style={styles.summaryCard}>
            <Text style={styles.metricValue}>{metrics.productivityScore}%</Text>
            <Text style={styles.metricLabel}>Productivity</Text>
          </Card>
          <Card style={styles.summaryCard}>
            <Text style={styles.metricValue}>{metrics.totalFocusTime}h</Text>
            <Text style={styles.metricLabel}>Focus Time</Text>
          </Card>
        </View>

        {/* Productivity Trend */}
        <Card style={styles.chartCard}>
          <Text style={styles.chartTitle}>Productivity Trend</Text>
          <LineChart
            data={productivityData}
            width={Dimensions.get('window').width - 48}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </Card>

        {/* Task Distribution */}
        <Card style={styles.chartCard}>
          <Text style={styles.chartTitle}>Task Distribution</Text>
          <BarChart
            data={taskCategoryData}
            width={Dimensions.get('window').width - 48}
            height={220}
            chartConfig={chartConfig}
            style={styles.chart}
            showValuesOnTopOfBars
          />
        </Card>

        {/* Detailed Metrics */}
        <Card style={styles.metricsCard}>
          <Text style={styles.chartTitle}>Detailed Metrics</Text>
          <View style={styles.metricRow}>
            <Text style={styles.metricText}>Average Task Duration</Text>
            <Badge>{`${metrics.averageTaskDuration} min`}</Badge>
          </View>
          <View style={styles.metricRow}>
            <Text style={styles.metricText}>Tasks In Progress</Text>
            <Badge>{metrics.inProgress}</Badge>
          </View>
          <View style={styles.metricRow}>
            <Text style={styles.metricText}>Overdue Tasks</Text>
            <Badge style={styles.overdueBadge}>{metrics.overdue}</Badge>
          </View>
        </Card>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  summaryCard: {
    flex: 1,
    marginHorizontal: 4,
    padding: 12,
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: '#666',
  },
  chartCard: {
    marginBottom: 16,
    padding: 16,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  metricsCard: {
    marginBottom: 16,
    padding: 16,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
  },
  metricText: {
    fontSize: 16,
    color: '#333',
  },
  overdueBadge: {
    backgroundColor: '#ff4444',
  },
}); 