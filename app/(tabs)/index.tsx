import { View, ScrollView, Pressable } from 'react-native';
import { Text, Surface, List, Button } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();
  // Mock data - in real app this would come from AI analysis and user data
  const userName = "Alex";
  const timeOfDay = new Date().getHours() < 12 ? "morning" : new Date().getHours() < 17 ? "afternoon" : "evening";
  const productivityScore = 0.75;
  const focusTime = "2h 30m";
  const completedTasks = 3;
  const totalTasks = 5;
  const streak = 7;

  // Smart Context mock data
  const contextData = {
    weather: { icon: "☀️", temp: "22°", condition: "Clear skies" },
    urgentTasks: { count: 2, nextDue: "2:00 PM" },
    focusStatus: { state: "Peak", timeLeft: "45m" },
    energyLevel: "high",
    suggestedActivity: "creative work",
    nextBreak: "11:30 AM",
    insight: "You're most productive in the mornings. Consider tackling the project proposal now.",
  };

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

  // Calculate total time spent for proper scaling
  const totalTimeSpent = Object.values(analyticsData.taskCategories).reduce((sum, category) => sum + category.timeSpent, 0);

  const handleTaskPress = (taskId: string) => {
    router.push(`/task-detail/${taskId}`);
  };

  // Mock data
  const quickStats = {
    streak: { value: 7, label: "Day Streak" },
    focusTime: { value: "2h 30m", label: "Focus Time" },
    completion: { value: "80%", label: "Completion" },
    energy: { value: "High", label: "Energy" }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <Surface style={styles.surface} elevation={0}>
          {/* Status Bar */}
          <View style={styles.statusBar}>
            <View style={styles.statusItem}>
              <Text style={styles.statusIcon}>{contextData.weather.icon}</Text>
              <View>
                <Text style={styles.statusValue}>{contextData.weather.temp}</Text>
                <Text style={styles.statusLabel}>{contextData.weather.condition}</Text>
              </View>
            </View>
            <View style={styles.statusDivider} />
            <View style={styles.statusItem}>
              <Text style={styles.statusIcon}>🔥</Text>
              <View>
                <Text style={styles.statusValue}>{contextData.urgentTasks.count} urgent</Text>
                <Text style={styles.statusLabel}>Next: {contextData.urgentTasks.nextDue}</Text>
              </View>
            </View>
            <View style={styles.statusDivider} />
            <View style={styles.statusItem}>
              <Text style={styles.statusIcon}>⚡</Text>
              <View>
                <Text style={styles.statusValue}>{contextData.focusStatus.state}</Text>
                <Text style={styles.statusLabel}>{contextData.focusStatus.timeLeft} left</Text>
              </View>
            </View>
          </View>

          {/* Smart Context */}
          <View style={styles.contextContainer}>
            <Text style={styles.greeting}>Good {timeOfDay}, {userName}! 👋</Text>
            <View style={styles.insightContainer}>
              <Text style={styles.insightText}>
                <Text style={styles.insightHighlight}>Today's Focus: </Text>
                You have {contextData.urgentTasks.count} high-priority tasks ahead. Your energy levels suggest it's a good time for {contextData.suggestedActivity}.
              </Text>
              <Text style={styles.insightText}>
                💡 {contextData.insight}
              </Text>
              <Text style={styles.breakReminder}>
                ⏰ Next suggested break: {contextData.nextBreak}
              </Text>
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
          
          {/* Today's Tasks */}
          <View style={styles.tasksContainer}>
            <View style={styles.taskHeader}>
              <Text variant="titleMedium" style={styles.sectionTitle}>Today's Tasks</Text>
              <Button 
                mode="outlined" 
                icon="plus"
                onPress={() => {}}
                style={styles.addButton}
                labelStyle={styles.addButtonLabel}
              >
                Add Task
              </Button>
            </View>
            <List.Section>
              <Pressable onPress={() => handleTaskPress('task1')}>
                <List.Item
                  title="Review Project Proposal"
                  description="High Priority • Due 2:00 PM"
                  left={props => <List.Icon {...props} icon="checkbox-blank-circle-outline" />}
                />
              </Pressable>
              <Pressable onPress={() => handleTaskPress('task2')}>
                <List.Item
                  title="Team Meeting"
                  description="Medium Priority • Due 3:30 PM"
                  left={props => <List.Icon {...props} icon="checkbox-blank-circle-outline" />}
                />
              </Pressable>
              <Pressable onPress={() => handleTaskPress('task3')}>
                <List.Item
                  title="Exercise"
                  description="Low Priority • Due 6:00 PM"
                  left={props => <List.Icon {...props} icon="checkbox-blank-circle-outline" />}
                />
              </Pressable>
            </List.Section>
          </View>

          {/* Analytics Section */}
          <View style={styles.analyticsContainer}>
            <Text variant="titleMedium" style={styles.sectionTitle}>Analytics Insights</Text>
            
            {/* Weekly Performance */}
            <View style={styles.analyticsCard}>
              <Text style={styles.analyticsTitle}>Weekly Task Completion</Text>
              <View style={styles.weeklyStats}>
                <MaterialCommunityIcons name="trending-up" size={24} color="#4CAF50" />
                <Text style={styles.analyticsValue}>{analyticsData.weeklyCompletion}%</Text>
              </View>
              <Text style={styles.analyticsSubtext}>Tasks completed this week</Text>
            </View>

            {/* Productive Times Analysis */}
            <View style={styles.analyticsCard}>
              <Text style={styles.analyticsTitle}>Most Productive Hours</Text>
              {analyticsData.productiveHours.map((hour, index) => (
                <View key={index} style={styles.productiveTimeItem}>
                  <View style={styles.productiveTimeHeader}>
                    <View style={styles.productiveTimeMain}>
                      <Text style={styles.rankNumber}>#{index + 1}</Text>
                      <View>
                        <Text style={styles.productiveTimeText}>{hour.time}</Text>
                        <Text style={styles.productiveTimeLabel}>{hour.label}</Text>
                      </View>
                    </View>
                    <Text style={styles.productivityPercent}>{hour.productivity}%</Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Most Productive Days */}
            <View style={styles.analyticsCard}>
              <Text style={styles.analyticsTitle}>Most Productive Days</Text>
              {analyticsData.productiveDays.map((day, index) => (
                <View key={index} style={styles.productiveTimeItem}>
                  <View style={styles.productiveTimeHeader}>
                    <View style={styles.productiveTimeMain}>
                      <Text style={styles.rankNumber}>#{index + 1}</Text>
                      <Text style={styles.productiveTimeText}>{day.day}</Text>
                    </View>
                    <View style={styles.productivityStats}>
                      <Text style={styles.productivityPercent}>{day.productivity}%</Text>
                      <Text style={styles.tasksCompleted}>{day.tasksCompleted} tasks</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>

            {/* Task Distribution */}
            <View style={styles.analyticsCard}>
              <Text style={styles.analyticsTitle}>Time Spent by Category</Text>
              <View style={styles.taskDistribution}>
                {Object.entries(analyticsData.taskCategories)
                  .sort((a, b) => b[1].timeSpent - a[1].timeSpent)
                  .map(([category, data]) => (
                  <View key={category} style={styles.taskDistributionItem}>
                    <View style={styles.taskDistributionHeader}>
                      <Text style={styles.taskDistributionCategory}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </Text>
                      <Text style={styles.taskDistributionCount}>{data.count} tasks</Text>
                    </View>
                    <View style={styles.taskDistributionBarContainer}>
                      <View style={styles.taskDistributionBarWrapper}>
                        <View 
                          style={[
                            styles.taskDistributionBar, 
                            { 
                              width: `${(data.timeSpent / 15) * 100}%`, // 15 is max hours
                              backgroundColor: getTaskCategoryColor(category)
                            }
                          ]} 
                        />
                      </View>
                      <Text style={styles.taskDistributionTime}>{data.timeSpent}h</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>

            {/* Completion Rate */}
            <View style={styles.analyticsCard}>
              <Text style={styles.analyticsTitle}>Task Completion Rate</Text>
              <View style={styles.completionRate}>
                <View style={styles.completionBar}>
                  <View style={[styles.completionFill, { width: `${analyticsData.completionRate.onTime}%`, backgroundColor: '#4CAF50' }]} />
                  <View style={[styles.completionFill, { width: `${analyticsData.completionRate.late}%`, backgroundColor: '#FFC107' }]} />
                  <View style={[styles.completionFill, { width: `${analyticsData.completionRate.missed}%`, backgroundColor: '#FF5252' }]} />
                </View>
                <View style={styles.completionLegend}>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: '#4CAF50' }]} />
                    <Text style={styles.legendText}>On Time ({analyticsData.completionRate.onTime}%)</Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: '#FFC107' }]} />
                    <Text style={styles.legendText}>Late ({analyticsData.completionRate.late}%)</Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: '#FF5252' }]} />
                    <Text style={styles.legendText}>Missed ({analyticsData.completionRate.missed}%)</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Focus Sessions */}
            <View style={styles.analyticsCard}>
              <Text style={styles.analyticsTitle}>Focus Sessions</Text>
              <View style={styles.focusStats}>
                <View style={styles.focusStat}>
                  <Text style={styles.focusValue}>{analyticsData.focusSessionsWeek}</Text>
                  <Text style={styles.focusLabel}>Sessions this week</Text>
                </View>
                <View style={styles.focusStat}>
                  <Text style={styles.focusValue}>{analyticsData.averageSessionLength}</Text>
                  <Text style={styles.focusLabel}>Avg. session length</Text>
                </View>
              </View>
            </View>
          </View>
        </Surface>
      </ScrollView>
    </View>
  );
}

const getTaskCategoryColor = (category: string) => {
  const colors = {
    work: '#4CAF50',
    study: '#2196F3',
    personal: '#FF9800',
    health: '#E91E63',
    social: '#9C27B0',
  };
  return colors[category] || '#000';
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  surface: {
    flex: 1,
    backgroundColor: '#fff',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
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
  tasksContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontWeight: '600',
  },
  addButton: {
    borderColor: '#000',
    borderRadius: 8,
  },
  addButtonLabel: {
    fontSize: 14,
    color: '#000',
  },
  analyticsContainer: {
    padding: 16,
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
  taskDistributionBar: {
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    flex: 1,
    marginRight: 8,
  },
  taskDistributionTime: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
  },
  productivityStats: {
    alignItems: 'flex-end',
  },
  tasksCompleted: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  taskDistributionBarWrapper: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
    marginRight: 8,
    height: 12,
  },
  contextContainer: {
    padding: 16,
    backgroundColor: '#f8f9ff',
  },
  greeting: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  insightContainer: {
    gap: 8,
  },
  insightText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  insightHighlight: {
    fontWeight: '600',
  },
  breakReminder: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusIcon: {
    fontSize: 20,
  },
  statusValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  statusLabel: {
    fontSize: 12,
    color: '#666',
  },
  statusDivider: {
    width: 1,
    backgroundColor: '#f0f0f0',
    height: '100%',
  },
});


