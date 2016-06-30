# Crude setup

[Readme](../README.md)

## Table of content
- [Column](#column)
- [Filters](#filters)
- [Trans](#trans)
- [Module in popup](#module-in-popup)

## Column

Select which attributes are displayed in the list and in what order.

Example:
```php
    $this->crudeSetup
        ->setColumn(['id', 'name', 'email', 'created_at']);
```

Attributes of the columns can be placed one above the other.

Example:
```php
    $this->crudeSetup
        ->setColumn(['id', ['name', 'email'], 'created_at']);
```

The list can be sorted by all the attributes in columns. Make sure you set up the scope array.

Example:
```php
    public function __construct()
    {
        ...
        $this->crudeSetup->setColumn(['id', 'title', 'owner_name']);
        ...
    }

    public function prepareQuery()
    {
        $this->scope['owner_name'] = 'users.name';

        return $this->model
            ->leftJoin('users', 'books.owner_id', '=', 'users.id')
            ->select('books.id', 'books.title', 'users.name as owner_name');
    }
```

If you want to change the pre-set columns pass a new array,
or use methods to `hideColumn`.

Example:
```php
    $this->crudeSetup->setColumn(['id', ['name', 'email'], 'created_at']);
    // current column: ['id', ['name', 'email'], 'created_at']
    $this->crudeSetup->hideColumn('id');
    // current column: [['name', 'email'], 'created_at']
    $this->crudeSetup->hideColumn(['email', 'created_at']);
    // current column: ['name']
```

To get current column attributes use `getColumn` or `getColumnAttr`.

Example:
```php
    $this->crudeSetup->setColumn(['id', ['name', 'email'], 'name']);
    $attr = $this->crudeSetup->getColumn();
    // $attr =  ['id', ['name', 'email'], 'name']
    $attr = $this->crudeSetup->getColumnAttr();
    // $attr = ['id', 'name', 'email']
```

## Filters

Filters attributes will fill list in search box under the table.
After `prepareCrudeSetup()` when `FromModelTrait` is used, filters have `'id'` attribute. Also, filters in result of `getCrudeSetupData()` will contain all column attributes.

Example:
```php
    $this->crudeSetup->resetFilters();
    // current filters: []
    $this->crudeSetup->setFilters('name');
    // current filters: ['name']
    $this->crudeSetup->setFilters(['email', 'phone']);
    // current filters: ['email', 'phone']
    $this->crudeSetup->setFilters(['email', 'phone', 'age', 'phone']);
    // current filters: ['email', 'phone', 'age']
    $this->crudeSetup->resetFilters(['id', 'name']);
    // current filters: ['id', 'name']
```

## Trans

Change default attribute names in `resources/lang/en/validation.php` files.

Example:
```php
    'attributes' => [
        'id' => 'ID',
        'created_at' => 'Created at',
        'updated_at' => 'Updated at',
        ...
    ]
```

or add custome attributes name

```php
    $this->crudeSetup
        ->setTrans('id', 'ID')
        ->setTrans([
            'name' => 'First name',
            'created_at' => 'Start date'
        ]);
```

## Module in popup

If you want to change the method of displaing forms to pop-ups use

```php
    $this->crudeSetup->usePopup()
```

or

```php
    $this->crudeSetup->setModuleInPopup(true)
```

