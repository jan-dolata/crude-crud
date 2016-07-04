# crude-crud

[![Latest Version on Packagist][ico-version]][link-packagist]
[![Software License][ico-license]](LICENSE.md)
[![Build Status][ico-travis]][link-travis]
[![Coverage Status][ico-scrutinizer]][link-scrutinizer]
[![Quality Score][ico-code-quality]][link-code-quality]
[![Total Downloads][ico-downloads]][link-downloads]

# Table of content
- [Install](#install)
- [Usage](#usage)
- [wiki Inputs](wiki/INPUTS.md)
- [wiki Api](wiki/API.md)
- [wiki Tutorials](wiki/TUTORIALS.md)
- [wiki Crude setup](wiki/CRUDE_SETUP.md)
- [wiki Interfaces](wiki/INTERFACES.md)
- [wiki Work with model](wiki/WORKWITHMODEL.md)
- [wiki Style](wiki/STYLE.md)
- [wiki Ordered list](wiki/ORDERED_LIST.md)
- [wiki Helpers](wiki/HELPERS.md)

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

```php
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

## Change log

Please see [CHANGELOG](CHANGELOG.md) for more information what has changed recently.

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
