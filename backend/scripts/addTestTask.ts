import mongoose from 'mongoose';
import Task from '../models/Task';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/taskease';

async function addTestTask() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully');

    const today = new Date();
    const testTask = new Task({
      title: 'Test Task',
      description: 'This is a test task',
      category: 'work',
      priority: 'high',
      startTime: '09:00',
      endTime: '10:00',
      date: today,
      completed: false,
      userId: 'user123',
      notes: ['Test note'],
      subtasks: [{
        id: '1',
        title: 'Test subtask',
        completed: false
      }],
      tags: ['test']
    });

    const savedTask = await testTask.save();
    console.log('✅ Test task created successfully:', savedTask);

    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

addTestTask(); 