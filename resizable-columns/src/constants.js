/* See license.txt for terms of usage */

export const RESPONSE_HEADERS = [
  "Cache-Control",
  "Connection",
  "Content-Encoding",
  "Content-Length",
  "ETag",
  "Keep-Alive",
  "Last-Modified",
  "Server",
  "Vary",
];

export const HEADERS = [
  {
    name: "status",
    label: "status3",
    canFilter: true,
    filterKey: "status-code",
  },
  {
    name: "method",
    canFilter: true,
  },
  {
      name: "domain",
      canFilter: true,
  },
  {
    name: "file",
    canFilter: false,
  },
  {
    name: "protocol",
    canFilter: true,
  },
  {
    name: "scheme",
    canFilter: true,
  },
  {
    name: "remoteip",
    canFilter: true,
    filterKey: "remote-ip",
  },
  {
    name: "cause",
    canFilter: true,
  },
  {
    name: "type",
    canFilter: false,
  },
  {
    name: "cookies",
    canFilter: false,
  },
  {
    name: "setCookies",
    boxName: "set-cookies",
    canFilter: false,
  },
  {
    name: "transferred",
    canFilter: true,
  },
  {
    name: "contentSize",
    boxName: "size",
    filterKey: "size",
    canFilter: true,
  },
  {
    name: "startTime",
    boxName: "start-time",
    canFilter: false,
    subMenu: "timings",
  },
  {
    name: "endTime",
    boxName: "end-time",
    canFilter: false,
    subMenu: "timings",
  },
  {
    name: "responseTime",
    boxName: "response-time",
    canFilter: false,
    subMenu: "timings",
  },
  {
    name: "duration",
    canFilter: false,
    subMenu: "timings",
  },
  {
    name: "latency",
    canFilter: false,
    subMenu: "timings",
  },
  ...RESPONSE_HEADERS
    .map(header => ({
      name: header,
      boxName: "response-header",
      canFilter: false,
      subMenu: "responseHeaders",
      noLocalization: true,
    })),
  {
    name: "waterfall",
    canFilter: false,
  },
];
