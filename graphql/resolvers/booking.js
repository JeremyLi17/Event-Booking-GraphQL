import Booking from '../../models/booking.js';
import Event from '../../models/event.js';
import { transformEvent, transformBooking } from './merge.js';

export default {
  // have all resolver function
  bookings: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }

    try {
      const res = await Booking.find({ user: req.userId });
      return res.map((booking) => {
        return transformBooking(booking);
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  bookEvent: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }

    const fetchedEvent = await Event.findById(args.eventId);
    const booking = new Booking({
      user: req.userId,
      event: fetchedEvent,
    });

    const res = await booking.save();
    return transformBooking(res);
  },
  cancelBooking: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }

    try {
      const booking = await Booking.findById(args.bookingId).populate('event');
      if (!booking) {
        throw new Error('Booking not found');
      }

      // when using populate -> to access the event, we need booking.event._doc
      const event = transformEvent(booking.event);
      await Booking.deleteOne({ _id: args.bookingId });
      return event;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
};
