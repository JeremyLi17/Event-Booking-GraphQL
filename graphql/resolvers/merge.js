import Event from '../../models/event.js';
import User from '../../models/user.js';
import { dateToString } from '../../helpers/date.js';

// find user by userId
const user = async (userId) => {
  try {
    const res = await User.findById(userId);
    return {
      ...res._doc,
      createdEvents: events.bind(this, res._doc.createdEvents),
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const singleEvent = async (eventId) => {
  try {
    const event = await Event.findById(eventId);
    return transformEvent(event);
  } catch (err) {
    console.log(err);
    throw err;
  }
};

// find event by eventIds
const events = async (eventIds) => {
  try {
    const res = await Event.find({ _id: { $in: eventIds } });
    return res.map((event) => {
      return transformEvent(event);
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
};

// do some general operation for event(post process)
const transformEvent = (event) => {
  return {
    ...event._doc,
    date: dateToString(event._doc.date),
    creator: user.bind(this, event._doc.creator),
  };
};

const transformBooking = (booking) => {
  return {
    ...booking._doc,
    user: user.bind(this, booking._doc.user),
    event: singleEvent.bind(this, booking._doc.event),
    createdAt: dateToString(booking._doc.createdAt),
    updatedAt: dateToString(booking._doc.updatedAt),
  };
};

export { user, singleEvent, events, transformEvent, transformBooking };
