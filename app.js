import express from 'express';
import bodyParser from 'body-parser';
import { graphqlHTTP } from 'express-graphql';
import mongoose from 'mongoose';

import graphQlSchema from './graphql/schema/index.js';
import graphQlResolver from './graphql/resolvers/index.js';

const app = express();

app.use(bodyParser.json());
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
