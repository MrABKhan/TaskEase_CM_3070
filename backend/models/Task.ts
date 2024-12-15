import mongoose, { Schema, Document } from 'mongoose';

export interface ITask extends Document {
  title: string;
  description: string;
  category: 'work' | 'health' | 'study' | 'leisure';
  priority: 'high' | 'medium' | 'low';
  startTime: string;
  endTime: string;
  date: Date;
  completed: boolean;
  userId: string;
  notes: string[];
  subtasks: {
    id: string;
    title: string;
    completed: boolean;
  }[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  category: { 
    type: String, 
    required: true,
    enum: ['work', 'health', 'study', 'leisure']
  },
  priority: {
    type: String,
    required: true,
    enum: ['high', 'medium', 'low']
  },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  date: { type: Date, required: true },
  completed: { type: Boolean, default: false },
  userId: { type: String, required: true },
  notes: [{ type: String }],
  subtasks: [{
    id: { type: String, required: true},
    title: { type: String, required: true },
    completed: { type: Boolean, default: false }
  }],
  tags: [{ type: String }]
}, {
  timestamps: true
});

// Add indexes for better query performance
TaskSchema.index({ userId: 1, date: 1 });
TaskSchema.index({ userId: 1, category: 1 });
TaskSchema.index({ userId: 1, completed: 1 });

export default mongoose.model<ITask>('Task', TaskSchema); 