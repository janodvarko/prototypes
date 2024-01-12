import logo from './logo.svg';
import './App.css';

import _ from 'lodash';
import $ from 'jquery';

import MyButton from './MyButton';
import MyDropdown from './MyDropdown';
import MuiButton from './MuiButton';
import MyReactSelect from './MyReactSelect';
import MyD3Component from './MyD3Component';
import MyThreeComponent from './MyThreeComponent';
import MyMomentComponent from './MyMomentComponent';

import 'bootstrap/dist/css/bootstrap.css';

const reports = require('./user-reports.json');


function App() {
  const uniqueArray = _.uniq([1, 2, 2, 3, 4, 4, 5]);

  console.log(uniqueArray);
  console.log($('#my-element').text('Hello, jQuery and React!'));
  console.log(reports.data.length);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>

        <MyButton variant="primary">Primary Button X</MyButton>
        <MyDropdown />
        <MuiButton>MUI Button</MuiButton>
        <MyReactSelect />
        <MyD3Component />
        <MyThreeComponent />
        <MyMomentComponent />
      </header>
    </div>
  );
}

export default App;
