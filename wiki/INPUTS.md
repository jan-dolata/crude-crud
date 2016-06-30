# Inputs

[Readme](../README.md)

## Table of content
- [Types](#types)
- [Usage](#usage)

## Types

* text - default
* number
* textarea
* info - text input with 'readonly'
* checkbox
* datetime - powered by bootstrap-datetimepicker
* autocomplete - powered by jquery-ui
* select
* json
* markdown

## Usage

To change input type use `$this->crudeSetup->setTypes()` in crude `__construct`

```php
$this->crudeSetup->setTypes('first_name', 'text');
```

or

```php
$this->crudeSetup->setTypes([
    'last_name' => 'text',
    'points' => 'number',
    'date' => 'datetime',
    'is_active' => 'checkbox'
]);
```

or

```php
$this->crudeSetup->setTypesGroup('text', ['first_name', 'last_name']);
```

or

```php
$this->crudeSetup->setTypesGroup([
    'text' => ['first_name', 'last_name'],
    'number' => 'points'
]);
```

For select add options

```php
$this->crudeSetup
    ->setTypes('status', 'select')
    ->setSelectOptions(
        'status',
        [
            ['id' => 'new', 'label' => 'New'],
            ['id' => 'public', 'label' => 'Public']
        ]
    );
```

or

```php
$this->crudeSetup
    ->setTypes('status', 'select')
    ->setSelectOptions([
        'status' => [
            ['id' => 'new', 'label' => 'New'],
            ['id' => 'public', 'label' => 'Public']
        ]
    ]);
```

For autocomplete add methods

```php
public function autocompleteAttrName($term)
{
    return (new \App\ModelName)
        ->where('label_attr_name', 'like', '%' . $term . '%')
        ->select(
            'attr_name_in_model' as 'id',
            'label_attr_name' as 'label'
        )
        ->take(10)
        ->get();
}

public function labelAttrName($id)
{
    $label = (new \App\ModelName)
        ->where('attr_name', $id)
        ->value('label_attr_name');

    return empty($label) ? '' : $label;
}
```

Example:
```php
public function autocompleteBookId($term)
{
    return (new \App\Book)
        ->where('title', 'like', '%' . $term . '%')
        ->select(
            'id' as 'id',
            'title' as 'label'
        )
        ->take(10)
        ->get();
}

public function labelAttrName($id)
{
    $label = (new \App\Book)
        ->where('id', $id)
        ->value('title');

    return empty($label) ? '' : $label;
}
```
