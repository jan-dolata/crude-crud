# crude-crud

[![Latest Version on Packagist][ico-version]][link-packagist]
[![Software License][ico-license]](LICENSE.md)
[![Build Status][ico-travis]][link-travis]
[![Coverage Status][ico-scrutinizer]][link-scrutinizer]
[![Quality Score][ico-code-quality]][link-code-quality]
[![Total Downloads][ico-downloads]][link-downloads]

## Install

Via Composer

``` bash
$ composer require jan-dolata/crude-crud
```

Add ServiceProvider to `config/app`.

```
JanDolata\CrudeCRUD\CrudeCRUDServiceProvider::class
```

Publish and migrate

``` bash
$ php artisan vendor:publish --provider="JanDolata\CrudeCRUD\CrudeCRUDServiceProvider"
$ php artisan migrate
```

Check config file `config/crude.php`.

## Usage

create dir
`app/Engine/Crude`

create model with migration, if model is related to files include

```php
$table->text('files');
```

if model is related to map

```php
$table->double('lat', 17, 14);
$table->double('lng', 17, 14);
$table->string('address');
```

in app/Engine/Crude directory create class for list

```php
<?php

namespace App\Engine\Crude;

use Crude;
use CrudeListInterface;
use CrudeFromModelTrait;

class ListName extends Crude implements
    CrudeListInterface
{

    use CrudeFromModelTrait;

    public function __construct()
    {
        $this->setModel(new \App\Engine\Models\ModelName);

        $this->prepareCrudeSetup();
    }

}
```

in controller action

```php
return view('viewName', [
    'crudeSetup' => [(new \App\Engine\Crude\ListName)->getCrudeSetupData()]
]);
```

in view

```
@include('CrudeCRUD::start')
```

it works.

=============

You can change attribute names in `resources/lang/en/validation.php` files

```php
'attributes' => [
    'id' => 'id attribute name'
],
```

to add ability to store implement interface

`CrudeStoreInterface`

setting title, types and columns

```
$this->crudeSetup
    ->setTitle(trans('titles.admin_district'))
    ->setTypes(['province' => 'autocomplete'])
    ->setColumn(['id', 'name', 'province', 'points', 'created_at'])
    ;
```

to turn on validation implement interface

`CrudeWithValidationInterface`

and use trait

```php
use CrudeWithValidationTrait;
```

define validation rules

```php
$this->setValidationRules([
    'name' => 'required',
    'province' => 'required'
]);
```

to update implement interface

`CrudeUpdateInterface`

to delete interface

`CrudeDeleteInterface`

to join data to list or add aliases to attribute names

```php
public function prepareQuery()
{
    return $this->model
        ->select(
            'districts.id',
            'districts.name',
            'districts.province',
            'districts.points',
            'districts.created_at',
            'districts.updated_at'
        );
}
```

## Api

### Get collection

GET `'routePrefix'/api/{crudeName}`

with

```json
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

```json
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


### Store / Update

POST `'routePrefix'/api/{crudeName}` with new model attributes to store
PUT `'routePrefix'/api/{crudeName}/{id}` with model attributes to update

response

```json
{
    "data":
    {
        "model":    {...},  // object, all new model attributes
        "message":  ' '
    }
}
```

or response with validation errors

```json
{
    "attrName1":    ["error 1", "error 2" ...],
    "attrName2":    [...],
    ...
}
```

### Desroy

DELETE `'routePrefix'/api/{crudeName}/{id}`

response

```json
{
    "data": {
        "message":  'Item has been removed.'
    }
}
```

### Autocomplete

GET `'routePrefix'/autocomplete/get/{crudeName}/{attr}`

with

```json
{
    term: '' // string, part of label
}
```

response

```json
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

```json
{
    crudeName:  'name',     # string
    attr:       'attrName', # string, attribute name
    value:      '1'         # string
}
```

return

```json
'label' // 'string', label
```

## Change log

Please see [CHANGELOG](CHANGELOG.md) for more information what has changed recently.

## Testing

``` bash
$ composer test
```

## Contributing

Please see [CONTRIBUTING](CONTRIBUTING.md) and [CONDUCT](CONDUCT.md) for details.

## Security

If you discover any security related issues, please email jan.dolata.gd@gmail.com instead of using the issue tracker.

## Credits

- [Jan Dolata][link-author]
- [All Contributors][link-contributors]

## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.

[ico-version]: https://img.shields.io/packagist/v/jan-dolata/crude-crud.svg?style=flat-square
[ico-license]: https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square
[ico-travis]: https://img.shields.io/travis/jan-dolata/crude-crud/master.svg?style=flat-square
[ico-scrutinizer]: https://img.shields.io/scrutinizer/coverage/g/jan-dolata/crude-crud.svg?style=flat-square
[ico-code-quality]: https://img.shields.io/scrutinizer/g/jan-dolata/crude-crud.svg?style=flat-square
[ico-downloads]: https://img.shields.io/packagist/dt/jan-dolata/crude-crud.svg?style=flat-square

[link-packagist]: https://packagist.org/packages/jan-dolata/crude-crud
[link-travis]: https://travis-ci.org/jan-dolata/crude-crud
[link-scrutinizer]: https://scrutinizer-ci.com/g/jan-dolata/crude-crud/code-structure
[link-code-quality]: https://scrutinizer-ci.com/g/jan-dolata/crude-crud
[link-downloads]: https://packagist.org/packages/jan-dolata/crude-crud
[link-author]: https://github.com/jan-dolata
[link-contributors]: ../../contributors
