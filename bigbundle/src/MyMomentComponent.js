import React from 'react';
import moment from 'moment';
import 'moment/min/locales';

const MyMomentComponent = () => {
  // Example usage of Moment.js
  // You can change the locale to see the effect
  moment.locale('fr'); // Setting French as an example
  const date = moment().format('LLLL');

  return <div>Current Date and Time: {date}</div>;
};

export default MyMomentComponent;
