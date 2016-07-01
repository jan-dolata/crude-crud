<?php

namespace JanDolata\CrudeCRUD\Engine\Traits;

trait WithPermissionTrait
{

    public function permissionStore($options) { return true; }
    public function permissionUpdate($model) { return true; }
    public function permissionDelete($model) { return true; }
    public function permissionView($model) { return true; }
    public function permissionOrder($options) { return true; }

    public function canStore($options = null) { return $this->can('store', $options); }
    public function canUpdate($model = null) { return $this->can('update', $model); }
    public function canDelete($model = null) { return $this->can('delete', $model); }
    public function canView($model = null) { return $this->can('view', $model); }
    public function canOrder($options = null) { return $this->can('order', $options); }

    public function cannotStore($options = null) { return $this->cannot('store', $options); }
    public function cannotUpdate($model = null) { return $this->cannot('update', $model); }
    public function cannotDelete($model = null) { return $this->cannot('delete', $model); }
    public function cannotView($model = null) { return $this->cannot('view', $model); }
    public function cannotOrder($options = null) { return $this->cannot('order', $options); }

    public function can($name, $model = null)
    {
        $name = $this->_formatName($name);

        if (empty($name))
            return false;

        if (! $this->_checkInterface($name))
            return false;

        if (! $this->_checkOption($name))
            return false;

        if (! empty($model))
            return $this->_checkPermission($name, $model);

        return true;
    }

    public function cannot($name)
    {
        return ! $this->can($name);
    }

    /**
     * Check permission by name
     * @param  string $name
     * @param  mixed $attribute
     * @return boolean
     */
    private function _checkPermission($name, $attribute)
    {
        if ($name == 'store') {
            return $this->permissionStore($attribute);
        }

        if ($name == 'update') {
            return $this->permissionUpdate($attribute);
        }

        if ($name == 'delete') {
            return $this->permissionDelete($attribute);
        }

        if ($name == 'order') {
            return $this->permissionOrder($attribute);
        }

        return $this->permissionView($attribute);
    }

    /**
     * Check option by name
     * @param  string $name
     * @return boolean
     */
    private function _checkOption($name)
    {
        if ($name == 'list')
            return true;

        $names = [
            'store' => 'add',
            'update' => 'edit',
            'delete' => 'delete',
            'order' => 'order'
        ];

        return $this->crudeSetup->haveOption($names[$name]);
    }

    /**
     * Check interface by name
     * @param  string $name
     * @return boolean
     */
    private function _checkInterface($name)
    {
        $interface = '\JanDolata\CrudeCRUD\Engine\Interfaces\\' . ucfirst($name) . 'Interface';
        return $this instanceof $interface;
    }

    /**
     * Format name to one of [store, update, delete, list]
     * @param  string $name
     * @return string
     */
    private function _formatName($name)
    {
        $name = strtolower($name);

        if (in_array($name, ['store', 'add']))
            return 'store';

        if (in_array($name, ['update', 'edit', 'change']))
            return 'update';

        if (in_array($name, ['delete', 'remove', 'destroy']))
            return 'delete';

        if (in_array($name, ['get', 'list', 'index', 'view']))
            return 'list';

        if (in_array($name, ['order', 'reorder', 'sort']))
            return 'order';

        return null;
    }
}
