# Api

[Readme](../README.md)

## Table of content
- [Config](#config)
- [Get collection](#get-collection)
- [Store / Update](#store-/-update)
- [Desroy](#desroy)
- [Autocomplete](#autocomplete)

## Config

config/crude.php

```php
    /**
     * Route prefix
     * @var string
     */
    'routePrefix' => 'crude',

    /**
     * Routes middleware
     * @var string | array
     */
    'middleware' => ['web', 'auth'],
```

## Get collection

GET `'routePrefix'/api/{crudeName}`

with

```javascript
{
    page:           1,      // integer, page
    numRows:        10,     // integer, number of rows on page
    sortAttr:       'id',   // string, name of attribute
    sortOrder:      'asc',  // string, 'asc' / 'desc'
    searchAttr:     'id',   // string, name of attribute
    searchValue:    ''      // string, part of model value
}
```

response

```javascript
{
    "data":
    {
        "collection": [],
        "pagination": {
            "page":     1,
            "numRows":  20,
            "numPages": 1,      // number of all pages
            "count":    1       // number of all rows
        },
        "sort": {
            "attr":     "id",
            "order":    "asc"
        },
        "search": {
            "attr":     "id",
            "value":    ""
        }
    }
}
```


## Store / Update

POST `'routePrefix'/api/{crudeName}` with new model attributes to store
PUT `'routePrefix'/api/{crudeName}/{id}` with model attributes to update

response

```javascript
{
    "data":
    {
        "model":    {...},  // object, all new model attributes
        "message":  ' '
    }
}
```

or response with validation errors

```javascript
{
    "attrName1":    ["error 1", "error 2" ...],
    "attrName2":    [...],
    ...
}
```

## Desroy

DELETE `'routePrefix'/api/{crudeName}/{id}`

response

```javascript
{
    "data": {
        "message":  'Item has been removed.'
    }
}
```

## Autocomplete

GET `'routePrefix'/autocomplete/get/{crudeName}/{attr}`

with

```javascript
{
    term: '' // string, part of label
}
```

response

```javascript
{
    0: {
        id: "1",            // mixed, first value id
        label: "Label 1"    // string, first value label
    },
    1: {
        ...
    }
    ...
}
```

POST `'routePrefix'/autocomplete/label`

with

```javascript
{
    crudeName:  'name',     // string
    attr:       'attrName', // string, attribute name
    value:      '1'         // string
}
```

return

```javascript
'label' // 'string', label
```