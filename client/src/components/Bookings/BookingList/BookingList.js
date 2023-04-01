import React from 'react';

import './BookingList.css';

const BookingList = (props) => {
  return (
    <ul className="booking-list">
      {props.bookings.map((booking) => {
        return (
          <li className="bookings-item" key={booking._id}>
            <div className="bookings-item-data">
              {booking.event.title} -{' '}
              {new Date(booking.createdAt).toLocaleDateString()}
            </div>
            <div className="bookings-item-actions">
              <button
                className="btn"
                onClick={props.onDelete.bind(this, booking._id)}
              >
                Cancel
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default BookingList;
