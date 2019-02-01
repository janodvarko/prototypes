# Resizable Columns Prototype

## Instructions

Install all dependencies: `npm install`
Runs the app: `npm start`
Open http://localhost:3000 to view it in the browser.

## Comments

* Do not set state in onStartMove
* Inserting thead at the right position immediately fixed the 100% header size
* position:absolute removed from .requests-list-contents
* Using `width` not `minWidth`
* min-width set to 15px for all columns in CSS (look for .requests-list-header-item)
