import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const eventSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    requried: true,
  },
  price: {
    type: Number,
    requried: true,
  },
  date: {
    type: Date,
    required: true,
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

export default mongoose.model('Event', eventSchema);
