import React, { useState, useEffect } from 'react';
import { Bar as BarChart } from 'react-chartjs';

const BOOKINGS_BUCKETS = {
  Cheap: {
    min: 0,
    max: 50,
  },
  Normal: {
    min: 50,
    max: 200,
  },
  Expensive: {
    min: 200,
    max: 100000,
  },
};

const BookingChart = (props) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const chartData = { labels: [], datasets: [] };
    let values = [];
    for (const bucket in BOOKINGS_BUCKETS) {
      const filteredBookingsCount = props.bookings.reduce((prev, cur) => {
        if (
          cur.event.price >= BOOKINGS_BUCKETS[bucket].min &&
          cur.event.price < BOOKINGS_BUCKETS[bucket].max
        ) {
          return prev + 1;
        } else {
          return prev;
        }
      }, 0);
      values.push(filteredBookingsCount);
      chartData.labels.push(bucket);
      chartData.datasets.push({
        fillColor: 'rgba(220,220,220,0.5)',
        strokeColor: 'rgba(220,220,220,0.8)',
        highlightFill: 'rgba(220,220,220,0.75)',
        highlightStroke: 'rgba(220,220,220,1)',
        data: values,
      });
      values = [...values];
      values[values.length - 1] = 0;
    }
    setData(chartData);
  }, [props.bookings]);
  return !data ? (
    <div style={{ textAlign: 'center' }}>Loading ...</div>
  ) : (
    <div style={{ textAlign: 'center' }}>
      <BarChart
        data={data}
        style={{ height: '40vh', width: '40rem', maxWidth: '90%' }}
      />
    </div>
  );
};

export default BookingChart;
