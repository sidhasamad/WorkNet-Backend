import mongoose from 'mongoose';

const interviewScheduleSchema = new mongoose.Schema({
  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobApplication', // Assuming the applicant is from the 'JobApplication' model
    required: true,
  },
  interviewDate: {
    type: Date,
    required: true,
  },
  interviewTime: {
    type: Date,
    required: true,
  },
  interviewStatus: {
    type: String,
    enum: ['Scheduled', 'Completed', 'Not Scheduled'],
    default: 'Not Scheduled',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const InterviewSchedule = mongoose.model('InterviewSchedule', interviewScheduleSchema);

export default InterviewSchedule;
