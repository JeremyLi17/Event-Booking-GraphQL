import React, { useContext, useEffect, useRef, useState } from 'react';

import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';
import AuthContext from '../context/auth-context';
import EventList from '../components/Events/EventList/EventList';
import Spinner from '../components/Spinner/Spinner';
import './Events.css';

const EventsPage = () => {
  const titleRef = useRef();
  const priceRef = useRef();
  const dateRef = useRef();
  const descRef = useRef();
  const [creating, setCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSeletedEvent] = useState(null);
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
    // console.log({ title, price, date, description: desc });

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
      // push into event list
      const updatedEvents = [...events];
      updatedEvents.push({
        _id: resData.data.createEvent._id,
        title: resData.data.createEvent.title,
        description: resData.data.createEvent.description,
        date: resData.data.createEvent.date,
        price: resData.data.createEvent.price,
        creator: {
          _id: userContext.userId,
        },
      });
      setEvents(updatedEvents);
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  const modalCancel = () => {
    setCreating(false);
    setSeletedEvent(null);
  };

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
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
        setIsLoading(false);
      } catch (err) {
        console.log(err);
        setIsLoading(false);
        throw err;
      }
    };
    fetchEvents();
  }, [userContext]);

  const showDetailHandler = (eventId) => {
    const selected = events.find((e) => e._id === eventId);
    setSeletedEvent(selected);
  };

  const bookEventHandler = async () => {
    const token = userContext.token;
    if (!token) {
      setSeletedEvent(null);
      // not login
      return;
    }

    const requestBody = {
      query: `
        mutation {
          bookEvent(eventId: "${selectedEvent._id}") {
            _id
            createdAt
            updatedAt
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
      console.log(resData);
      setSeletedEvent(null);
    } catch (err) {
      console.log(err);
      setSeletedEvent(null);
      throw err;
    }
  };

  return (
    <>
      {(creating || selectedEvent) && <Backdrop />}
      {/* this is for upload new event */}
      {creating && (
        <Modal
          title="Add Event"
          canCancel
          canConfirm
          onConfirm={modalConfirm}
          onCancel={modalCancel}
          confirmText="Confirm"
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
      {/* this is for view detail */}
      {selectedEvent && (
        <Modal
          title={selectedEvent.title}
          canCancel
          canConfirm
          onCancel={modalCancel}
          onConfirm={bookEventHandler}
          confirmText={userContext.token ? 'Book' : 'Confirm'}
        >
          <h1>{selectedEvent.title}</h1>
          <h2>
            ${selectedEvent.price} -{' '}
            {new Date(selectedEvent.date).toLocaleDateString()}
          </h2>
          <p>{selectedEvent.description}</p>
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
      {isLoading ? (
        <Spinner />
      ) : (
        <EventList
          events={events}
          authUserId={userContext.userId}
          onViewDetail={showDetailHandler}
        />
      )}
    </>
  );
};

export default EventsPage;
