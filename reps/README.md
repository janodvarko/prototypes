Rep Tester
==========
This tool is intended as simple <b>Reps</b> tester. It connects to the backend
runnning in <i>this</i> browser. It attaches to the first tab running in this
browser so, make sure this page is <i>not</i> the first tab otherwise it
would attach to itself and cause the browser to freeze. This is known limitation
and it'll be fixed later.

The common scenario is:
1. Launch Firefox and open this tool twice in two tabs
2. Select the second tab and connect to the first one


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
        + reps
```

* `devtools` Root directory for Firefox built-in devtools
* `reps` Root directory for this prototype

Webpack config is using the following alias (see `webpack.config` file):

"devtools" => "../../../../mozilla.org/fx-team/devtools"

This allows requiring devtools modules as follows:

`require("devtools/client/shared/components/tabs/sidebar");`

See also [sidebar.html](https://github.com/janodvarko/prototypes/blob/master/sidebar.html/README.md)

Run
---
1. `npm install`
2. `webpack`
3. Load `index.html` in Firefox
4. Follow instructions on the page
