# Crude setup

[Readme](../README.md)

## Table of content
- [Trans](#trans)

## Trans

Change default attribute names in `resources/lang/en/validation.php` files.

Example:
```php
    'attributes' => [
        'id' => 'ID',
        'created_at' => 'Created at',
        'updated_at' => 'Updated at',
        ...
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

