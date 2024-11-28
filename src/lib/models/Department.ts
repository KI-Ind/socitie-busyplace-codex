import mongoose from 'mongoose';

const DepartmentSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  region_code: {
    type: String,
    required: true,
    ref: 'Region',
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Department || mongoose.model('Department', DepartmentSchema);
