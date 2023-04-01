import React, { useContext, useEffect, useState } from 'react';

import Spinner from '../components/Spinner/Spinner';
import AuthContext from '../context/auth-context';

const BookingsPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [bookings, setBookings] = useState([]);
  const userContext = useContext(AuthContext);

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

      const token = userContext.token;

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

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <ul>
          {bookings.map((booking) => {
            return (
              <li key={booking._id}>
                {booking.event.title} -{' '}
                {new Date(booking.createdAt).toLocaleDateString()}
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
};

export default BookingsPage;
