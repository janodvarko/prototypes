# Resizable Columns Prototype

## Instructions

Install all dependencies: `npm install`
Runs the app: `npm start`
Open http://localhost:3000 to view it in the browser.

## Comments

* Inserting thead at the right position immediately fixed the 100% header size
* position:absolute removed from .requests-list-contents
* Using `width` not `minWidth`
* min-width set to 15px for all columns in CSS (look for .requests-list-header-item)

[02-01-19]
* changed css:
- removed width: 100px from .requests-list-column
- removed !important from .requests-list-header-item min-width
- removed padding-inline-start: 16px from .requests-list-header-button 
- min-width doesn't work in table-layout:fixed, so we pass columnsData into onMove() to take care of min-width

* changed onStopMove():
- to use parent <div> width for calculation px2%

* changed onMove():
- to use parent <div> width for calculation
- to read minWidth and minCompensateWidth from columnsData and adjust resizing of columns to take min widths into account
- changed the resize logic a bit

* const defaultColumnsData has now miWidth set in pixels. All columns have 30px, waterfall has 150px
