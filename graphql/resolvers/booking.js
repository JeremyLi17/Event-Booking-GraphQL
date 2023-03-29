import Booking from '../../models/booking.js';
import Event from '../../models/event.js';
import { transformEvent, transformBooking } from './merge.js';

export default {
  // have all resolver function
  bookings: async () => {
    try {
      const res = await Booking.find();
      return res.map((booking) => {
        return transformBooking(booking);
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  bookEvent: async (args) => {
    const fetchedEvent = await Event.findById(args.eventId);
    const booking = new Booking({
      user: '641e10412714b78946edb9a1',
      event: fetchedEvent,
    });

    const res = await booking.save();
    return transformBooking(res);
  },
  cancelBooking: async (args) => {
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
