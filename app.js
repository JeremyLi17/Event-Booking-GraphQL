import express from 'express';
import bodyParser from 'body-parser';
import { buildSchema } from 'graphql';
import { graphqlHTTP } from 'express-graphql';
// const graphqlHttp = require('express-graphql');
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Event from './models/event.js';
import User from './models/user.js';

const app = express();

app.use(bodyParser.json());
app.use(
  '/graphql',
  graphqlHTTP({
    // config the endpoint
    // query for fetching data, mutation for changing data

    // Define all types of query and mutation in RootQuery and RootMutation
    schema: buildSchema(`
      type Event {
        _id: ID!
        title: String!
        description: String!
        price: Float!
        date: String!
        creator: User!
      }

      type User {
        _id: ID!
        email: String!
        password: String
        createdEvents: [Event!]
      }

      input EventInput {
        title: String!
        desciption: String!
        price: Float!
        date: String!
      }

      input UserInput {
        email: String!
        password: String!
      }
    
      type RootQuery {
        events: [Event!]!
      }

      type RootMutation {
        createEvent(eventInput: EventInput): Event
        createUser(userInput: UserInput): User
      }

      schema {
        query: RootQuery
        mutation: RootMutation
      }
    `),
    rootValue: {
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
    },
    // backend debug tool
    graphiql: true,
  })
);

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

// connect mongoDB
const connectDB = () => {
  // connect to mongoDB
  mongoose.set('strictQuery', false);
  try {
    mongoose.connect(process.env.MONGO, {
      dbName: 'Booking',
    });
    console.log('Connected to MongoDB');
  } catch (err) {
    throw err;
  }
};

app.listen(8800, () => {
  connectDB();
  console.log('Server is running on localhost:8800');
});
