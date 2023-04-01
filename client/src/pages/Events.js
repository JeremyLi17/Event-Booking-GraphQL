import React, { useState } from 'react';

import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';
import './Events.css';

const EventsPage = () => {
  const [creating, setCreating] = useState(false);

  const modalConfirm = () => {
    setCreating(false);
  };

  const modalCancel = () => {
    setCreating(false);
  };

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
          <p>Modal Content</p>
        </Modal>
      )}
      <div className="events-control">
        <p>Share your own Events!</p>
        <button className="btn" onClick={() => setCreating(true)}>
          Create Event
        </button>
      </div>
    </>
  );
};

export default EventsPage;
