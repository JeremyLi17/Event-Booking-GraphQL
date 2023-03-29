import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../../models/user.js';

export default {
  // have all resolver function
  createUser: async (args) => {
    try {
      const userByEmail = await User.findOne({ email: args.userInput.email });
      if (userByEmail) {
        throw new Error('Email used already.');
      }

      const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
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
  login: async ({ email, password }) => {
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error('Invalid credential');
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new Error('Invalid credential');
    }
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      process.env.SECRET,
      {
        expiresIn: '1h',
      }
    );
    return { userId: user.id, token: token, tokenExpiration: 1 };
  },
};
