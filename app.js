import express from 'express';
import bodyParser from 'body-parser';
import { graphqlHTTP } from 'express-graphql';
import mongoose from 'mongoose';
import isAuth from './middleware/isAuth.js';

import graphQlSchema from './graphql/schema/index.js';
import graphQlResolver from './graphql/resolvers/index.js';

const app = express();

// middlewares
app.use(bodyParser.json());
// allow CORS
app.use((req, res, next) => {
  // every host can send request to this server
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});
app.use(isAuth);

app.use(
  '/graphql',
  graphqlHTTP({
    // config the endpoint
    // query for fetching data, mutation for changing data

    // Define all types of query and mutation in RootQuery and RootMutation
    schema: graphQlSchema,
    rootValue: graphQlResolver,
    // backend debug tool
    graphiql: true,
  })
);

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
