import Event from '../../models/event.js';
import User from '../../models/user.js';
import { transformEvent } from './merge.js';

export default {
  // have all resolver function
  events: async () => {
    try {
      // by use .polutate()
      // we can fetch some complex info represented by foreignKey
      // const res = await Event.find().populate('creator');
      const res = await Event.find();
      return res.map((event) => {
        return transformEvent(event);
        // return { ...event._doc, _id: event._doc._id.toString() };
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  createEvent: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    // const event = {
    //   _id: Math.random().toString(),
    //   title: args.eventInput.title,
    //   description: args.eventInput.description,
    //   // to convert to number just add '+' in the front
    //   price: +args.eventInput.price,
    //   date: args.eventInput.date,
    // };
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      // to convert to number just add '+' in the front
      price: +args.eventInput.price,
      date: new Date(args.eventInput.date),
      creator: req.userId,
    });

    try {
      const res = await event.save();
      const creator = await User.findById(req.userId);
      if (!creator) {
        throw new Error('User not found.');
      }

      creator.createdEvents.push(event);
      await creator.save();
      return transformEvent(res);
    } catch (err) {
      console.log(err);
      throw err;
    }

    // using then() and catch()
    // return event
    //   .save()
    //   .then((result) => {
    //     console.log(result);
    //     return { ...result._doc };
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //     throw err;
    //   });
  },
};
