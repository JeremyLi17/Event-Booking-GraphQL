import bcrypt from 'bcryptjs';

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
};
