// @ts-nocheck
import mongoose from 'mongoose';

const RegionSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Region || mongoose.model('Region', RegionSchema);
