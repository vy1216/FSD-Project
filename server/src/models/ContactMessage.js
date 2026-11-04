import mongoose from 'mongoose';

const contactMessageSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  phone: { type: String, default: '' },
  subject: { type: String, required: true, trim: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['New', 'Read', 'Resolved'], default: 'New', index: true }
}, {
  timestamps: true
});

export const ContactMessage = mongoose.model('ContactMessage', contactMessageSchema);
