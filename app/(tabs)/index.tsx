import { View, ScrollView } from 'react-native';
import { Text, Surface, Button, List, IconButton } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';

type Category = 'work' | 'health' | 'study' | 'leisure';
type Priority = 'high' | 'medium' | 'low';

interface Task {
  id: string;
  title: string;
  category: Category;
  priority: Priority;
  startTime: string;
  endTime: string;
  completed: boolean;
}

export default function TabOneScreen() {
  // Mock data - in real app this would come from AI analysis and user data
  const userName = "Alex";
  const timeOfDay = new Date().getHours() < 12 ? "morning" : new Date().getHours() < 17 ? "afternoon" : "evening";

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

  // Quick stats
  const quickStats = {
    streak: { value: 7, label: "Day Streak" },
    focusTime: { value: "2h 30m", label: "Focus Time" },
    completion: { value: "80%", label: "Completion" },
    energy: { value: "High", label: "Energy" }
  };

  // Mock tasks data
  const tasks: Task[] = [
    {
      id: '1',
      title: 'Review Project Proposal',
      category: 'work',
      priority: 'high',
      startTime: '10:00 AM',
      endTime: '2:00 PM',
      completed: false
    },
    {
      id: '2',
      title: 'Gym Session',
      category: 'health',
      priority: 'medium',
      startTime: '4:00 PM',
      endTime: '5:30 PM',
      completed: false
    },
    {
      id: '3',
      title: 'Study React Native',
      category: 'study',
      priority: 'high',
      startTime: '6:00 PM',
      endTime: '8:00 PM',
      completed: false
    },
    {
      id: '4',
      title: 'Movie Night',
      category: 'leisure',
      priority: 'low',
      startTime: '8:30 PM',
      endTime: '11:00 PM',
      completed: false
    }
  ];

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

          {/* Task Input */}
          <View style={styles.inputContainer}>
            <Button 
              mode="outlined" 
              icon="microphone" 
              onPress={() => {}}
              style={styles.inputButton}
              textColor="#000"
            >
              Voice Input
            </Button>
            <Button 
              mode="outlined"
              icon="plus"
              onPress={() => {}}
              style={styles.inputButton}
              textColor="#000"
            >
              Add Task
            </Button>
          </View>

          {/* Task List */}
          <View style={styles.taskList}>
            <Text style={styles.sectionTitle}>Today's Tasks</Text>
            <List.Section>
              {tasks.map((task) => (
                <Link key={task.id} href={`/task-detail/${task.id}`} asChild>
                  <List.Item
                    title={task.title}
                    titleStyle={styles.taskTitle}
                    description={() => (
                      <View style={styles.taskMeta}>
                        <View style={styles.tagContainer}>
                          <View style={[styles.tag, { backgroundColor: `${getCategoryColor(task.category)}15` }]}>
                            <MaterialCommunityIcons 
                              name={getCategoryIcon(task.category)} 
                              size={14} 
                              color={getCategoryColor(task.category)} 
                              style={styles.tagIcon}
                            />
                            <Text style={[styles.tagText, { color: getCategoryColor(task.category) }]}>
                              {task.category.charAt(0).toUpperCase() + task.category.slice(1)}
                            </Text>
                          </View>
                          <View style={[styles.tag, { backgroundColor: `${getPriorityColor(task.priority)}15` }]}>
                            <Text style={[styles.tagText, { color: getPriorityColor(task.priority) }]}>
                              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                            </Text>
                          </View>
                        </View>
                        <View style={styles.timeContainer}>
                          <MaterialCommunityIcons name="clock-outline" size={14} color="#666" />
                          <Text style={styles.timeText}>{task.startTime} - {task.endTime}</Text>
                        </View>
                      </View>
                    )}
                    left={props => (
                      <List.Icon 
                        {...props} 
                        icon={task.completed ? "checkbox-marked-circle" : "checkbox-blank-circle-outline"}
                        color={task.completed ? "#30D158" : "#666"}
                      />
                    )}
                    style={styles.taskItem}
                  />
                </Link>
              ))}
            </List.Section>
          </View>

          {/* Analytics Section */}
          <View style={styles.analyticsContainer}>
            <Text style={styles.sectionTitle}>Analytics Insights</Text>
            
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
                              width: `${(data.timeSpent / 15) * 100}%`,
                              backgroundColor: getCategoryColor(category as Category)
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  surface: {
    padding: 16,
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
});


