/* See license.txt for terms of usage */

import React, { Component, createRef } from 'react';
import './Table.css';

import Draggable from './Draggable';
import { HEADERS } from './constants.js';
import { defaultColumnsData, MIN_COLUMN_WIDTH } from './defaultColumnsData.js';

import dom from 'react-dom-factories';

const { div, button } = dom;

// Initialize pref
const temp = [...defaultColumnsData.values()];
window.columnsDataPref = JSON.stringify(temp);

/**
 * Render the request list header with sorting arrows for columns.
 * Displays tick marks in the waterfall column header.
 * Also draws the waterfall background canvas and updates it when needed.
 */
class RequestListHeader extends Component {

  constructor(props) {
    super(props);
    this.requestListHeader = createRef();
  }

  // Dragging Events

  /**
   * Set 'resizing' cursor on entire document during column-resizer dragging.
   * This avoids cursor-flickering that happens when the mouse leaves
   * the column-resizer area (happens frequently).
   */
  onStartMove() {
    // Set cursor to dragging
    const doc = this.requestListHeader.ownerDocument;

    //const defaultCursor = doc.documentElement.style.cursor;

    doc.documentElement.style.cursor = "ew-resize";
    this.requestListHeader.classList.add("dragging");

    // this setState causes a call to render; maybe we can get rid of it later
    // This causes rerender - we don't want that.
    /*this.setState({
      defaultCursor: defaultCursor,
    });*/
  }

  /**
   * Helper method to convert pixels into percent based on parent container width
   */
  px2percent(pxWidth, parentWidth) {
    const percent = Math.round((100 * pxWidth / parentWidth) * 100) / 100;
    return percent;
  }

  onStopMove(columnsData) {
    // Store the new column widths into prefs
    const { columns } = this.props;
    const visibleColumns = HEADERS.filter((header) => columns[header.name]);

    const parentEl = document.querySelector(".requests-list-headers");
    const parentWidth = parentEl.clientWidth;

    // For each visible column update minWidth and width in columnsData Map
    for (let i = 0; i < visibleColumns.length; i++) {
      const name = visibleColumns[i].name;
      let minWidth;
      // Check in columnsData for minWidth
      if (columnsData.has(name)) {
        minWidth = columnsData.get(name).minWidth;
      }
      if (!minWidth) {
        minWidth = MIN_COLUMN_WIDTH;
      }

      const headerRef = this.refs[`${name}Header`];
      // Get actual column width, change into %, update columnsData Map
      const width = this.px2percent(headerRef.clientWidth, parentWidth);
      columnsData.set(name, {name, minWidth, width});
    }

    // Store widths in prefs
    this.storeWidths(columnsData);

    // Restore cursor back to default
    //const doc = this.requestListHeader.ownerDocument;
    //doc.documentElement.style.cursor = this.state.defaultCursor;

    this.requestListHeader.classList.remove("dragging");
  }

  onMove(visibleColumns, columnsData, name, x, y) {
    const parentEl = document.querySelector(".requests-list-headers");
    const parentWidth = parentEl.clientWidth;

    // Get the current column handle and save its old width
    // before changing so we can compute the difference in width
    const headerRef = this.refs[`${name}Header`];
    const oldWidth = headerRef.clientWidth;

    // Get the column handle that will compensate the width change.
    // It should be the last column before waterfall column (if waterfall visible),
    // otherwise it is simply the last visible column
    let compensateHeaderName;
    if (visibleColumns[visibleColumns.length - 1].name === "waterfall") {
      compensateHeaderName = visibleColumns[visibleColumns.length - 2].name;
      // When resizing the last column before waterfall
      // then the compensate column is waterfall
      if (name === compensateHeaderName) {
        compensateHeaderName = "waterfall";
      }
    } else {
      compensateHeaderName = visibleColumns[visibleColumns.length - 1].name;
    }
    const compensateHeaderRef = this.refs[`${compensateHeaderName}Header`];
    const oldCompensateWidth = compensateHeaderRef.clientWidth;

    const sumOfBothColumns = oldWidth + oldCompensateWidth;

    // get minimal widths for both changed columns (in px)
    let minWidth;
    let minCompensateWidth;

    if (columnsData.has(name)) {
      minWidth = (columnsData.get(name)).minWidth;
    }
    if (columnsData.has(compensateHeaderName)) {
      minCompensateWidth = (columnsData.get(compensateHeaderName)).minWidth;
    }

    // Calculate new width (according to the mouse x-position) and set to .style
    // Do not allow to set it below minWidth
    const newWidth = Math.max(x - headerRef.offsetLeft, minWidth);
    headerRef.style.width = `${this.px2percent(newWidth, parentWidth)}%`;

    const diffWidth = oldWidth - newWidth;

    // Calculate new compensate width as the original width + difference
    // Do not allow to set it below minCompensateWidth
    const newCompensateWidth =
      Math.max(diffWidth + oldCompensateWidth, minCompensateWidth);
    compensateHeaderRef.style.width = `${this.px2percent(newCompensateWidth, parentWidth)}%`;

    // Do not allow to reset size of column when compensate column is at minWidth
    if (newCompensateWidth === minCompensateWidth) {
      headerRef.style.width = `${this.px2percent((sumOfBothColumns - newCompensateWidth), parentWidth)}%`;
    }
  }

  // Preference helpers (these might be in shared module)

  /**
   * Convert columnsData (it is a Map) into an array and store in prefs
   */
  storeWidths(columnsData) {
    const array = [...columnsData.values()];
    window.columnsDataPref = JSON.stringify(array);

    const sum = array.reduce((acc, value) => acc + value.width, 0);
    console.log("storeWidths [" +
      array.map(value => value.name + ":" + value.width) +
      "] => " + sum);
  }

  /**
   * Load columns widths from prefs and convert to a Map
   */
  loadWidths() {
    let array;
    try {
      array = JSON.parse(window.columnsDataPref);
    } catch (err) {
      console.log(err, window.columnsDataPref);
      array = defaultColumnsData;
    }

    const sum = array.reduce((acc, value) => acc + value.width, 0);
    console.log("loadWidths [" +
      array.map(value => value.name + ":" + value.width) +
      "] => " + sum);

    return new Map(array.map(i => [i.name, i]));
  }

  renderColumn(header, visibleColumns, lastVisibleColumn) {
    const name = header.name;
    const boxName = header.boxName || name;
    const label = name;

    // Prepare columnsData Map for use
    // The Map has format: name (as key) -> {name, min, width} (as value)
    const columnsData = this.loadWidths();

    const array = [...columnsData.values()];
    const sum = array.reduce((acc, value) => acc + value.width, 0);
    console.log("renderColumn [" +
      array.map(value => value.name + ":" + value.width + " min:" + value.minWidth) +
      "] => " + sum);

    let columnStyle;
    // If the pref for this column width exists, set the style
    if (columnsData.has(name)) {
      const oneColumnEl = columnsData.get(name);
      let colWidth = oneColumnEl.width ?
      oneColumnEl.width : oneColumnEl.minWidth;
      if (!colWidth) {
        colWidth = MIN_COLUMN_WIDTH;
      }
      columnStyle = {
        width: colWidth + "%",
      };
    }

    return (
      <div
        id={`requests-list-${boxName}-header-box`}
        className={`requests-list-column requests-list-header-item requests-list-${boxName}`}
        style={columnStyle}
        key={name}
        ref={`${name}Header`} >
        <button
          id={`requests-list-${name}-button`}
          className={`requests-list-header-button`} >
          <div className={"button-text"}>{label}</div>
        </button>
        {(name !== lastVisibleColumn) &&
          <Draggable
            className="column-resizer"
            onStart= {() => this.onStartMove()}
            onStop= {() => this.onStopMove(columnsData)}
            onMove= {(x, y) => this.onMove(visibleColumns, columnsData, name, x, y)} />}
      </div>
    )
  }

  renderColumns() {
    const { columns } = this.props;
    const visibleColumns = HEADERS.filter((header) => columns[header.name]);
    const lastVisibleColumn = visibleColumns[visibleColumns.length - 1].name;

    return visibleColumns.map(header =>
      this.renderColumn(header, visibleColumns, lastVisibleColumn));
  }

  render() {
    return (
      <div className="devtools-toolbar requests-list-headers-wrapper">
        <div
          className="devtools-toolbar requests-list-headers"
          ref= { node => this.requestListHeader = node}>
            {this.renderColumns()}
        </div>
      </div>
    )
  }
}

export default RequestListHeader;
