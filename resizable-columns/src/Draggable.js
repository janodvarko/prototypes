/* See license.txt for terms of usage */

import { Component, createRef } from 'react';
import dom from 'react-dom-factories';

class Draggable extends Component {
  constructor(props) {
    super(props);

    this.draggableEl = createRef();

    this.startDragging = this.startDragging.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onUp = this.onUp.bind(this);
  }

  startDragging(ev) {
    if (this.isDragging) {
      return;
    }
    this.isDragging = true;

    ev.preventDefault();
    const doc = this.draggableEl.current.ownerDocument;
    doc.addEventListener("mousemove", this.onMove);
    doc.addEventListener("mouseup", this.onUp);
    this.props.onStart && this.props.onStart();
  }

  onMove(ev) {
    if (!this.isDragging) {
      return;
    }

    ev.preventDefault();
    // Use viewport coordinates so, moving mouse over iframes
    // doesn't mangle (relative) coordinates.
    this.props.onMove(ev.clientX, ev.clientY);
  }

  onUp(ev) {
    if (!this.isDragging) {
      return;
    }
    this.isDragging = false;

    ev.preventDefault();
    const doc = this.draggableEl.current.ownerDocument;
    doc.removeEventListener("mousemove", this.onMove);
    doc.removeEventListener("mouseup", this.onUp);
    this.props.onStop && this.props.onStop();
  }

  render() {
    return dom.div({
      ref: this.draggableEl,
      role: "presentation",
      style: this.props.style,
      className: this.props.className,
      onMouseDown: this.startDragging,
    });
  }
}

export default Draggable;
