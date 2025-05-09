import mongoose from 'mongoose';

const EmployerNotificationSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  employeeId: {
    type: String,
    required: true,
  },
  employeeName: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Approved', 'Rejected','Scheduled'],
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    required: true,
    default: Date.now,
  },
 jobDetails: {
  type: String,
  ref: 'jobPost',
},
interviewDate: {  // New field to store the interview date for 'Scheduled' status
  type: Date,
  default: null,  // Will be set only when status is 'Scheduled'
},
});

const EmployerNotifications = mongoose.model('EmployerNotification', EmployerNotificationSchema);
export default EmployerNotifications;