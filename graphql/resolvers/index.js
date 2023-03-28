import bcrypt from 'bcryptjs';
import Event from '../../models/event.js';
import User from '../../models/user.js';

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

// find event by eventIds
const events = async (eventIds) => {
  try {
    const res = await Event.find({ _id: { $in: eventIds } });
    return res.map((event) => {
      return {
        ...event._doc,
        creator: user.bind(this, event._doc.creator),
      };
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export default {
  // have all resolver function
  events: async () => {
    try {
      // by use .polutate()
      // we can fetch some complex info represented by foreignKey
      // const res = await Event.find().populate('creator');
      const res = await Event.find();
      return res.map((event) => {
        return {
          ...event._doc,
          creator: user.bind(this, event._doc.creator),
        };
        // return { ...event._doc, _id: event._doc._id.toString() };
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  createEvent: async (args) => {
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
      creator: '641e10412714b78946edb9a1',
    });

    try {
      const res = await event.save();
      const creator = await User.findById('641e10412714b78946edb9a1');
      if (!creator) {
        throw new Error('User not found.');
      }

      creator.createdEvents.push(event);
      await creator.save();
      return { ...res._doc, creator: user.bind(this, res._doc.creator) };
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
  createUser: async (args) => {
    try {
      const userByEmail = User.findOne({ email: args.userInput.email });
      if (userByEmail) {
        throw new Error('Email used already.');
      }

      const hashedPassword = bcrypt.hashSync(args.userInput.password, 12);
      const user = new User({
        email: args.userInput.email,
        password: hashedPassword,
      });

      const res = await user.save();
      return { ...res._doc, password: null };
    } catch (err) {
      console.log(err);
      throw err;
    }

    // or in sync way:
    // return bcrypt
    //   .hash(args.userInput.password, 12)
    //   .then((hashedPassword) => {
    //     const user = new User({
    //       email: args.userInput.email,
    //       password: hashedPassword,
    //     });
    //     return user.save();
    //   })
    //   .then((result) => {
    //     return { ...result._doc };
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //     throw err;
    //   });
  },
};
