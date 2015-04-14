/* See license.txt for terms of usage */

// Add-on SDK
const self = require("sdk/self");
const { Cc, Ci, Cu } = require("chrome");
const { Class } = require("sdk/core/heritage");
const { Unknown } = require("sdk/platform/xpcom");
const Events = require("sdk/dom/events");
const Clipboard = require("sdk/clipboard");
const { getMostRecentBrowserWindow } = require("sdk/window/utils");

// Platform
const { Services } = Cu.import("resource://gre/modules/Services.jsm", {});
const { devtools } = Cu.import("resource://gre/modules/devtools/Loader.jsm", {});
const NetworkHelper = devtools.require("devtools/toolkit/webconsole/network-helper");
const { gDevTools } = Cu.import("resource:///modules/devtools/gDevTools.jsm", {});

// Firebug SDK
const { Locale } = require("firebug.sdk/lib/core/locale.js");
const { Content } = require("firebug.sdk/lib/core/content.js");

/**
 * xxxHonza TODO docs
 */
var Convertor = Class(
/** @lends Convertor */
{
  extends: Unknown,

  interfaces: [
    "nsIStreamConverter",
    "nsIStreamListener",
    "nsIRequestObserver"
  ],

  get wrappedJSObject() this,

  initialize: function() {
    this.onPrefChanged = this.onPrefChanged.bind(this);

    gDevTools.on("pref-changed", this.onPrefChanged);
  },

  destroy: function() {
    gDevTools.off("pref-changed", this.onPrefChanged);
  },

  // Preferences

  onPrefChanged: function(event, data) {
    if (data.pref != "devtools.theme") {
      return;
    }

    // xxxHonza: update opened windows.
  },

  /**
   * This component works as such:
   * 1. asyncConvertData captures the listener
   * 2. onStartRequest fires, initializes stuff, modifies the listener to match our output type
   * 3. onDataAvailable transcodes the data into a UTF-8 string
   * 4. onStopRequest gets the collected data and converts it, spits it to the listener
   * 5. convert does nothing, it's just the synchronous version of asyncConvertData
   */
  convert: function(aFromStream, aFromType, aToType, aCtxt) {
    return aFromStream;
  },

  asyncConvertData: function(aFromType, aToType, aListener, aCtxt) {
    this.listener = aListener;
  },

  onDataAvailable: function(aRequest, aContext, aInputStream, aOffset, aCount) {
    // From https://developer.mozilla.org/en/Reading_textual_data
    var is = Cc["@mozilla.org/intl/converter-input-stream;1"].
      createInstance(Ci.nsIConverterInputStream);
    is.init(aInputStream, this.charset, -1,
      Ci.nsIConverterInputStream.DEFAULT_REPLACEMENT_CHARACTER);

    // This used to read in a loop until readString returned 0, but it caused
    // it to crash Firefox on OSX/Win32 (but not Win64)
    // It seems just reading once with -1 (default buffer size) gets the file done.
    // However, *not* reading in a loop seems to cause problems with Firebug
    // So I read in a loop, but do whatever I can to avoid infinite-looping.
    var totalBytesRead = 0;

    // Seed it with something positive
    var bytesRead = 1;

    while (totalBytesRead < aCount && bytesRead > 0) {
      var str = {};
      bytesRead = is.readString(-1, str);
      totalBytesRead += bytesRead;
      this.data += str.value;
    }
  },

  onStartRequest: function(aRequest, aContext) {
    this.data = "";
    this.uri = aRequest.QueryInterface(Ci.nsIChannel).URI.spec;

    // Sets the charset if it is available. (For documents loaded from the
    // filesystem, this is not set.)
    this.charset = aRequest.QueryInterface(Ci.nsIChannel).contentCharset || 'UTF-8';

    this.channel = aRequest;
    this.channel.contentType = "text/html";
    this.channel.contentCharset = "UTF-8";

    this.listener.onStartRequest(this.channel, aContext);
  },

  /**
   * This should go something like this:
   * 1. Make sure we have a unicode string.
   * 2. Convert it to a Javascript object.
   * 2.1 Removes the callback
   * 3. Convert that to HTML? Or XUL?
   * 4. Spit it back out at the listener
   */
  onStopRequest: function(aRequest, aContext, aStatusCode) {
    let outputDoc = "";
    let cleanData = "";
    let callback = "";

    let headers = {
      request: [],
      response: []
    }

    if (!(aRequest instanceof Ci.nsIHttpChannel)) {
      return;
    }

    let win = NetworkHelper.getWindowForRequest(aRequest);
    Content.exportIntoContentScope(win, Locale, "Locale");

    Events.once(win, "DOMContentLoaded", event => {
      Cu.exportFunction(this.postChromeMessage, win, {
        defineAs: "postChromeMessage"
      });
    })

    // This regex attempts to match a JSONP structure:
    //    * Any amount of whitespace (including unicode nonbreaking spaces) between the start of the file and the callback name
    //    * Callback name (any valid JavaScript function name according to ECMA-262 Edition 3 spec)
    //    * Any amount of whitespace (including unicode nonbreaking spaces)
    //    * Open parentheses
    //    * Any amount of whitespace (including unicode nonbreaking spaces)
    //    * Either { or [, the only two valid characters to start a JSON string.
    //    * Any character, any number of times
    //    * Either } or ], the only two valid closing characters of a JSON string.
    //    * Any amount of whitespace (including unicode nonbreaking spaces)
    //    * A closing parenthesis, an optional semicolon, and any amount of whitespace (including unicode nonbreaking spaces) until the end of the file.
    // This will miss anything that has comments, or more than one callback, or requires modification before use.
    var callback_results = /^[\s\u200B\uFEFF]*([\w$\[\]\.]+)[\s\u200B\uFEFF]*\([\s\u200B\uFEFF]*([\[{][\s\S]*[\]}])[\s\u200B\uFEFF]*\);?[\s\u200B\uFEFF]*$/.exec(this.data);
    if (callback_results && callback_results.length == 3) {
      callback = callback_results[1];
      cleanData = callback_results[2];
    } else {
      cleanData = this.data;
    }

    aRequest.visitRequestHeaders({
      visitHeader: function(name, value) {
        headers.request.push({name: name, value: value});
      }
    });

    aRequest.visitResponseHeaders({
      visitHeader: function(name, value) {
        headers.response.push({name: name, value: value});
      }
    });

    try {
      headers = JSON.stringify(headers);
      outputDoc = this.toHTML(cleanData, headers, this.uri);
    } catch (e) {
      outputDoc = this.toErrorPage(e, this.data, this.uri);
    }

    // I don't really understand this part, but basically it's a way to get our UTF-8 stuff
    // spit back out as a byte stream
    // See http://www.mail-archive.com/mozilla-xpcom@mozilla.org/msg04194.html
    var storage = Cc["@mozilla.org/storagestream;1"].createInstance(Ci.nsIStorageStream);

    // I have no idea what to pick for the first parameter (segments)
    storage.init(4, 0xffffffff, null);
    var out = storage.getOutputStream(0);

    var binout = Cc["@mozilla.org/binaryoutputstream;1"]
      .createInstance(Ci.nsIBinaryOutputStream);

    binout.setOutputStream(out);
    binout.writeUtf8Z(outputDoc);
    binout.close();

    // I can't explain it, but we need to trim 4 bytes off the front or
    // else it includes random crap
    var trunc = 4;
    var instream = storage.newInputStream(trunc);

    // Pass the data to the main content listener
    this.listener.onDataAvailable(this.channel, aContext, instream, 0,
      storage.length - trunc);

    this.listener.onStopRequest(this.channel, aContext, aStatusCode);
  },

  htmlEncode: function(t) {
    return t !== null ? t.toString().replace(/&/g,"&amp;").
      replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;") : '';
  },

  toHTML: function(json, headers, title) {
    var domStyle = self.data.url(
      "../node_modules/firebug.sdk/skin/classic/shared/domTree.css");
    var themeClassName = "theme-" + getCurrentTheme();

    return '<!DOCTYPE html>\n' +
      '<html><head><title>' + this.htmlEncode(title) + '</title>' +
      '<base href="' + self.data.url() + '">' +
      '<link rel="stylesheet" type="text/css" href="css/main.css">' +
      '<link rel="stylesheet" type="text/css" href="chrome://browser/skin/devtools/light-theme.css">' +
      '<link rel="stylesheet" type="text/css" href="' + domStyle + '">' +
      '<script data-main="config" src="lib/requirejs/require.js"></script>' +
      '</head><body class="' + themeClassName + '">' +
      '<div id="content"></div>' +
      '<div id="json">' + json + '</div>' +
      '<div id="headers">' + headers + '</div>' +
      '</body></html>';
  },

  toErrorPage: function(error, data, uri) {
    // Escape unicode nulls
    data = data.replace("\u0000", "\uFFFD");

    var errorInfo = this.massageError(error);

    var output = '<div id="error">' + _('errorParsing')
    if (errorInfo.message) {
      output += '<div class="errormessage">' + errorInfo.message + '</div>';
    }

    output += '</div><div id="json">' + this.highlightError(data,
      errorInfo.line, errorInfo.column) + '</div>';

    return '<!DOCTYPE html>\n' +
      '<html><head><title>' + this.htmlEncode(uri + ' - Error') + '</title>' +
      '<base href="' + self.data.url() + '">' +
      '</head><body>' +
      output +
      '</body></html>';
  },

  // Chrome <-> Content communication

  postChromeMessage: function(type, args, objects) {
    var value = args;

    switch (type) {
    case "copy":
      Clipboard.set(value, "text");
      break;

    case "save":
      let file = getTargetFile();
      if (file) {
        saveToFile(file, value);
      }
    }
  },
});

// Helpers

// Open File Save As dialog and let the user to pick proper file location.
function getTargetFile() {
  var fp = Cc["@mozilla.org/filepicker;1"].createInstance(Ci.nsIFilePicker);

  var win = getMostRecentBrowserWindow();
  fp.init(win, null, Ci.nsIFilePicker.modeSave);
  fp.appendFilter("JSON Files","*.json; *.jsonp;");
  fp.appendFilters(Ci.nsIFilePicker.filterText);
  fp.appendFilters(Ci.nsIFilePicker.filterAll);
  fp.filterIndex = 0;

  var rv = fp.show();
  if (rv == Ci.nsIFilePicker.returnOK || rv == Ci.nsIFilePicker.returnReplace) {
    return fp.file;
  }

  return null;
}

function saveToFile(file, jsonString) {
  var foStream = Cc["@mozilla.org/network/file-output-stream;1"].
    createInstance(Ci.nsIFileOutputStream);

  // write, create, truncate
  foStream.init(file, 0x02 | 0x08 | 0x20, 0666, 0);

  var convertor = Cc["@mozilla.org/intl/converter-output-stream;1"].
    createInstance(Ci.nsIConverterOutputStream);

  convertor.init(foStream, "UTF-8", 0, 0);

  // The entire jsonString can be huge so, write the data in chunks.
  var chunkLength = 1024*1204;
  for (var i=0; i<=jsonString.length; i++) {
    var data = jsonString.substr(i, chunkLength+1);
    if (data) {
      convertor.writeString(data);
    }
    i = i + chunkLength;
  }

  // this closes foStream
  convertor.close();
}

function getCurrentTheme() {
  return Services.prefs.getCharPref("devtools.theme");
}

// Exports from this module
exports.Convertor = Convertor;
