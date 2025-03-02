import OpenAI from 'openai';
import { Task } from './api';
import { format, addHours, parse, isValid } from 'date-fns';

// Initialize OpenAI client with fetch configuration for React Native
const openai = new OpenAI({
  apiKey: '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',
  dangerouslyAllowBrowser: true,
  defaultHeaders: { 'Content-Type': 'application/json' },
  defaultQuery: undefined,
  fetch: fetch.bind(globalThis),
});

// Configuration
const CONFIG = {
  ENABLE_OPENAI: true, // Switch to enable/disable OpenAI API calls
  FALLBACK_TITLE: 'New Task',
  DEFAULT_CATEGORY: 'work',
  DEFAULT_PRIORITY: 'medium',
};

export interface ParsedTaskData {
  title: string;
  description: string;
  category: 'work' | 'health' | 'study' | 'leisure' | 'shopping' | 'family';
  priority: 'high' | 'medium' | 'low';
  date: Date;
  startTime: string;
  endTime: string;
  isAiGenerated: boolean;
  error?: string;
}

// Function to parse natural language into task data using OpenAI
export const parseTaskFromText = async (text: string): Promise<ParsedTaskData> => {
  try {
    console.log('[TaskParsingService] Parsing task from text:', text);

    if (!text || text.trim() === '') {
      return {
        error: 'No text provided for task creation',
        title: CONFIG.FALLBACK_TITLE,
        description: '',
        category: CONFIG.DEFAULT_CATEGORY,
        priority: CONFIG.DEFAULT_PRIORITY,
        date: new Date(),
        startTime: format(new Date(), 'HH:mm'),
        endTime: format(addHours(new Date(), 1), 'HH:mm'),
        isAiGenerated: true,
      };
    }

    // If OpenAI is disabled, use basic parsing
    if (!CONFIG.ENABLE_OPENAI) {
      return basicTaskParsing(text);
    }

    // Get today's date in YYYY-MM-DD format
    const today = format(new Date(), 'yyyy-MM-dd');
    const currentTime = format(new Date(), 'HH:mm');

    // Create the prompt for OpenAI
    const prompt = `Parse the following text into a task with these attributes:
- title: A clear, concise title for the task
- description: Any additional details about the task
- category: One of [work, health, study, leisure, shopping, family]
- priority: One of [high, medium, low]
- date: The date for the task in YYYY-MM-DD format (default to today: ${today} if not specified)
- startTime: The start time in 24-hour format HH:MM (default to current time: ${currentTime} if not specified)
- endTime: The end time in 24-hour format HH:MM (default to start time + 1 hour if not specified)

Text to parse: "${text}"

Respond with a JSON object containing these fields. If any field cannot be determined, use reasonable defaults.`;

    // Call the OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that parses natural language into structured task data.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 500,
      response_format: { type: "json_object" },
    });

    // Parse the response
    const responseContent = completion.choices[0].message.content;
    if (!responseContent) {
      throw new Error('Empty response from OpenAI');
    }

    const parsedResponse = JSON.parse(responseContent);
    console.log('[TaskParsingService] OpenAI response:', parsedResponse);

    // Validate and format the response
    const result = validateAndFormatTaskData(parsedResponse);
    console.log('[TaskParsingService] Validated task data:', result);
    
    // Mark as AI generated
    result.isAiGenerated = true;
    
    return result;
  } catch (error) {
    console.error('[TaskParsingService] Error parsing task:', error);
    
    // Fallback to basic parsing on error
    try {
      return basicTaskParsing(text);
    } catch (fallbackError) {
      console.error('[TaskParsingService] Fallback parsing failed:', fallbackError);
      
      // Return default values with error message
      return {
        error: error instanceof Error ? error.message : 'Unknown error parsing task',
        title: text.length > 30 ? text.substring(0, 27) + '...' : text || CONFIG.FALLBACK_TITLE,
        description: '',
        category: CONFIG.DEFAULT_CATEGORY,
        priority: CONFIG.DEFAULT_PRIORITY,
        date: new Date(),
        startTime: format(new Date(), 'HH:mm'),
        endTime: format(addHours(new Date(), 1), 'HH:mm'),
        isAiGenerated: true,
      };
    }
  }
};

// Basic parsing function for when OpenAI is disabled or fails
const basicTaskParsing = (text: string): ParsedTaskData => {
  // Default values
  const now = new Date();
  const result: ParsedTaskData = {
    title: text.length > 30 ? text.substring(0, 27) + '...' : text,
    description: '',
    category: CONFIG.DEFAULT_CATEGORY,
    priority: CONFIG.DEFAULT_PRIORITY,
    date: now,
    startTime: format(now, 'HH:mm'),
    endTime: format(addHours(now, 1), 'HH:mm'),
    isAiGenerated: true,
  };

  // Very basic parsing for common patterns
  const lowerText = text.toLowerCase();
  
  // Try to detect category
  if (lowerText.includes('work') || lowerText.includes('meeting') || lowerText.includes('project')) {
    result.category = 'work';
  } else if (lowerText.includes('gym') || lowerText.includes('exercise') || lowerText.includes('workout')) {
    result.category = 'health';
  } else if (lowerText.includes('study') || lowerText.includes('learn') || lowerText.includes('read')) {
    result.category = 'study';
  } else if (lowerText.includes('shop') || lowerText.includes('buy') || lowerText.includes('purchase')) {
    result.category = 'shopping';
  } else if (lowerText.includes('family') || lowerText.includes('kids') || lowerText.includes('parent')) {
    result.category = 'family';
  } else if (lowerText.includes('relax') || lowerText.includes('movie') || lowerText.includes('game')) {
    result.category = 'leisure';
  }

  // Try to detect priority
  if (lowerText.includes('urgent') || lowerText.includes('important') || lowerText.includes('critical')) {
    result.priority = 'high';
  } else if (lowerText.includes('maybe') || lowerText.includes('if time') || lowerText.includes('low priority')) {
    result.priority = 'low';
  }

  // Try to extract time using regex
  const timeRegex = /(\d{1,2})(:|\.)?(\d{2})?\s*(am|pm|a\.m\.|p\.m\.)?/i;
  const timeMatch = text.match(timeRegex);
  
  if (timeMatch) {
    try {
      let hour = parseInt(timeMatch[1]);
      const minute = timeMatch[3] ? parseInt(timeMatch[3]) : 0;
      const period = timeMatch[4]?.toLowerCase();
      
      // Adjust hour for PM
      if (period && (period === 'pm' || period === 'p.m.') && hour < 12) {
        hour += 12;
      }
      // Adjust hour for AM
      if (period && (period === 'am' || period === 'a.m.') && hour === 12) {
        hour = 0;
      }
      
      const startTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      result.startTime = startTime;
      
      // Set end time to 1 hour after start time
      const startDate = parse(startTime, 'HH:mm', new Date());
      result.endTime = format(addHours(startDate, 1), 'HH:mm');
    } catch (error) {
      console.error('[TaskParsingService] Error parsing time:', error);
    }
  }

  return result;
};

// Validate and format the task data from OpenAI
const validateAndFormatTaskData = (data: any): ParsedTaskData => {
  const now = new Date();
  const result: ParsedTaskData = {
    title: data.title || CONFIG.FALLBACK_TITLE,
    description: data.description || '',
    category: isValidCategory(data.category) ? data.category : CONFIG.DEFAULT_CATEGORY,
    priority: isValidPriority(data.priority) ? data.priority : CONFIG.DEFAULT_PRIORITY,
    date: parseDate(data.date) || now,
    startTime: parseTime(data.startTime) || format(now, 'HH:mm'),
    endTime: parseTime(data.endTime) || format(addHours(now, 1), 'HH:mm'),
    isAiGenerated: true,
  };

  // Ensure title is not empty
  if (!result.title.trim()) {
    result.title = CONFIG.FALLBACK_TITLE;
  }

  return result;
};

// Helper function to validate category
const isValidCategory = (category: any): boolean => {
  if (!category) return false;
  return ['work', 'health', 'study', 'leisure', 'shopping', 'family'].includes(category.toLowerCase());
};

// Helper function to validate priority
const isValidPriority = (priority: any): boolean => {
  if (!priority) return false;
  return ['high', 'medium', 'low'].includes(priority.toLowerCase());
};

// Helper function to parse date
const parseDate = (dateStr: string): Date | null => {
  if (!dateStr) return null;
  
  try {
    // Try to parse ISO format
    const date = new Date(dateStr);
    if (isValid(date)) return date;
    
    // Try to parse YYYY-MM-DD format
    const parsedDate = parse(dateStr, 'yyyy-MM-dd', new Date());
    if (isValid(parsedDate)) return parsedDate;
    
    return null;
  } catch (error) {
    console.error('[TaskParsingService] Error parsing date:', error);
    return null;
  }
};

// Helper function to parse time
const parseTime = (timeStr: string): string | null => {
  if (!timeStr) return null;
  
  try {
    // Check if already in HH:MM format
    if (/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(timeStr)) {
      return timeStr.length === 5 ? timeStr : `0${timeStr}`;
    }
    
    // Try to parse time
    const parsedTime = parse(timeStr, 'HH:mm', new Date());
    if (isValid(parsedTime)) {
      return format(parsedTime, 'HH:mm');
    }
    
    return null;
  } catch (error) {
    console.error('[TaskParsingService] Error parsing time:', error);
    return null;
  }
};

// Function to create template-based tasks
export const createTemplateTask = (template: string): ParsedTaskData => {
  const now = new Date();
  
  switch (template) {
    case 'work-meeting':
      return {
        title: 'Work Meeting',
        description: 'Discuss project updates and next steps',
        category: 'work',
        priority: 'medium',
        date: now,
        startTime: format(now, 'HH:mm'),
        endTime: format(addHours(now, 1), 'HH:mm'),
        isAiGenerated: true,
      };
      
    case 'gym':
      return {
        title: 'Gym Session',
        description: 'Workout at the gym',
        category: 'health',
        priority: 'medium',
        date: now,
        startTime: format(now, 'HH:mm'),
        endTime: format(addHours(now, 1), 'HH:mm'),
        isAiGenerated: true,
      };
      
    case 'high-priority':
      return {
        title: 'High Priority Task',
        description: 'This task needs immediate attention',
        category: 'work',
        priority: 'high',
        date: now,
        startTime: format(now, 'HH:mm'),
        endTime: format(addHours(now, 1), 'HH:mm'),
        isAiGenerated: true,
      };
      
    default:
      return {
        title: CONFIG.FALLBACK_TITLE,
        description: '',
        category: CONFIG.DEFAULT_CATEGORY,
        priority: CONFIG.DEFAULT_PRIORITY,
        date: now,
        startTime: format(now, 'HH:mm'),
        endTime: format(addHours(now, 1), 'HH:mm'),
        isAiGenerated: true,
      };
  }
}; 