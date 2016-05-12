Sidebar.html
============
This is a simple prototype app intended for developing and testing
a new Sidebar React component used in Firefox Developer Tools.
See also [bug 1259819](https://bugzilla.mozilla.org/show_bug.cgi?id=1259819)

The prototype consists of a simple web application bundled with
Webpack. The app uses webpack configuration file that
allows loading React component directly from Mozilla Firefox
source tree (must be locally cloned from
[hg](http://hg.mozilla.org/integration/fx-team) or
[git](https://github.com/mozilla/gecko-dev/tree/fx-team)).

Concept used in this prototype allows a lot faster development
process since React components can be loaded directly into
a web page reloaded using page-refresh and no Firefox rebuild and
restart is needed. Other things like hot module replacement can
yet supplement it.

Source Directory Structure
--------------------------
Since this app loads sources directly from Firefox repo, paths
must be properly inline.

Here is how it works in this particular scenario:

```
<root>
  - mozilla.org
    - fx-team
      + devtools
  - github.com
    - janodvarko
      - prototypes
        + sidebar.html
```

* `devtools` Root directory for Firefox built-in devtools
* `sidebar.html` Root directory for this prototype

Webpack config is using the following alias (see `webpack.config` file):

"devtools" => "../../../../mozilla.org/fx-team/devtools"

This allows requiring devtools modules as follows:

`require("devtools/client/shared/components/tabs/sidebar");`

Loading CSS files from `devtools` directory is done as follows
(see `index.html` file):


`../../../../mozilla.org/fx-team/devtools/client/themes/variables.css`


Don't use `chrome://` protocol to load CSS files since changes made
in these files would not be accessible without Firefox rebuild.

Note: search for `../mozilla.org` to see where to change the path
in the prototype if you need to.


Comments
--------
A few more notes about the config:

* React modules are included in `index.html` and marked as external
in `webpack.config`. This makes the bundling process a bit faster.
* Modules coming from the `devtools` directory are not compiled by Babel.
