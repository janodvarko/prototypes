/* See license.txt for terms of usage */

import React, { Component } from 'react';
import './Table.css';

class RequestListItem extends Component {
  render() {
    return (
      <div className="request-list-item even" data-id="server2.conn1.netEvent736" tabIndex="0">
         <div className="requests-list-column requests-list-status">
            <div className="requests-list-status-code status-code" data-status-code="200" data-code="200">200</div>
         </div>
         <div className="requests-list-column requests-list-method">GET</div>
         <div className="requests-list-column requests-list-domain" title="localhost:3001 (127.0.0.1:3001)">
            <div className="requests-security-state-icon security-state-local" title="The connection used to fetch this resource was secure."></div>
            localhost:3001
         </div>
         <div className="requests-list-column requests-list-file" title="http://localhost:3001/">
            <div className="requests-file-type-icon file-type-general" title="http://localhost:3001/"></div>
            /
         </div>
         <div className="requests-list-column requests-list-cause" title="document">document</div>
         <div className="requests-list-column requests-list-type" title="text/html; charset=UTF-8">html</div>
         <div className="requests-list-column requests-list-transferred" title="1.11 KB">1.11 KB</div>
         <div className="requests-list-column requests-list-size" title="1.70 KB">1.70 KB</div>
         <div className="requests-list-column requests-list-waterfall" title="Wait 2 ms, Receive 1 ms, Total 3 ms">
            <div className="requests-list-timings" style={{paddingInlineStart: "0px"}}>
               <div className="requests-list-timings-box wait" style={{width: "2px"}}></div>
               <div className="requests-list-timings-box receive" style={{width: "1px"}}></div>
               <div className="requests-list-timings-total" title="3 ms">3 ms</div>
            </div>
         </div>
      </div>
    );
  }
}

export default RequestListItem;
