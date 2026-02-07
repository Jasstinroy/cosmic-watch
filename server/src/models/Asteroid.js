import mongoose from 'mongoose';

const asteroidSchema = new mongoose.Schema({
  nasaId: { 
    type: String, 
    required: true, 
    unique: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  diameter: Number,      
  velocity: Number,       
  distance: Number,       
  isHazardous: Boolean,   
  approachDate: String,   
  lastUpdated: { 
    type: Date, 
    default: Date.now 
  }
});

export default mongoose.model('Asteroid', asteroidSchema);