import OpenAI from 'openai';
import { Task } from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';

// Cache keys
const SMART_CONTEXT_CACHE_KEY = 'smartContext';
const SMART_CONTEXT_TIMESTAMP_KEY = 'smartContextTimestamp';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

// Types for the smart context
export interface SmartContext {
  weather: {
    icon: string;
    temp: string;
    condition: string;
  };
  urgentTasks: {
    count: number;
    nextDue: string;
  };
  focusStatus: {
    state: string;
    timeLeft: string;
  };
  energyLevel: string;
  suggestedActivity: string;
  nextBreak: string;
  insight: string;
  timestamp: string;
  lastUpdated: string;
}

interface LLMResponse {
  weather: SmartContext['weather'];
  urgentTasks: SmartContext['urgentTasks'];
  focusStatus: SmartContext['focusStatus'];
  energyLevel: string;
  suggestedActivity: string;
  nextBreak: string;
  insight: string;
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
    return now - lastUpdate < CACHE_DURATION;
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

    console.log('[SmartContext] Generating new context with:', {
      tasksCount: tasks.length,
      analyticsDataPresent: !!analyticsData,
      weatherDataPresent: !!weatherData,
    });

    const now = new Date();
    const currentTime = format(now, 'HH:mm');
    const currentDate = format(now, 'yyyy-MM-dd');
    const dayOfWeek = format(now, 'EEEE');
    const timeOfDay = now.getHours() < 12 ? 'morning' : now.getHours() < 17 ? 'afternoon' : 'evening';

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
    };

    console.log('[SmartContext] Sending prompt to LLM...');

    // Create the prompt for the LLM
    const prompt = `As an AI task assistant, analyze the following context and generate a smart, personalized summary:

Current Time: ${context.currentTime}
Current Date: ${context.currentDate}
Day of Week: ${context.dayOfWeek}
Time of Day: ${context.timeOfDay}

Tasks: ${JSON.stringify(context.tasks, null, 2)}

Analytics: ${JSON.stringify(context.analytics, null, 2)}

Weather: ${JSON.stringify(context.weather, null, 2)}

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
    "state": "current focus state based on time and analytics",
    "timeLeft": "time until next break or task"
  },
  "energyLevel": "predicted energy level (high/medium/low) based on time and analytics",
  "suggestedActivity": "recommended task type based on energy, time, and weather",
  "nextBreak": "suggested next break time based on current schedule",
  "insight": "one personalized productivity insight based on time, day, and analytics"
}`;

    // Call the OpenAI API using the SDK
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful AI task assistant that provides smart context for task management.',
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

    console.log('[SmartContext] Raw LLM Response:', completion.choices[0].message.content);

    // Parse and validate the LLM response
    const llmResponse: LLMResponse = JSON.parse(completion.choices[0].message.content || '{}');

    // Create the final context with timestamps
    const smartContext: SmartContext = {
      ...llmResponse,
      timestamp: now.toISOString(),
      lastUpdated: format(now, 'HH:mm'),
    };

    console.log('[SmartContext] Final Context:', {
      weatherInfo: smartContext.weather,
      urgentTasksCount: smartContext.urgentTasks.count,
      focusState: smartContext.focusStatus.state,
      energyLevel: smartContext.energyLevel,
      suggestedActivity: smartContext.suggestedActivity,
      insight: smartContext.insight,
      lastUpdated: smartContext.lastUpdated,
    });

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
    
    // Return a fallback context if the API call fails
    const fallbackContext: SmartContext = {
      weather: { icon: "🌤️", temp: "N/A", condition: "Unable to fetch weather" },
      urgentTasks: { count: tasks.filter(t => t.priority === 'high' && !t.completed).length, nextDue: "N/A" },
      focusStatus: { state: "Normal", timeLeft: "N/A" },
      energyLevel: "medium",
      suggestedActivity: "Continue with your planned tasks",
      nextBreak: "In 1 hour",
      insight: "Unable to generate personalized insight at the moment",
      timestamp: new Date().toISOString(),
      lastUpdated: format(new Date(), 'HH:mm'),
    };

    console.log('[SmartContext] Using fallback context:', fallbackContext);
    return fallbackContext;
  }
}; 