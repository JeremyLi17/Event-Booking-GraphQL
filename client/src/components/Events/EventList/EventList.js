import React from 'react';

import EventItem from './EventItem/EventItem';
import './EventList.css';

const EventList = (props) => {
  return (
    <ul className="event-list">
      {props.events.map((event) => {
        return (
          <EventItem
            key={event._id}
            eventId={event._id}
            title={event.title}
            price={event.price}
            date={event.date}
            userId={props.authUserId}
            creatorId={event.creator._id}
            // pass up
            onDetail={props.onViewDetail}
          />
        );
      })}
    </ul>
  );
};

export default EventList;
