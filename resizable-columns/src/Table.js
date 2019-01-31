/* See license.txt for terms of usage */

import React, { Component } from 'react';
import './Table.css';

import RequestListHeader from './RequestListHeader';
import RequestListItem from './RequestListItem';
import { RESPONSE_HEADERS } from './constants.js';

const cols = {
  status: true,
  method: true,
  domain: true,
  file: true,
  protocol: false,
  scheme: false,
  remoteip: false,
  cause: true,
  type: true,
  cookies: false,
  setCookies: false,
  transferred: true,
  contentSize: true,
  startTime: false,
  endTime: false,
  responseTime: false,
  duration: false,
  latency: false,
  waterfall: true,
};

const columns = Object.assign(cols,
  RESPONSE_HEADERS.reduce((acc, header) => Object.assign(acc, { [header]: false }), {})
);

class Table extends Component {
  render() {
    return (
      <div className="requests-list-table">
        <RequestListHeader columns={columns} />
        <div className="requests-list-contents">
          <RequestListItem />
          <RequestListItem />
          <RequestListItem />
          <RequestListItem />
          <RequestListItem />
        </div>
      </div>
    );
  }
}

export default Table;
