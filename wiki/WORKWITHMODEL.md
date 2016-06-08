# Work with model

[Readme](../README.md)

## Table of content
- [Trait](#trait)
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

## Custome Store / Update method

To change attributes before add or edit new model, just overwrite the methods:
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

To change add or edit action, just overwrite the methods:
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

To change model permission, just overwrite the methods:
- `permissionStore($options)`,
- `permissionUpdate($model)`,
- `permissionDelete($model)`,
- `permissionView($model)`.

Methods should return boolean.

```php

    // All model on list
    public function permissionView($model)
    {
        return true;
    }

    // Only admin can add new model
    public function permissionStore($options)
    {
        return Auth::user()->isAdmin();
    }

    // Can edit model when have `updatePermission`
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

