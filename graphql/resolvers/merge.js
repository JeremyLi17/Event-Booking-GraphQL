import DataLoader from 'dataloader';

import Event from '../../models/event.js';
import User from '../../models/user.js';
import { dateToString } from '../../helpers/date.js';

const eventLoader = new DataLoader((eventIds) => {
  return events(eventIds);
});

const userLoader = new DataLoader((userIds) => {
  return User.find({ _id: { $in: userIds } });
});

// find user by userId
const user = async (userId) => {
  try {
    const res = await userLoader.load(userId.toString());
    return {
      ...res._doc,
      // createdEvents: events.bind(this, res._doc.createdEvents),
      createdEvents: () => eventLoader.loadMany(res._doc.createdEvents),
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const singleEvent = async (eventId) => {
  try {
    // const event = await Event.findById(eventId);
    const event = await eventLoader.load(eventId.toString());
    return event;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

// find event by eventIds
const events = async (eventIds) => {
  try {
    const res = await Event.find({ _id: { $in: eventIds } });
    res.sort((a, b) => {
      return (
        eventIds.indexOf(a._id.toString()) - eventIds.indexOf(b._id.toString())
      );
    });
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
