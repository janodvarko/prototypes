import React from 'react';
import { useDispatch } from 'react-redux';

import * as ReactBootstrap from 'react-bootstrap';
const Button = ReactBootstrap.Button;

const MyButton = () => {
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch({ type: 'SOME_ACTION', payload: { /* some payload */ } });
  };

  return (
    <Button onClick={handleClick}>Click me</Button>
  );
};

export default MyButton;
