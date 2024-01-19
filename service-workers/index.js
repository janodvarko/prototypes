/* See license.txt for terms of usage */

var reg;

function onRegisterWorker() {
  navigator.serviceWorker.register('service-worker.js')
    .then(function (registration) {
      reg = registration;
      console.log("Registration ", registration);
    })
    .catch(function (e) {
      console.error(e);
    })
}

function onGetSmallImage() {
  fetch("small-image.png?a=1000&b=2000");
}

function onUnregisterWorker() {
  if (reg) {
    reg.unregister();
  }
}

function onExecuteXHR() {
  let sw = reg ? reg.active : null;
  if (!sw && navigator.serviceWorker) {
    sw = navigator.serviceWorker.controller;
  }

  if (sw) {
    sw.postMessage({
      type: 'MY_MESSAGE',
    });
  }
}

function onExecuteConsoleLog() {
  let sw = reg ? reg.active : null;
  if (!sw && navigator.serviceWorker) {
    sw = navigator.serviceWorker.controller;
  }

  if (sw) {
    sw.postMessage({
      type: 'MY_CONSOLE',
    });
  }
}
