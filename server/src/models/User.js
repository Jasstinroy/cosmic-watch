import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['user', 'researcher'], 
    default: 'user' 
  },
  watchlist: [{
    asteroidId: String,
    name: String,
    addedAt: { type: Date, default: Date.now }
  }],
alertPreferences: {
    minRiskScore: { type: Number, default: 50 },
    notifyImminent: { type: Boolean, default: true },
    emailFrequency: { type: String, enum: ['daily', 'weekly', 'never'], default: 'daily' }
  }
});

export default mongoose.model('User', userSchema);