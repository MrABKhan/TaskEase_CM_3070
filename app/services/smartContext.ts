import OpenAI from 'openai';
import { Task } from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format, isWeekend, isBefore, addHours } from 'date-fns';
import { getCurrentLocation, LocationData } from './locationService';
import { getCurrentWeather, WeatherData } from './weatherService';

// Configuration
export const CONFIG = {
  ENABLE_OPENAI: false, // Switch to enable/disable OpenAI API calls
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes in milliseconds
};

// Initialize CONFIG from AsyncStorage
export const initializeConfig = async () => {
  try {
    const storedEnableOpenAI = await AsyncStorage.getItem('ENABLE_OPENAI');
    const storedCacheDuration = await AsyncStorage.getItem('CACHE_DURATION');

    if (storedEnableOpenAI !== null) {
      CONFIG.ENABLE_OPENAI = storedEnableOpenAI === 'true';
    }
    if (storedCacheDuration !== null) {
      CONFIG.CACHE_DURATION = parseInt(storedCacheDuration, 10);
    }
  } catch (error) {
    console.error('[SmartContext] Error initializing config:', error);
  }
};

// Cache keys
const SMART_CONTEXT_CACHE_KEY = 'smartContext';
const SMART_CONTEXT_TIMESTAMP_KEY = 'smartContextTimestamp';

// Types for the smart context
export interface SmartContext {
  weather: WeatherData;
  urgentTasks: {
    count: number;
    nextDue: string;
  };
  focusStatus: {
    state: string;
    timeLeft: string;
    details: string; // Detailed focus information
    recommendation: string; // Specific focus recommendation
    priority: string; // Priority level for focus (high/medium/low)
  };
  energyLevel: string;
  suggestedActivity: string;
  nextBreak: string;
  insight: string;
  timestamp: string;
  lastUpdated: string;
  location?: LocationData;
  weatherImpact: {
    outdoorSuitability: string;
    healthConsiderations: string;
    travelConsiderations: string;
  };
  locationContext: {
    areaType: 'urban' | 'suburban' | 'rural';
    transportRecommendation: string;
    localTimeContext: string;
  };
}

interface LLMResponse {
  weather: SmartContext['weather'];
  urgentTasks: SmartContext['urgentTasks'];
  focusStatus: SmartContext['focusStatus'];
  energyLevel: string;
  suggestedActivity: string;
  nextBreak: string;
  insight: string;
  weatherImpact: SmartContext['weatherImpact'];
  locationContext: SmartContext['locationContext'];
}

// Initialize OpenAI client with fetch configuration for React Native
const openai = new OpenAI({
  apiKey: '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',
  dangerouslyAllowBrowser: true,
  defaultHeaders: { 'Content-Type': 'application/json' },
  defaultQuery: undefined,
  fetch: fetch.bind(globalThis),
});

// Function to check if cache is valid
const isCacheValid = async (): Promise<boolean> => {
  try {
    const timestamp = await AsyncStorage.getItem(SMART_CONTEXT_TIMESTAMP_KEY);
    if (!timestamp) return false;

    const lastUpdate = new Date(timestamp).getTime();
    const now = new Date().getTime();
    return now - lastUpdate < CONFIG.CACHE_DURATION;
  } catch (error) {
    console.error('[SmartContext] Error checking cache validity:', error);
    return false;
  }
};

// Function to get cached context
const getCachedContext = async (): Promise<SmartContext | null> => {
  try {
    const cachedData = await AsyncStorage.getItem(SMART_CONTEXT_CACHE_KEY);
    if (!cachedData) return null;
    return JSON.parse(cachedData);
  } catch (error) {
    console.error('[SmartContext] Error getting cached context:', error);
    return null;
  }
};

// Function to cache context
const cacheContext = async (context: SmartContext): Promise<void> => {
  try {
    await AsyncStorage.setItem(SMART_CONTEXT_CACHE_KEY, JSON.stringify(context));
    await AsyncStorage.setItem(SMART_CONTEXT_TIMESTAMP_KEY, new Date().toISOString());
  } catch (error) {
    console.error('[SmartContext] Error caching context:', error);
  }
};

const parseTimeString = (timeStr: string): string => {
  // If already in 24-hour format
  if (/^\d{2}:\d{2}$/.test(timeStr)) {
    return timeStr;
  }
  
  // Handle "HH:mm AM/PM" format
  const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (match) {
    let [_, hours, minutes, period] = match;
    let hour = parseInt(hours);
    
    // Convert to 24-hour format
    if (period.toLowerCase() === 'pm' && hour < 12) hour += 12;
    if (period.toLowerCase() === 'am' && hour === 12) hour = 0;
    
    return `${hour.toString().padStart(2, '0')}:${minutes}`;
  }
  
  // Return a default value if the format is not recognized
  console.warn(`[SmartContext] Invalid time format: ${timeStr}`);
  return '00:00';
};

const safeParseDate = (date: string | Date, time: string): Date => {
  try {
    let dateObj: Date;
    
    // Handle the date part
    if (date instanceof Date) {
      dateObj = date;
    } else if (date.includes('T')) {
      // If it's an ISO string, parse it and reset the time
      dateObj = new Date(date);
      dateObj.setHours(0, 0, 0, 0);
    } else {
      // If it's just a date string
      dateObj = new Date(date);
    }

    // Validate the date
    if (isNaN(dateObj.getTime())) {
      throw new Error('Invalid date');
    }

    // Parse and add the time
    const [hours, minutes] = parseTimeString(time).split(':').map(Number);
    dateObj.setHours(hours, minutes, 0, 0);

    return dateObj;
  } catch (error) {
    console.warn(`[SmartContext] Error parsing date/time: ${date} ${time}`, error);
    return new Date(); // Return current date as fallback
  }
};

// Helper function to format time consistently
const formatTime = (date: Date): string => {
  try {
    return format(date, 'HH:mm');
  } catch (error) {
    console.warn('[SmartContext] Error formatting time:', error);
    return 'N/A';
  }
};

// Function to generate static smart context based on tasks
const generateStaticSmartContext = async (
  tasks: Task[],
): Promise<SmartContext> => {
  const now = new Date();
  const currentHour = now.getHours();
  
  // Get location data
  const locationData = await getCurrentLocation();
  
  // Get weather data if location is available
  let weatherData: WeatherData = {
    icon: '⚠️',
    temp: 'N/A',
    condition: 'Weather unavailable'
  };

  if (locationData) {
    weatherData = await getCurrentWeather(locationData);
  }
  
  // Filter urgent and incomplete tasks - consider both high priority and timing
  const urgentTasks = tasks.filter(t => {
    if (t.completed) return false;
    
    try {
      // Check if task is high priority or if it's due within 24 hours
      const taskDateTime = safeParseDate(t.date, t.startTime);
      const isUrgentByTime = isBefore(taskDateTime, addHours(now, 24));
      return t.priority === 'high' || isUrgentByTime;
    } catch (error) {
      console.warn(`[SmartContext] Error processing task: ${t.title}`);
      return false;
    }
  });

  // Sort urgent tasks by start time
  urgentTasks.sort((a, b) => {
    try {
      const aDate = safeParseDate(a.date, a.startTime);
      const bDate = safeParseDate(b.date, b.startTime);
      return aDate.getTime() - bDate.getTime();
    } catch (error) {
      return 0;
    }
  });

  // Determine energy level based on time of day and any provided analytics
  let energyLevel = 'medium';
  if (currentHour >= 9 && currentHour <= 11) energyLevel = 'high';
  else if (currentHour >= 14 && currentHour <= 16) energyLevel = 'medium';
  else if (currentHour >= 21 || currentHour <= 6) energyLevel = 'low';

  // Determine focus state based on time and tasks
  let focusState = 'Normal';
  if (currentHour >= 9 && currentHour <= 12) focusState = 'Peak Focus Time';
  else if (currentHour >= 14 && currentHour <= 17) focusState = 'Productive';
  else if (currentHour >= 22 || currentHour <= 6) focusState = 'Rest';

  // Generate focus details and recommendations
  let focusDetails = 'Maintain regular work patterns';
  let focusRecommendation = 'Follow your usual task schedule';
  let focusPriority = 'medium';

  if (focusState === 'Peak Focus Time') {
    focusDetails = 'Take advantage of your natural rhythm - your mind is clear and ready for meaningful work. This is your time to shine and make progress on what matters most to you.';
    focusRecommendation = 'Consider starting with your most important task while your energy is high. Remember to take short breaks to maintain this great momentum.';
    focusPriority = 'high';
  } else if (focusState === 'Productive') {
    focusDetails = 'You\'re in a steady flow, with good energy for balanced work. This is a great time to collaborate and make progress on your ongoing projects.';
    focusRecommendation = 'Mix focused work with collaborative tasks to keep your energy flowing. Stay hydrated and take brief stretches to maintain your rhythm.';
    focusPriority = 'medium';
  } else if (focusState === 'Rest') {
    focusDetails = 'Listen to your body\'s natural rhythm - this is your time to recharge and reflect. Quality rest now will set you up for success tomorrow.';
    focusRecommendation = 'Focus on light, enjoyable tasks that don\'t require heavy mental lifting. Consider preparing for tomorrow to start fresh.';
    focusPriority = 'low';
  }

  // Get next task start time for any incomplete task
  const upcomingTasks = tasks
    .filter(t => {
      if (t.completed) return false;
      try {
        const taskDate = safeParseDate(t.date, t.startTime);
        return isBefore(now, taskDate);
      } catch (error) {
        return false;
      }
    })
    .sort((a, b) => {
      try {
        const aDate = safeParseDate(a.date, a.startTime);
        const bDate = safeParseDate(b.date, b.startTime);
        return aDate.getTime() - bDate.getTime();
      } catch (error) {
        return 0;
      }
    });

  // Generate suggested activity based on time, day, and task priority
  let suggestedActivity = 'Focus on high-priority tasks';
  if (isWeekend(now)) {
    if (urgentTasks.length > 0) {
      suggestedActivity = 'Handle urgent tasks first, then enjoy your weekend';
    } else {
      suggestedActivity = currentHour < 12 ? 'Plan your weekend activities' : 'Enjoy some leisure time';
    }
  } else if (currentHour < 12) {
    suggestedActivity = 'Handle important tasks while energy is high';
  } else if (currentHour >= 14 && currentHour <= 17) {
    suggestedActivity = 'Work on creative or collaborative tasks';
  }

  // Generate insight based on task patterns and completion
  let insight = 'Keep up with your regular schedule';
  const completedTasks = tasks.filter(t => t.completed);
  if (completedTasks.length > 0) {
    const categories = completedTasks.map(t => t.category);
    const categoryCount = categories.reduce((acc, curr) => {
      acc[curr] = (acc[curr] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const mostCommonCategory = Object.entries(categoryCount)
      .sort(([,a], [,b]) => b - a)[0][0];
    
    insight = `You're most productive with ${mostCommonCategory} tasks`;
  }

  // Generate weather impact assessment
  const weatherImpact = {
    outdoorSuitability: weatherData.condition === 'Weather unavailable' 
      ? 'Unable to assess outdoor conditions'
      : getOutdoorSuitability(weatherData),
    healthConsiderations: getHealthConsiderations(weatherData),
    travelConsiderations: getTravelConsiderations(weatherData)
  };

  // Generate location context
  const locationContext = {
    areaType: determineAreaType(locationData || undefined),
    transportRecommendation: getTransportRecommendation(locationData || undefined, weatherData),
    localTimeContext: getLocalTimeContext(now, locationData || undefined)
  };

  // Adjust suggested activity based on weather and location
  suggestedActivity = adjustActivityForWeather(suggestedActivity, weatherData, locationData || undefined);

  return {
    weather: weatherData,
    urgentTasks: {
      count: urgentTasks.length,
      nextDue: urgentTasks.length > 0 
        ? formatTime(safeParseDate(urgentTasks[0].date, urgentTasks[0].startTime))
        : 'None'
    },
    focusStatus: {
      state: focusState,
      timeLeft: upcomingTasks.length > 0
        ? `Until ${formatTime(safeParseDate(upcomingTasks[0].date, upcomingTasks[0].startTime))}`
        : 'No upcoming tasks',
      details: focusDetails,
      recommendation: focusRecommendation,
      priority: focusPriority
    },
    energyLevel,
    suggestedActivity,
    nextBreak: currentHour % 2 === 0 ? 'In 30 minutes' : 'In 1 hour',
    insight,
    timestamp: now.toISOString(),
    lastUpdated: format(now, 'HH:mm'),
    weatherImpact,
    locationContext
  };
};

// Helper function to get weather icon
const getWeatherIcon = (condition: string): string => {
  if (!condition) return '⚠️'; // Red warning icon for unavailable data
  const conditionLower = condition.toLowerCase();
  if (conditionLower.includes('rain')) return '🌧️';
  if (conditionLower.includes('cloud')) return '☁️';
  if (conditionLower.includes('sun') || conditionLower.includes('clear')) return '☀️';
  if (conditionLower.includes('snow')) return '❄️';
  if (conditionLower.includes('storm')) return '⛈️';
  return '🌤️';
};

// Function to generate context using OpenAI
const generateOpenAIContext = async (
  tasks: Task[],
  analyticsData: any,
  currentWeather: any
): Promise<SmartContext> => {
  const now = new Date();
  const currentTime = format(now, 'HH:mm');
  const currentDate = format(now, 'yyyy-MM-dd');
  const dayOfWeek = format(now, 'EEEE');
  const timeOfDay = now.getHours() < 12 ? 'morning' : now.getHours() < 17 ? 'afternoon' : 'evening';

  // Get location data
  const locationData = await getCurrentLocation();
  
  // Get weather data if location is available
  let weatherData: WeatherData = {
    icon: '⚠️',
    temp: 'N/A',
    condition: 'Weather unavailable'
  };

  if (locationData) {
    weatherData = await getCurrentWeather(locationData);
  }

  // Generate weather impact assessment
  const weatherImpact = {
    outdoorSuitability: weatherData.condition === 'Weather unavailable' 
      ? 'Unable to assess outdoor conditions'
      : getOutdoorSuitability(weatherData),
    healthConsiderations: getHealthConsiderations(weatherData),
    travelConsiderations: getTravelConsiderations(weatherData)
  };

  // Generate location context
  const locationContext = {
    areaType: determineAreaType(locationData || undefined),
    transportRecommendation: getTransportRecommendation(locationData || undefined, weatherData),
    localTimeContext: getLocalTimeContext(now, locationData || undefined)
  };

  // Prepare the context data for the LLM
  const context = {
    currentTime,
    currentDate,
    dayOfWeek,
    timeOfDay,
    tasks: tasks.map(task => ({
      title: task.title,
      priority: task.priority,
      category: task.category,
      startTime: task.startTime,
      endTime: task.endTime,
      completed: task.completed,
    })),
    analytics: analyticsData,
    weather: weatherData,
    location: locationData || undefined,
    weatherImpact,
    locationContext
  };

  console.log('[SmartContext] Sending prompt to LLM...');

  // Create the prompt for the LLM
  const prompt = `As an AI task assistant, analyze the following context and generate a smart, personalized summary that considers tasks, patterns, and environmental factors:

Current Time: ${context.currentTime}
Current Date: ${context.currentDate}
Day of Week: ${context.dayOfWeek}
Time of Day: ${context.timeOfDay}

Tasks: ${JSON.stringify(context.tasks, null, 2)}

Analytics: ${JSON.stringify(context.analytics, null, 2)}

Weather: ${JSON.stringify(context.weather, null, 2)}

Location: ${JSON.stringify(context.location, null, 2)}

Consider these factors in your analysis:
1. Task Analysis:
   - Review completed and upcoming tasks
   - Identify patterns in task completion
   - Consider task categories and priorities
   - Look for optimal timing based on user history

2. Focus Optimization:
   - Create a personal, inspirational message about the day and week ahead
   - Consider the user's current state, tasks, and challenges
   - Frame recommendations in a supportive, encouraging way
   - Balance ambition with well-being

3. Smart Recommendations:
   - Provide specific, actionable focus strategies
   - Suggest task grouping or reordering
   - Consider breaks and energy management
   - Account for location and weather impact

4. Personalization:
   - Write the focus status details as a personal quote or message
   - Make it feel like advice from a supportive friend
   - Acknowledge both achievements and upcoming challenges
   - Keep the tone warm and encouraging

Generate a response in the following JSON format:
{
  "weather": {
    "icon": "emoji representing current weather",
    "temp": "temperature with degree symbol",
    "condition": "brief weather description"
  },
  "urgentTasks": {
    "count": number of high priority incomplete tasks,
    "nextDue": "time of next urgent task"
  },
  "focusStatus": {
    "state": "current focus state based on task patterns and completion rates",
    "timeLeft": "time until next significant task or break",
    "details": "A personal, inspirational message about today and the week ahead, written like a supportive quote (2-3 sentences)",
    "recommendation": "gentle, actionable guidance framed as friendly advice (2-3 sentences)",
    "priority": "priority level for focus (high/medium/low)"
  },
  "energyLevel": "predicted energy level based on time and task patterns",
  "suggestedActivity": "specific task or category to focus on now",
  "nextBreak": "suggested next break time based on task load",
  "insight": "personalized insight based on task patterns and current context",
  "weatherImpact": {
    "outdoorSuitability": "brief assessment of outdoor activity suitability",
    "healthConsiderations": "relevant health advice based on weather",
    "travelConsiderations": "how weather affects travel/commute"
  },
  "locationContext": {
    "areaType": "urban/suburban/rural",
    "transportRecommendation": "suggested transport method",
    "localTimeContext": "relevant local timing considerations"
  }
}`;

  // Call the OpenAI API using the SDK
  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: 'You are a mindful and empathetic AI companion focused on personal well-being and balanced productivity. When analyzing tasks and providing focus recommendations, maintain a calm and supportive tone. Consider the user\'s energy levels, task load, and environmental factors to offer gentle guidance. Your insights should feel like a friendly conversation, acknowledging both achievements and challenges. Use emojis thoughtfully to convey warmth and encouragement. Focus on sustainable productivity that prioritizes well-being over pure efficiency. Provide specific yet nurturing insights based on task patterns and optimal timing, while being mindful of potential stress factors.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.7,
    max_tokens: 1000,
    response_format: { type: "json_object" },
  });

  // Parse and validate the LLM response
  const llmResponse: LLMResponse = JSON.parse(completion.choices[0].message.content || '{}');

  // Create the final context with timestamps and location
  return {
    ...llmResponse,
    timestamp: now.toISOString(),
    lastUpdated: format(now, 'HH:mm'),
    weather: weatherData,
    weatherImpact,
    locationContext,
    ...(locationData && { location: locationData })
  };
};

export const generateSmartContext = async (
  tasks: Task[],
  analyticsData: any,
  weatherData: any,
  forceRefresh: boolean = false
): Promise<SmartContext> => {
  try {
    // Check cache first if not forcing refresh
    if (!forceRefresh) {
      const isValid = await isCacheValid();
      if (isValid) {
        const cachedContext = await getCachedContext();
        if (cachedContext) {
          console.log('[SmartContext] Using cached context');
          return cachedContext;
        }
      }
    }

    let smartContext: SmartContext;

    // Use OpenAI if enabled, otherwise use static generation
    if (CONFIG.ENABLE_OPENAI) {
      console.log('[SmartContext] Using OpenAI for context generation');
      smartContext = await generateOpenAIContext(tasks, analyticsData, weatherData);
    } else {
      console.log('[SmartContext] Using static context generation');
      smartContext = await generateStaticSmartContext(tasks);
    }

    // Cache the new context
    await cacheContext(smartContext);

    return smartContext;
  } catch (error) {
    console.error('[SmartContext] Error generating context:', error);
    if (error instanceof Error) {
      console.error('[SmartContext] Error details:', {
        message: error.message,
        stack: error.stack,
      });
    }
    
    // Return static context as fallback
    return generateStaticSmartContext(tasks);
  }
};

// Helper functions for static context generation
const getOutdoorSuitability = (weather: WeatherData): string => {
  if (weather.condition === 'Weather unavailable') return 'Unable to assess';
  
  const temp = parseInt(weather.temp);
  if (isNaN(temp)) return 'Temperature data unavailable';
  
  if (temp < 0) return 'Too cold for outdoor activities';
  if (temp > 35) return 'Too hot for outdoor activities';
  if (weather.condition.toLowerCase().includes('rain')) return 'Not suitable for outdoor activities due to rain';
  if (weather.condition.toLowerCase().includes('storm')) return 'Outdoor activities not recommended due to storm';
  
  return 'Suitable for outdoor activities';
};

const getHealthConsiderations = (weather: WeatherData): string => {
  if (weather.condition === 'Weather unavailable') return 'No specific health considerations available';
  
  const temp = parseInt(weather.temp);
  if (isNaN(temp)) return 'Stay hydrated and dress appropriately';
  
  if (temp > 30) return 'Stay hydrated and protect from sun exposure';
  if (temp < 5) return 'Dress warmly and protect from cold';
  if (weather.condition.toLowerCase().includes('rain')) return 'Bring rain protection';
  
  return 'Normal conditions - maintain regular health practices';
};

const getTravelConsiderations = (weather: WeatherData): string => {
  if (weather.condition === 'Weather unavailable') return 'Check local conditions before travel';
  
  if (weather.condition.toLowerCase().includes('rain')) return 'Allow extra time for travel due to rain';
  if (weather.condition.toLowerCase().includes('storm')) return 'Consider postponing non-essential travel';
  if (weather.condition.toLowerCase().includes('snow')) return 'Check road conditions before travel';
  
  return 'Normal travel conditions';
};

const determineAreaType = (location?: LocationData): 'urban' | 'suburban' | 'rural' => {
  if (!location) return 'urban'; // Default to urban if no location data
  
  // This is a simple heuristic - in a real app, you'd use more sophisticated geo data
  if (location.city) return 'urban';
  return 'rural';
};

const getTransportRecommendation = (location?: LocationData, weather?: WeatherData): string => {
  if (!location) return 'Unable to provide transport recommendations';
  
  const areaType = determineAreaType(location);
  const badWeather = weather?.condition.toLowerCase().includes('rain') || 
                     weather?.condition.toLowerCase().includes('storm') ||
                     weather?.condition.toLowerCase().includes('snow');
  
  if (areaType === 'urban' && !badWeather) return 'Consider public transport or walking';
  if (areaType === 'urban' && badWeather) return 'Use public transport or ride-sharing';
  return 'Personal vehicle recommended';
};

const getLocalTimeContext = (now: Date, location?: LocationData): string => {
  if (!location) return 'Check local business hours';
  
  const hour = now.getHours();
  if (hour < 9 || hour > 17) return 'Outside standard business hours';
  if (hour < 12) return 'Morning business hours';
  return 'Afternoon business hours';
};

const adjustActivityForWeather = (
  activity: string,
  weather: WeatherData,
  location?: LocationData
): string => {
  if (weather.condition === 'Weather unavailable') return activity;
  
  const isOutdoorActivity = activity.toLowerCase().includes('outdoor') ||
                           activity.toLowerCase().includes('walk') ||
                           activity.toLowerCase().includes('exercise');
  
  if (isOutdoorActivity) {
    if (weather.condition.toLowerCase().includes('rain')) {
      return 'Consider indoor alternatives: ' + activity;
    }
    if (weather.condition.toLowerCase().includes('storm')) {
      return 'Move outdoor activities indoors due to weather';
    }
  }
  
  return activity;
}; 