import React, { useContext, useEffect, useRef, useState } from 'react';

import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';
import AuthContext from '../context/auth-context';
import './Events.css';

const EventsPage = () => {
  const titleRef = useRef();
  const priceRef = useRef();
  const dateRef = useRef();
  const descRef = useRef();
  const [creating, setCreating] = useState(false);
  const [events, setEvents] = useState([]);
  const userContext = useContext(AuthContext);

  const modalConfirm = async () => {
    setCreating(false);
    const title = titleRef.current.value;
    const price = +priceRef.current.value;
    const date = dateRef.current.value;
    const desc = descRef.current.value;

    if (
      title.trim().length === 0 ||
      price <= 0 ||
      date.trim().length === 0 ||
      desc.trim().length === 0
    ) {
      return;
    }
    console.log({ title, price, date, description: desc });

    // send to backend
    const requestBody = {
      query: `
        mutation {
          createEvent(eventInput: {
            title: "${title}",
            price: ${price},
            date: "${date}",
            description: "${desc}"
          }) {
            _id
            title
            description
            date
            price
            creator {
              _id
              email
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

      console.log(resData);
      await fetchEvents();
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  const modalCancel = () => {
    setCreating(false);
  };

  const fetchEvents = async () => {
    const requestBody = {
      query: `
        query {
          events {
            _id
            title
            description
            date
            price
            creator {
              _id
              email
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
        },
      });

      if (res.status !== 200 && res.status !== 201) {
        throw new Error('Failed!');
      }

      const resData = await res.json();
      const eventsList = resData.data.events;
      setEvents(eventsList);
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <>
      {creating && <Backdrop />}
      {creating && (
        <Modal
          title="Add Event"
          canCancel
          canConfirm
          onConfirm={modalConfirm}
          onCancel={modalCancel}
        >
          <form>
            <div className="form-control">
              <label htmlFor="title">Title</label>
              <input type="text" id="title" ref={titleRef} />
            </div>
            <div className="form-control">
              <label htmlFor="price">Price</label>
              <input type="number" id="price" ref={priceRef} />
            </div>
            <div className="form-control">
              <label htmlFor="date">Date</label>
              {/* type="date" OR type="datetime-local" */}
              <input type="datetime-local" id="date" ref={dateRef} />
            </div>
            <div className="form-control">
              <label htmlFor="description">Description</label>
              <textarea id="description" rows="4" ref={descRef} />
            </div>
          </form>
        </Modal>
      )}
      {userContext.token && (
        <div className="events-control">
          <p>Share your own Events!</p>
          <button className="btn" onClick={() => setCreating(true)}>
            Create Event
          </button>
        </div>
      )}
      <ul className="events-list">
        {events.map((event) => {
          return (
            <li className="events-list-item" key={event._id}>
              {event.title}
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default EventsPage;
