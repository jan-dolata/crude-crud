# Interfaces

[Readme](../README.md)

## Table of content
- [About](#about)
- [Usage](#usage)
- [Example](#example)

## About

This option allows you to manage the sequence of elements.

Above the table displays a button that opens modal, in which using drag and drop, you can set the order of items.

After store and delete model, all orders will be recalculate.

## Usage

First of all, class should implements `CrudeOrderInterface`.

All methods are in `CrudeFromModelTrait`.

The model must have a numeric attribute, to keep order.

In class `__construct` place (after `$this->prepareCrudeSetup()`)

```php
$this->crudeSetup->useOrderedList('label_attribute_name', 'order_attribute_name', 'id_attribute_name');
```

Default values:
* `id` for id attribute name,
* `order` for order attribute name,
* `name` for label attribute name.

Also `useOrderedList()` will add `order` column in table (on first place).

You can disable the option by calling `$this->crudeSetup->lockOrderOption()` (after `useOrderedList()`).

Change new item place by calling `$this->storeInFirstPlace();` in class `__construct`.

# Example

```php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class District extends Model
{
    protected $fillable = [
        'title',
        // you don't need order attribute name here
        // if you add it in here,
        // correct the attributes of the columns and forms in crude class
    ];
}
```

```php

use Auth;

class BooksList extends \Crude implements
    \CRUDInterface,
    \CrudeOrderInterface
{
    use \CrudeFromModelTrait;

    public function __construct()
    {
        $this->setModel(new \App\Models\Book);

        $this->prepareCrudeSetup();

        $this->crudeSetup
            ->setTitle('List of books')
            ->setTrans([
                'id' => 'Id',
                'title' => 'Title',
                'order' => '#'
            ])
            ->setColumnFormat([
                'title' => 'longtext'
            ])

            ->setColumn(['id', 'title'])
            // you don't need this,
            // ['id', 'title'] is default column value (dependent of model $fillable),
            // but if you use this method,
            // make sure that value does not contain order attribute name

            ->setAddAndEditForm(['title'])
            // you don't need this,
            // ['title'] is default form value (dependent of model $fillable),
            // but if you use this method,
            // make sure that value does not contain order attribute name

            ->useOrderedList('title')
            // after that the table contains three columns
            // ['order', 'id', 'title']
            // 'order' is default attribute name, to change use
            // ->useOrderedList('title', 'order_attribute_name')
            ;

        // new item will store in first place
        $this->storeInFirstPlace();

        if (Auth:user()->cannotOrderListOfBooks())
            $this->crudeSetup->lockOrderOption();
    }

    public function prepareQuery()
    {
        return $this->model->select('id', 'title', 'order');
    }
}

```

Result:

![ordered_list/1.png](/ordered_list/1.png "List")

![ordered_list/2.png](/ordered_list/2.png "Order modal")

![ordered_list/3.png](/ordered_list/3.png "Change order")

![ordered_list/4.png](/ordered_list/4.png "After save")