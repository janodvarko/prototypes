import React from 'react';
import Button from '@mui/material/Button';
import Icon from '@mui/icons-material/Face';

const MuiButton = () => {
  return (
    <div>
      <Button variant="contained" color="primary">
        Hello World
        <Icon />
      </Button>
    </div>
  );
};

export default MuiButton;
