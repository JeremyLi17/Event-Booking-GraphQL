import React, { useContext, useEffect, useState } from 'react';

import Spinner from '../components/Spinner/Spinner';
import BookingList from '../components/Bookings/BookingList/BookingList';
import AuthContext from '../context/auth-context';

const BookingsPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [bookings, setBookings] = useState([]);
  const userContext = useContext(AuthContext);
  const token = userContext.token;

  useEffect(() => {
    const fetchBookings = async () => {
      setIsLoading(true);
      const requestBody = {
        query: `
          query {
            bookings {
              _id
              createdAt
              event {
                _id
                title
                date
              }
            }
          }
        `,
      };

      try {
        const res = await fetch('http://localhost:8800/graphql', {
          method: 'POST',
          body: JSON.stringify(requestBody),
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
          },
        });

        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }

        const resData = await res.json();
        const bookingsList = resData.data.bookings;

        setBookings(bookingsList);
        setIsLoading(false);
      } catch (err) {
        console.log(err);
        setIsLoading(false);
        throw err;
      }
    };
    fetchBookings();
  }, [userContext]);

  const deleteBookingHandler = async (bookingId) => {
    setIsLoading(true);
    const requestBody = {
      query: `
          mutation {
            cancelBooking(bookingId: "${bookingId}") {
              _id
              title
            }
          }
        `,
    };

    try {
      const res = await fetch('http://localhost:8800/graphql', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
      });

      if (res.status !== 200 && res.status !== 201) {
        throw new Error('Failed!');
      }

      const updatedBookings = bookings.filter((booking) => {
        return booking._id !== bookingId;
      });
      setBookings(updatedBookings);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
      throw err;
    }
  };

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <BookingList bookings={bookings} onDelete={deleteBookingHandler} />
      )}
    </>
  );
};

export default BookingsPage;
