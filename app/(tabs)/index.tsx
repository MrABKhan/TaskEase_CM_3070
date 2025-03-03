import React from 'react';
import { View, ScrollView, Pressable, RefreshControl } from 'react-native';
import { Text, Surface, Button, List, IconButton, ActivityIndicator } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Link, useFocusEffect } from 'expo-router';
import { useState, useEffect, useCallback } from 'react';
import api, { ActivityMetrics, Task, WellnessMetrics } from '../services/api';
import { generateSmartContext } from '../services/smartContext';
import TaskList from '../components/TaskList';

type Category = 'work' | 'health' | 'study' | 'leisure';
type Priority = 'high' | 'medium' | 'low';

interface SmartContext {
  weather: {
    icon: string;
    temp: string;
    condition: string;
    location?: string;
  };
  urgentTasks: {
    count: number;
    nextDue: string;
  };
  focusStatus: {
    state: string;
    timeLeft: string;
    details: string;
    recommendation: string;
    priority: string;
  };
  energyLevel: string;
  suggestedActivity: string;
  nextBreak: string;
  insight: string;
  timestamp: string;
  lastUpdated: string;
}

export default function TabOneScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [contextLoading, setContextLoading] = useState(false);
  const [wellnessMetrics, setWellnessMetrics] = useState<WellnessMetrics | null>(null);
  const [wellnessLoading, setWellnessLoading] = useState(false);
  const [contextData, setContextData] = useState<SmartContext>({
    weather: { icon: "☀️", temp: "22°", condition: "Clear skies" },
    urgentTasks: { count: 2, nextDue: "2:00 PM" },
    focusStatus: { 
      state: "Peak", 
      timeLeft: "45m", 
      details: "Morning hours are optimal for deep work and complex problem-solving.",
      recommendation: "Focus on your most challenging tasks that require critical thinking.",
      priority: "high"
    },
    energyLevel: "high",
    suggestedActivity: "creative work",
    nextBreak: "11:30 AM",
    insight: "You're most productive in the mornings. Consider tackling the project proposal now.",
    timestamp: new Date().toISOString(),
    lastUpdated: "00:00",
  });
  const [activityMetrics, setActivityMetrics] = useState<ActivityMetrics | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadTasks();
      loadAnalytics();
      loadWellnessMetrics();
    }, [])
  );

  const loadTasks = async (forceRefresh: boolean = false) => {
    try {
      console.log('[SmartContext] Loading tasks...');
      setContextLoading(true);
      
      const fetchedTasks = await api.getTodayTasks();
      setTasks(fetchedTasks);

      // Generate smart context when tasks are loaded
      console.log('[SmartContext] Generating smart context for loaded tasks...');
      const smartContext = await generateSmartContext(
        fetchedTasks,
        analyticsData,
        contextData.weather,
        forceRefresh
      );
      console.log('[SmartContext] Generated context:', smartContext);

      // Update context data state
      setContextData(smartContext);

      console.log('[SmartContext] Tasks loaded successfully:', {
        count: fetchedTasks.length,
        completed: fetchedTasks.filter((t: Task) => t.completed).length,
        categories: fetchedTasks.reduce((acc: Record<string, number>, t: Task) => {
          acc[t.category] = (acc[t.category] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      });
    } catch (error) {
      console.error('[SmartContext] Error loading tasks:', error);
    } finally {
      setLoading(false);
      setContextLoading(false);
      setRefreshing(false);
    }
  };

  const loadAnalytics = async () => {
    try {
      console.log('[Analytics] Loading activity metrics...');
      setAnalyticsLoading(true);
      const metrics = await api.getActivityAnalytics();
      setActivityMetrics(metrics);
      console.log('[Analytics] Activity metrics loaded:', metrics);
    } catch (error) {
      console.error('[Analytics] Error loading activity metrics:', error);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const loadWellnessMetrics = async () => {
    try {
      console.log('[Wellness] Loading wellness metrics...');
      setWellnessLoading(true);
      const metrics = await api.getWellnessMetrics();
      setWellnessMetrics(metrics);
      console.log('[Wellness] Wellness metrics loaded:', metrics);
    } catch (error) {
      console.error('[Wellness] Error loading wellness metrics:', error);
    } finally {
      setWellnessLoading(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadTasks(true);
  }, []);

  const handleTaskComplete = async (taskId: string, completed: boolean) => {
    try {
      console.log('[SmartContext] Updating task:', { taskId, completed });
      
      await api.updateTask(taskId, { completed });
      const updatedTasks = tasks.map(t => 
        t.id === taskId ? { ...t, completed } : t
      );
      setTasks(updatedTasks);

      // Regenerate smart context with updated tasks
      setContextLoading(true);
      const smartContext = await generateSmartContext(
        updatedTasks,
        analyticsData,
        contextData.weather,
        true // Force refresh
      );
      setContextData(smartContext);

      console.log('[SmartContext] Task update successful');
    } catch (error) {
      console.error('[SmartContext] Error updating task:', error);
    } finally {
      setContextLoading(false);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      console.log('[SmartContext] Deleting task:', { taskId });
      
      await api.deleteTask(taskId);
      // Update local state
      const updatedTasks = tasks.filter(t => t.id !== taskId);
      setTasks(updatedTasks);

      // Regenerate smart context with updated tasks
      setContextLoading(true);
      const smartContext = await generateSmartContext(
        updatedTasks,
        analyticsData,
        contextData.weather,
        true // Force refresh
      );
      setContextData(smartContext);

      console.log('[SmartContext] Task deletion successful');
    } catch (error) {
      console.error('[SmartContext] Error deleting task:', error);
    } finally {
      setContextLoading(false);
    }
  };

  // Mock data - in real app this would come from AI analysis and user data
  const userName = "Alex";
  const timeOfDay = new Date().getHours() < 12 ? "morning" : new Date().getHours() < 17 ? "afternoon" : "evening";

  // Analytics mock data
  const analyticsData = {
    weeklyCompletion: 85,
    productiveHours: [
      { time: "9:00 - 11:00", productivity: 95, label: "Peak Focus" },
      { time: "14:00 - 16:00", productivity: 85, label: "High Energy" },
      { time: "7:00 - 9:00", productivity: 80, label: "Morning Focus" },
    ],
    productiveDays: [
      { day: "Tuesday", productivity: 90, tasksCompleted: 8 },
      { day: "Wednesday", productivity: 85, tasksCompleted: 7 },
      { day: "Monday", productivity: 80, tasksCompleted: 6 },
    ],
    taskCategories: {
      work: { count: 12, timeSpent: 15 }, // timeSpent in hours
      study: { count: 8, timeSpent: 8 },
      personal: { count: 5, timeSpent: 5 },
      health: { count: 4, timeSpent: 3 },
      social: { count: 3, timeSpent: 2 },
    },
    focusSessionsWeek: 15,
    averageSessionLength: "45m",
    completionRate: {
      onTime: 80,
      late: 15,
      missed: 5,
    }
  };

  // Quick stats
  const quickStats = {
    streak: { value: 7, label: "Day Streak" },
    focusTime: { value: "2h 30m", label: "Focus Time" },
    completion: { value: "80%", label: "Completion" },
    energy: { value: "High", label: "Energy" }
  };

  const getCategoryColor = (category: Category): string => {
    switch (category) {
      case 'work':
        return '#007AFF';
      case 'health':
        return '#30D158';
      case 'study':
        return '#5856D6';
      case 'leisure':
        return '#FF9F0A';
      default:
        return '#666';
    }
  };

  const getCategoryIcon = (category: Category): string => {
    switch (category) {
      case 'work':
        return 'briefcase-outline';
      case 'health':
        return 'heart-outline';
      case 'study':
        return 'book-outline';
      case 'leisure':
        return 'gamepad-variant-outline';
      default:
        return 'tag-outline';
    }
  };

  const getPriorityColor = (priority: Priority): string => {
    switch (priority) {
      case 'high':
        return '#FF453A';
      case 'medium':
        return '#FF9F0A';
      case 'low':
        return '#30D158';
      default:
        return '#666';
    }
  };

  const getFocusPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'high':
        return '#FF453A';
      case 'medium':
        return '#FF9F0A';
      case 'low':
        return '#30D158';
      default:
        return '#666';
    }
  };

  // Add logging for smart context data
  useEffect(() => {
    console.log('[SmartContext] Current Context:', {
      timeOfDay,
      weather: contextData.weather,
      urgentTasks: contextData.urgentTasks,
      focusStatus: contextData.focusStatus,
      energyLevel: contextData.energyLevel,
      suggestedActivity: contextData.suggestedActivity,
      nextBreak: contextData.nextBreak,
    });

    console.log('[SmartContext] Analytics:', {
      weeklyCompletion: analyticsData.weeklyCompletion,
      focusSessionsWeek: analyticsData.focusSessionsWeek,
      averageSessionLength: analyticsData.averageSessionLength,
      productiveHours: analyticsData.productiveHours,
      completionRate: analyticsData.completionRate,
    });

    console.log('[SmartContext] Quick Stats:', quickStats);
  }, [contextData, analyticsData, quickStats, timeOfDay]);

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Surface style={styles.surface} elevation={0}>
          {/* Status Bar */}
          <View style={styles.statusBar}>
            <View style={styles.statusRow}>
              <View style={[styles.statusItem, styles.weatherItem]}>
                <Text style={[
                  styles.statusIcon,
                  contextData.weather.icon === '⚠️' && styles.errorIcon
                ]}>{contextData.weather.icon}</Text>
                <View>
                  <Text style={[
                    styles.statusValue,
                    contextData.weather.temp === 'N/A' && styles.errorText
                  ]}>{contextData.weather.condition}</Text>
                  {contextData.weather.location ? (
                    <>
                      <Text style={styles.statusLabel} numberOfLines={1}>
                        {contextData.weather.location.split(',')[0].trim()}
                      </Text>
                      <Text style={styles.statusLabel} numberOfLines={1}>
                        {contextData.weather.location.split(',')[1]?.trim() || ''}
                      </Text>
                    </>
                  ) : (
                    <Text style={[styles.statusLabel, styles.errorText]}>Location unavailable</Text>
                  )}
                </View>
              </View>
              <View style={[styles.statusItem, styles.urgentItem]}>
                <Text style={styles.statusIcon}>🔥</Text>
                <View>
                  <Text style={styles.statusValue}>{contextData.urgentTasks.count} urgent</Text>
                  <Text style={styles.statusLabel}>Next: {contextData.urgentTasks.nextDue}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Smart Context */}
          <View style={styles.contextContainer}>
            <View style={styles.contextHeader}>
              <Text style={styles.greeting}>Good {timeOfDay}, {userName}! 👋</Text>
              {contextLoading && (
                <ActivityIndicator size="small" style={styles.contextLoader} />
              )}
            </View>
            <View style={styles.insightContainer}>
              <Text style={styles.insightText}>
                <Text style={styles.focusState}>
                  {contextData.focusStatus.state}
                </Text>
              </Text>
              
              <View style={styles.focusDetailsContainer}>
                <Text style={styles.insightText}>
                  🧠 {contextData.focusStatus.details}
                </Text>
                
                <Text style={styles.insightText}>
                  ✅ <Text style={styles.insightHighlight}>Recommendation: </Text>
                  {contextData.focusStatus.recommendation}
                </Text>
                
                <Text style={styles.insightText}>
                  💡 {contextData.insight}
                </Text>
                
                <Text style={styles.breakReminder}>
                  ⏰ Next suggested break: {contextData.nextBreak}
                </Text>
              </View>
            </View>
          </View>

          {/* Quick Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.stat}>
              <MaterialCommunityIcons name="fire" size={24} color="#FF9500" />
              <Text style={styles.statValue}>{quickStats.streak.value}</Text>
              <Text style={styles.statLabel}>{quickStats.streak.label}</Text>
            </View>
            <View style={styles.stat}>
              <MaterialCommunityIcons name="timer-outline" size={24} color="#000" />
              <Text style={styles.statValue}>{quickStats.focusTime.value}</Text>
              <Text style={styles.statLabel}>{quickStats.focusTime.label}</Text>
            </View>
            <View style={styles.stat}>
              <MaterialCommunityIcons name="check-circle-outline" size={24} color="#4CAF50" />
              <Text style={styles.statValue}>{quickStats.completion.value}</Text>
              <Text style={styles.statLabel}>{quickStats.completion.label}</Text>
            </View>
            <View style={styles.stat}>
              <MaterialCommunityIcons name="lightning-bolt" size={24} color="#FF9500" />
              <Text style={styles.statValue}>{quickStats.energy.value}</Text>
              <Text style={styles.statLabel}>{quickStats.energy.label}</Text>
            </View>
          </View>

          {/* Task List */}
          <View style={styles.taskList}>
            <View style={styles.taskListHeader}>
              <View style={styles.taskListHeaderLeft}>
                <Text style={styles.sectionTitle}>Today's Tasks</Text>
              </View>
              <View style={styles.taskListHeaderRight}>
                <MaterialCommunityIcons name="calendar" size={16} color="#666" style={styles.dateIcon} />
                <Text style={styles.dateText} numberOfLines={1}>
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric'
                  })}
                </Text>
              </View>
            </View>
            {tasks.length > 0 ? (
              <>
                <TaskList
                  tasks={tasks}
                  onTaskComplete={handleTaskComplete}
                  onTaskDelete={handleDeleteTask}
                />
                <Link href="/calendar" asChild>
                  <Pressable>
                    {({ pressed }) => (
                      <View style={[
                        styles.showMoreContent,
                        { opacity: pressed ? 0.7 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] }
                      ]}>
                        <MaterialCommunityIcons name="calendar-month" size={16} color="#007AFF" />
                        <Text style={styles.showMoreText}>View Upcoming Schedule</Text>
                        <MaterialCommunityIcons name="chevron-right" size={16} color="#007AFF" />
                      </View>
                    )}
                  </Pressable>
                </Link>
              </>
            ) : (
              <Text style={styles.emptyText}>No tasks scheduled for today</Text>
            )}
          </View>
        </Surface>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  surface: {
    padding: 16,
  },
  statusBar: {
    padding: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    gap: 12,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    flex: 1,
  },
  weatherItem: {
    maxWidth: '60%',
    paddingRight: 8,
  },
  urgentItem: {
    maxWidth: '40%',
  },
  statusIcon: {
    fontSize: 20,
    minWidth: 24,
    textAlign: 'center',
  },
  statusValue: {
    fontSize: 14,
    fontWeight: '600',
    flexShrink: 1,
  },
  statusLabel: {
    fontSize: 12,
    color: '#666',
    flexShrink: 1,
  },
  contextContainer: {
    marginBottom: 24,
    backgroundColor: '#f8f9ff',
    padding: 16,
    borderRadius: 12,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 12,
  },
  insightContainer: {
    gap: 12,
  },
  focusDetailsContainer: {
    marginTop: 12,
    marginBottom: 12,
    gap: 12,
  },
  insightText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  insightHighlight: {
    fontWeight: '600',
    color: '#333',
  },
  focusState: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  breakReminder: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  inputButton: {
    flex: 1,
    borderColor: '#000',
  },
  taskList: {
    flex: 1,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  taskItem: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  taskMeta: {
    flexDirection: 'column',
    gap: 8,
    marginTop: 4,
  },
  tagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  tagIcon: {
    marginRight: 4,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    fontSize: 12,
    color: '#666',
  },
  analyticsContainer: {
    marginTop: 8,
  },
  analyticsCard: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
  },
  analyticsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  analyticsValue: {
    fontSize: 24,
    fontWeight: '700',
    marginLeft: 8,
  },
  analyticsSubtext: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  weeklyStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productiveTimeItem: {
    marginBottom: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  productiveTimeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productiveTimeMain: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rankNumber: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 12,
    color: '#666',
  },
  productiveTimeText: {
    fontSize: 14,
    fontWeight: '500',
  },
  productiveTimeLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  productivityPercent: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
  },
  productivityStats: {
    alignItems: 'flex-end',
  },
  tasksCompleted: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  taskDistribution: {
    marginTop: 12,
  },
  taskDistributionItem: {
    marginBottom: 16,
  },
  taskDistributionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  taskDistributionCategory: {
    fontSize: 14,
    fontWeight: '500',
  },
  taskDistributionCount: {
    fontSize: 12,
    color: '#666',
  },
  taskDistributionBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskDistributionBarWrapper: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
    marginRight: 8,
    height: 12,
  },
  taskDistributionBar: {
    height: '100%',
    borderRadius: 6,
  },
  taskDistributionTime: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
  },
  completionRate: {
    marginTop: 12,
  },
  completionBar: {
    height: 24,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  completionFill: {
    height: '100%',
  },
  completionLegend: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
  },
  focusStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  focusStat: {
    alignItems: 'center',
  },
  focusValue: {
    fontSize: 20,
    fontWeight: '600',
  },
  focusLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  taskItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxContainer: {
    paddingLeft: 0,
    paddingRight: 8,
  },
  taskContent: {
    flex: 1,
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  taskMetaCompleted: {
    opacity: 0.7,
  },
  timeTextCompleted: {
    color: '#999',
  },
  activityCard: {
    padding: 20,
  },
  activityContainer: {
    gap: 16,
  },
  timePeriodLabels: {
    flexDirection: 'row',
    paddingLeft: 45,
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingRight: 8,
  },
  timeLabel: {
    fontSize: 12,
    color: '#666',
    width: 36,
    textAlign: 'center',
  },
  graphContainer: {
    gap: 8,
  },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dayLabel: {
    fontSize: 12,
    color: '#666',
    width: 45,
    textAlign: 'left',
  },
  activityRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 8,
  },
  activityCell: {
    width: 36,
    height: 24,
    borderRadius: 4,
    marginRight: 4,
  },
  activityLegend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    gap: 8,
  },
  activityLegendCells: {
    flexDirection: 'row',
    gap: 4,
  },
  activityLegendCell: {
    width: 16,
    height: 16,
    borderRadius: 3,
  },
  activityLegendText: {
    fontSize: 12,
    color: '#666',
  },
  productivityInsights: {
    marginTop: 16,
    marginBottom: 16,
    gap: 12,
  },
  productivityInsight: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  insightIcon: {
    width: 24,
    alignItems: 'center',
    marginRight: 8,
  },
  insightContent: {
    flex: 1,
  },
  insightLabel: {
    fontSize: 14,
    color: '#666',
  },
  insightValue: {
    fontSize: 14,
    color: '#000',
    marginTop: 2,
  },
  activityStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  activityStat: {
    alignItems: 'center',
  },
  activityStatValue: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
  },
  activityStatLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  wellnessContainer: {
    gap: 16,
  },
  wellnessMetric: {
    gap: 12,
  },
  wellnessHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  wellnessTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  wellnessSubtext: {
    fontSize: 12,
    color: '#666',
  },
  stressIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stressBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#6366F115',
    borderRadius: 4,
    overflow: 'hidden',
  },
  stressBar: {
    height: '100%',
    borderRadius: 4,
  },
  stressLabel: {
    fontSize: 14,
    fontWeight: '600',
    width: 40,
  },
  balanceDistribution: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  balanceItem: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
  },
  balanceValue: {
    fontSize: 18,
    fontWeight: '600',
  },
  balanceLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  breakProgress: {
    gap: 8,
  },
  breakBar: {
    flexDirection: 'row',
    gap: 4,
  },
  breakDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    flex: 1,
  },
  breakStats: {
    fontSize: 14,
  },
  breakHighlight: {
    fontWeight: '600',
  },
  insightsContainer: {
    gap: 12,
  },
  insightMetric: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  insightIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  insightContentWrapper: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  insightDescription: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  metricCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  insightMetricContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  insightMetricValue: {
    fontSize: 18,
    fontWeight: '600',
  },
  insightMetricLabel: {
    fontSize: 14,
    color: '#666',
  },
  loadIndicator: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  loadText: {
    fontSize: 14,
    fontWeight: '500',
  },
  trendIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    gap: 4,
  },
  trendText: {
    fontSize: 12,
    fontWeight: '500',
  },
  taskListHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingRight: 4,
  },
  taskListHeaderLeft: {
    flex: 1,
  },
  taskListHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateIcon: {
    marginRight: 2,
  },
  dateText: {
    fontSize: 14,
    color: '#666',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 24,
  },
  showMoreButton: {
    marginTop: 16,
    marginHorizontal: -16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#F8F8F8',
  },
  showMoreContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingTop: 12,
    alignSelf: 'center',
  },
  showMoreText: {
    fontSize: 14,
    color: '#007AFF',
  },
  contextHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  contextLoader: {
    marginLeft: 8,
  },
  lastUpdated: {
    fontSize: 12,
    color: '#666',
  },
  errorIcon: {
    color: '#FF453A',
  },
  errorText: {
    color: '#FF453A',
  },
  energyLevel: {
    fontWeight: 'bold',
  },
});


