# Style

[Readme](../README.md)

## Table of content
- [scss](#scss)
- [Templates](#templates)

## scss

Default style .scss

resources/assets/sass/grid.scss

To change style prepare css with classes:
- crude-container
- crude-box
..- crude-header
....- crude-header-title
..- crude-module
..- crude-alert-container
....- crude-alert
..- crude-list
....- crude-table
......- crude-table-head
........- crude-table-head-row
..........- crude-table-head-cell
......- crude-table-body
........- crude-table-body-row (&active)
..........- crude-table-body-cell,
......- crude-table-foot
- crude-modal
..- modal-content
....- modal-header
....- modal-body
......- content
......- crude-modal
....- modal-footer
- crude-action-btn

## Templates

!!! Place new template before `@include('CrudeCRUD::start')`.

To change content of any button, just overwrite one of templates

resources/views/action-button.blade.php


