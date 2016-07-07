<?php

namespace JanDolata\CrudeCRUD\Engine\Traits\FromModelTraitPart;

trait StoreUpdateDeleteTrait
{

    /**
     * Format attributes in store action
     * @param  array $attributes
     * @return array
     */
    public function formatStoreAttributes($attributes)
    {
        return $attributes;
    }

    /**
     * Format attributes in update action
     * @param  array $attributes
     * @return array
     */
    public function formatUpdateAttributes($attributes)
    {
        return $attributes;
    }

    /**
     * Method call after store, to overwrite in child class
     * @param  Model $model
     * @return Model
     */
    public function afterStore($model, $attributes) {}

    /**
     * Method call after update, to overwrite in child class
     * @param  Model $model
     * @return Model
     */
    public function afterUpdate($model, $attributes) {}

    /**
     * Store new model
     * @param  array $attributes
     * @return Model
     */
    public function store($attributes)
    {
        $attributes = $this->formatStoreAttributes($attributes);

        $model = $this->model->create($attributes);

        $apiModel = $this->getById($model->id);

        if ($this->canOrder()) {
            if ($this->storeInLastPlace) {
                $attr = $this->crudeSetup->getOrderAttribute();
                $apiModel->$attr = $apiModel->id;
                $apiModel->save();
            }
            $this->resetOrder();
        }

        $this->afterStore($apiModel, $attributes);

        return $apiModel;
    }

    /**
     * Update by id
     * @param  integer $id
     * @param  array   $attributes
     * @return Model
     */
    public function updateById($id, $attributes)
    {
        $attributes = $this->formatUpdateAttributes($attributes);

        $model = $this->model->find($id);

        if (empty($model))
            return $this;

        $model->update($attributes);

        $apiModel = $this->getById($model->id);
        $this->afterUpdate($apiModel, $attributes);
        return $apiModel;
    }

    private function mapAttributesWithScope($attributes)
    {
        $modelAttr = [];
        $table = $this->model->getTable();
        foreach ($attributes as $attr => $value) {
            $scope = isset($this->scope[$attr])
                ? $this->scope[$attr]
                : '';

            if (strpos($scope, $table) === 0) {
                $scopeArray = explode(".", $scope);
                $modelAttr[end($scopeArray)] = $value;
            }
        }
        return $modelAttr;
    }

    private function filterWithForm($attr, $setupAttr)
    {
        return array_filter(
            $attr,
            function ($key) use ($setupAttr) {
                return in_array($key, $setupAttr);
            },
            ARRAY_FILTER_USE_KEY
        );
    }

    /**
     * Delete by id
     * @param  integer $id
     * @return self
     */
    public function deleteById($id)
    {
        $model = $this->getById($id);

        if (empty($model))
            return $this;

        $model->delete();

        if ($this->canOrder())
            $this->resetOrder();

        return $this;
    }
}
