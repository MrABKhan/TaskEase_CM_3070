import mongoose, { Schema, Document } from 'mongoose';

export interface ITask extends Document {
  id: string;
  title: string;
  description: string;
  category: 'work' | 'health' | 'study' | 'leisure' | 'shopping' | 'family';
  priority: 'high' | 'medium' | 'low';
  startTime: string;
  endTime: string;
  date: Date;
  completed: boolean;
  notes: string[];
  subtasks: {
    id: string;
    title: string;
    completed: boolean;
  }[];
  tags: string[];
  isAiGenerated?: boolean;
  userId: string;
}

const taskSchema = new Schema<ITask>({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  category: { 
    type: String, 
    required: true,
    enum: ['work', 'health', 'study', 'leisure', 'shopping', 'family']
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
  notes: [{ type: String }],
  subtasks: [{
    id: { type: String, required: true },
    title: { type: String, required: true },
    completed: { type: Boolean, default: false }
  }],
  tags: [{ type: String }],
  isAiGenerated: { type: Boolean, default: false },
  userId: { type: String, required: true }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// Add indexes for better query performance
taskSchema.index({ userId: 1, date: 1 });
taskSchema.index({ userId: 1, category: 1 });
taskSchema.index({ userId: 1, completed: 1 });

export default mongoose.model<ITask>('Task', taskSchema); 