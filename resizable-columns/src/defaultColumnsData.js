/* See license.txt for terms of usage */

// Minimal width of column in %
export const MIN_COLUMN_WIDTH = 5;

export const defaultColumnsData = [
  {
    name: "status",               // Name of the related column
    minWidth: MIN_COLUMN_WIDTH,   // Minimum width of the column (the user can set)
    width: 5,                     // Default width of the column
  }, {
    name: "method",
    minWidth: MIN_COLUMN_WIDTH,
    width: 5,
  }, {
    name: "domain",
    minWidth: MIN_COLUMN_WIDTH,
    width: 10,
  }, {
    name: "file",
    minWidth: MIN_COLUMN_WIDTH,
    width: 25,
  }, {
    name: "cause",
    minWidth: MIN_COLUMN_WIDTH,
    width: 10,
  }, {
    name: "type",
    minWidth: MIN_COLUMN_WIDTH,
    width: 5,
  }, {
    name: "transferred",
    minWidth: MIN_COLUMN_WIDTH,
    width: 10,
  }, {
    name: "contentSize",
    minWidth: MIN_COLUMN_WIDTH,
    width: 5,
  }, {
    name: "waterfall",
    minWidth: MIN_COLUMN_WIDTH,
    width: 25,
  },
];
