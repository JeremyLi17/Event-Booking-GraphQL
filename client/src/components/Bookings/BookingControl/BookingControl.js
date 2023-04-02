import React from 'react';

import './BookingControl.css';

const BookingControl = (props) => {
  return (
    <div className="booking-control">
      <button
        className={props.outputType === 'list' ? 'active' : ''}
        onClick={props.onClickButton.bind(this, 'list')}
      >
        List View
      </button>
      <button
        className={props.outputType === 'chart' ? 'active' : ''}
        onClick={props.onClickButton.bind(this, 'chart')}
      >
        Chart View
      </button>
    </div>
  );
};

export default BookingControl;
