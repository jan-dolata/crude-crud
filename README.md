# crude-crud

[![Latest Version on Packagist][ico-version]][link-packagist]
[![Software License][ico-license]](LICENSE.md)
[![Build Status][ico-travis]][link-travis]
[![Coverage Status][ico-scrutinizer]][link-scrutinizer]
[![Quality Score][ico-code-quality]][link-code-quality]
[![Total Downloads][ico-downloads]][link-downloads]

[Full documentation](https://jan-dolata.github.io/)

# Table of content
- [Install](#install)
- [Usage](#usage)

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

## Example

Part of create books table migration

```php
    public function up()
    {
        Schema::create('books', function (Blueprint $table) {
            $table->increments('id');
            $table->string('tile');
            $table->integer('order');
            $table->timestamps();
        });
    }
```
```php
namespace App\Models;

class Book extends \Illuminate\Database\Eloquent\Model
{
    protected $fillable = ['title'];
}
```

```php
use Auth;

class BooksList extends \Crude implements \CRUDInterface, \CrudeOrderInterface
{
    use \CrudeFromModelTrait;

    public function __construct()
    {
        $this->setModel(new \App\Models\Book);

        $this->prepareCrudeSetup();

        $this->crudeSetup
            ->setTitle('List of books')
            ->setTrans(['id' => 'Id', 'title' => 'Title', 'order' => '#'])
            ->setColumnFormat('title', 'longtext');

        $this->storeInFirstPlace();

        if (! Auth:user()->cannotOrderListOfBooks())
            $this->crudeSetup->useOrderedList('title');
    }
}
```

![/wiki/ordered_list/1.png](/example.png "List")

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
