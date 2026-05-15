import mongoose from 'mongoose';

const issueRecordSchema = new mongoose.Schema({
  student: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  book: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Book', 
    required: true 
  },
  issueDate: { type: Date, default: Date.now },
  dueDate: { type: Date, required: true },
  returnDate: { type: Date },
  status: { 
    type: String, 
    enum: ['Issued', 'Returned'], 
    default: 'Issued' 
  },
  fine: { type: Number, default: 0 }
}, { timestamps: true });

const IssueRecord = mongoose.model('IssueRecord', issueRecordSchema);
export default IssueRecord;