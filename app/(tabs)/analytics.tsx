import React, { useState, useEffect, useCallback } from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';
import { Text, Surface, ActivityIndicator } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import api, { ActivityMetrics, WellnessMetrics } from '../services/api';

export default function AnalyticsScreen() {
  const [wellnessMetrics, setWellnessMetrics] = useState<WellnessMetrics | null>(null);
  const [wellnessLoading, setWellnessLoading] = useState(false);
  const [activityMetrics, setActivityMetrics] = useState<ActivityMetrics | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadAnalytics();
      loadWellnessMetrics();
    }, [])
  );

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
      setRefreshing(false);
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
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadAnalytics();
    loadWellnessMetrics();
  }, []);

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

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Surface style={styles.surface} elevation={0}>
          <Text style={styles.pageTitle}>Analytics</Text>
          
          {/* Analytics Section */}
          <View style={styles.analyticsContainer}>
            <Text style={styles.sectionTitle}>Analytics Insights</Text>
            
            {/* Activity Graph */}
            <View style={[styles.analyticsCard, styles.activityCard]}>
              <Text style={styles.analyticsTitle}>Activity Overview</Text>
              
              <View style={styles.activityContainer}>
                {/* Time Period Labels */}
                <View style={styles.timePeriodLabels}>
                  {activityMetrics?.dailyActivity[0]?.timeSlots.map(slot => (
                    <Text key={slot.slot} style={styles.timeLabel}>
                      {slot.slot.split('-')[0]}
                    </Text>
                  ))}
                </View>

                <View style={styles.graphContainer}>
                  {/* Day Labels and Activity Grid */}
                  {activityMetrics?.dailyActivity.slice(-5).map((day, dayIndex) => (
                    <View key={day.date} style={styles.dayRow}>
                      <Text style={styles.dayLabel}>
                        {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                      </Text>
                      <View style={styles.activityRow}>
                        {day.timeSlots.map((slot, timeIndex) => (
                          <View
                            key={timeIndex}
                            style={[
                              styles.activityCell,
                              {
                                backgroundColor: slot.intensity === 0
                                  ? '#E3E3E3'
                                  : slot.intensity <= 0.3
                                    ? '#96E4AB'
                                    : slot.intensity <= 0.7
                                      ? '#63DA82'
                                      : '#30D158'
                            }
                          ]}
                          />
                        ))}
                      </View>
                    </View>
                  ))}
                </View>

                <View style={styles.activityLegend}>
                  <Text style={styles.activityLegendText}>Less</Text>
                  <View style={styles.activityLegendCells}>
                    {['#E3E3E3', '#96E4AB', '#63DA82', '#30D158'].map((color, index) => (
                      <View
                        key={index}
                        style={[styles.activityLegendCell, { backgroundColor: color }]}
                      />
                    ))}
                  </View>
                  <Text style={styles.activityLegendText}>More</Text>
                </View>

                <View style={styles.productivityInsights}>
                  {activityMetrics?.mostProductiveTime && (
                    <View style={styles.productivityInsight}>
                      <MaterialCommunityIcons name="clock-outline" size={20} color="#666" style={styles.insightIcon} />
                      <View style={styles.insightContent}>
                        <Text style={styles.insightLabel}>Most Productive Time</Text>
                        <Text style={styles.insightValue}>
                          {activityMetrics.mostProductiveTime.slot}
                        </Text>
                      </View>
                    </View>
                  )}
                  {activityMetrics?.mostProductiveDay && (
                    <View style={styles.productivityInsight}>
                      <MaterialCommunityIcons name="calendar" size={20} color="#666" style={styles.insightIcon} />
                      <View style={styles.insightContent}>
                        <Text style={styles.insightLabel}>Most Productive Day</Text>
                        <Text style={styles.insightValue}>
                          {activityMetrics.mostProductiveDay.day} 
                        </Text>
                      </View>
                    </View>
                  )}
                </View>

                {analyticsLoading ? (
                  <ActivityIndicator style={{ marginTop: 16 }} />
                ) : (
                  <View style={styles.activityStats}>
                    <View style={styles.activityStat}>
                      <Text style={styles.activityStatValue}>
                        {activityMetrics?.dailyActivity.reduce((sum, day) => 
                          sum + day.timeSlots.reduce((s, slot) => s + slot.completedCount, 0), 0) ?? 0}
                      </Text>
                      <Text style={styles.activityStatLabel}>Tasks Completed</Text>
                    </View>
                    <View style={styles.activityStat}>
                      <Text style={styles.activityStatValue}>
                        {activityMetrics?.dailyActivity.reduce((sum, day) => 
                          sum + day.timeSlots.reduce((s, slot) => s + slot.tasksCount, 0), 0) ?? 0}
                      </Text>
                      <Text style={styles.activityStatLabel}>Total Tasks</Text>
                    </View>
                    <View style={styles.activityStat}>
                      <Text style={styles.activityStatValue}>
                        {(() => {
                          if (!activityMetrics) return '0%';
                          const totalTasks = activityMetrics.dailyActivity.reduce((sum, day) => 
                            sum + day.timeSlots.reduce((s, slot) => s + slot.tasksCount, 0), 0);
                          if (totalTasks === 0) return '0%';
                          const completedTasks = activityMetrics.dailyActivity.reduce((sum, day) => 
                            sum + day.timeSlots.reduce((s, slot) => s + slot.completedCount, 0), 0);
                          return `${Math.round((completedTasks / totalTasks) * 100)}%`;
                        })()}
                      </Text>
                      <Text style={styles.activityStatLabel}>Completion Rate</Text>
                    </View>
                  </View>
                )}
              </View>
            </View>

            {/* Wellness & Balance Analytics */}
            <View style={styles.analyticsCard}>
              <Text style={styles.analyticsTitle}>Wellness & Balance</Text>
              <View style={styles.wellnessContainer}>
                {wellnessLoading ? (
                  <ActivityIndicator style={{ marginVertical: 16 }} />
                ) : wellnessMetrics ? (
                  <>
                    {/* Stress Level Indicator */}
                    <View style={[styles.wellnessMetric, styles.metricCard]}>
                      <View style={styles.wellnessHeader}>
                        <MaterialCommunityIcons name="brain" size={20} color="#6366F1" />
                        <Text style={styles.wellnessTitle}>Stress Level</Text>
                      </View>
                      <View style={styles.stressIndicator}>
                        <View style={styles.stressBarContainer}>
                          <View style={[styles.stressBar, { 
                            width: `${wellnessMetrics.stressLevel.current}%`, 
                            backgroundColor: wellnessMetrics.stressLevel.current > 70 ? '#EF4444' : 
                                          wellnessMetrics.stressLevel.current > 40 ? '#F59E0B' : '#6366F1' 
                          }]} />
                        </View>
                        <Text style={[styles.stressLabel, { 
                          color: wellnessMetrics.stressLevel.current > 70 ? '#EF4444' : 
                                wellnessMetrics.stressLevel.current > 40 ? '#F59E0B' : '#6366F1' 
                        }]}>
                          {wellnessMetrics.stressLevel.current > 70 ? 'High' : 
                           wellnessMetrics.stressLevel.current > 40 ? 'Medium' : 'Low'}
                        </Text>
                      </View>
                      <Text style={styles.wellnessSubtext}>
                        Trend: {wellnessMetrics.stressLevel.trend === 'increasing' ? '↗️ Rising' :
                               wellnessMetrics.stressLevel.trend === 'decreasing' ? '↘️ Falling' : '→ Stable'}
                      </Text>
                    </View>

                    {/* Work-Life Balance */}
                    <View style={[styles.wellnessMetric, styles.metricCard]}>
                      <View style={styles.wellnessHeader}>
                        <MaterialCommunityIcons name="chart-pie" size={20} color="#EC4899" />
                        <Text style={styles.wellnessTitle}>Work-Life Balance</Text>
                      </View>
                      <View style={styles.balanceDistribution}>
                        <View style={[styles.balanceItem, { backgroundColor: '#EC489915' }]}>
                          <Text style={[styles.balanceValue, { color: '#EC4899' }]}>
                            {wellnessMetrics.workLifeBalance.workPercentage}%
                          </Text>
                          <Text style={styles.balanceLabel}>Work</Text>
                        </View>
                        <View style={[styles.balanceItem, { backgroundColor: '#8B5CF615' }]}>
                          <Text style={[styles.balanceValue, { color: '#8B5CF6' }]}>
                            {Math.round((100 - wellnessMetrics.workLifeBalance.workPercentage) / 2)}%
                          </Text>
                          <Text style={styles.balanceLabel}>Personal</Text>
                        </View>
                        <View style={[styles.balanceItem, { backgroundColor: '#10B98115' }]}>
                          <Text style={[styles.balanceValue, { color: '#10B981' }]}>
                            {Math.round((100 - wellnessMetrics.workLifeBalance.workPercentage) / 2)}%
                          </Text>
                          <Text style={styles.balanceLabel}>Health</Text>
                        </View>
                      </View>
                    </View>

                    {/* Break Compliance */}
                    <View style={[styles.wellnessMetric, styles.metricCard]}>
                      <View style={styles.wellnessHeader}>
                        <MaterialCommunityIcons name="coffee" size={20} color="#F59E0B" />
                        <Text style={styles.wellnessTitle}>Break Compliance</Text>
                      </View>
                      <View style={styles.breakProgress}>
                        <Text style={styles.breakStats}>
                          <Text style={[styles.breakHighlight, { color: '#F59E0B' }]}>
                            {wellnessMetrics.breakCompliance.breaksTaken}/{wellnessMetrics.breakCompliance.breaksPlanned}
                          </Text>
                          <Text> suggested breaks taken</Text>
                        </Text>
                        <View style={styles.breakBar}>
                          {[...Array(wellnessMetrics.breakCompliance.breaksPlanned)].map((_, index) => (
                            <View
                              key={index}
                              style={[
                                styles.breakDot,
                                { backgroundColor: index < wellnessMetrics.breakCompliance.breaksTaken ? '#F59E0B' : '#F59E0B30' }
                              ]}
                            />
                          ))}
                        </View>
                      </View>
                      <Text style={styles.wellnessSubtext}>
                        Average break duration: {wellnessMetrics.breakCompliance.averageDuration} minutes
                      </Text>
                    </View>
                  </>
                ) : (
                  <Text style={styles.emptyText}>Unable to load wellness metrics</Text>
                )}
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
  pageTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 16,
    marginTop: 16,
  },
  analyticsContainer: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
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
  insightText: {
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
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 24,
  },
}); 