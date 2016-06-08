# Work with model

[Readme](../README.md)

## Table of content
- [Trait](#trait)
- [Prepare list](#prepare-list)
- [Custome Store / Update method](#custome-store-/-update-method)
- [Permissions](#permissions)

## Trait

Use `CrudeFromModelTrait` to speed up creating new list.

Example:
```php
    <?php

    namespace App\Crude;

    class Book extends \Crude implements \CrudeCRUDInterface
    {
        use \CrudeFromModelTrait;

        public function __construct()
        {
            $this->setModel(new App\Models\Book);
            $this->prepareCrudeSetup();
        }
    }
```

## Prepare list

To filter or change list item, just overwrite the method `prepareQuery()`.
Method `prepareQuery()` should return query.

Example:
```php
    public function prepareQuery()
    {
        return $this->model->where('status', 'active')->select('id');
    }
```

To change collection or model, just overwrite methods:
- `formatCollection($collection)`,
- `formatModel($model)`.

Example:
```php
    public function formatModel($model)
    {
        $model->formated_name = $model->id . ': ' . $model->name;
        return $model;
    }
```

## Custome Store / Update method

To change attributes before add or edit new model, just overwrite methods:
- `formatStoreAttributes($attributes)`,
- `formatUpdateAttributes($attributes)`.

Methods should return array with attributes.

Example:
```php
    public function formatStoreAttributes($attributes)
    {
        $attributes['author_id'] = Auth::check() ? Auth::user()->id : 0;
        return $attributes;
    }
```

To change add or edit action, just overwrite methods:
- `store($attributes)`,
- `updateById($id, $attributes)`.

! Methods `formatStoreAttributes` and `formatUpdateAttributes` are used in parent `store` and `updateById`.

Example:
```php
    public function store($attributes)
    {
        $model = $this->model->findByName($attributes['name']);

        if ($model == null)
            $model = $this->model->create($attributes);

        return $this->getById($model->id);
    }
```

## Permissions

To change model permission, just overwrite methods:
- `permissionStore($options)`,
- `permissionUpdate($model)`,
- `permissionDelete($model)`,
- `permissionView($model)`.

Methods should return boolean.

```php

    // Show all model on list
    public function permissionView($model)
    {
        return true;
    }

    // Only admin can add new model
    public function permissionStore($options)
    {
        return Auth::user()->isAdmin();
    }

    // Can edit model when user have `updatePermission`
    public function permissionUpdate($model)
    {
        return Gate::allows('updatePermission', $model);
    }

    // Can remove model whit condition
    public function permissionDelete($model)
    {
        return $model->modelDeleteCondition();
    }

```

