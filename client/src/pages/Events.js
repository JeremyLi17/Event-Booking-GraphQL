import React from 'react';

import Modal from '../components/Modal/Modal';
import './Events.css';

const EventsPage = () => {
  return (
    <>
      <Modal title="Add Event" canCancel canConfirm>
        <p>Modal Content</p>
      </Modal>
      <div className="events-control">
        <p>Share your own Events!</p>
        <button className="btn">Create Event</button>
      </div>
    </>
  );
};

export default EventsPage;
