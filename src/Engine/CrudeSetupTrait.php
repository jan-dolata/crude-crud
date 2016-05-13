<?php

namespace JanDolata\CrudeCRUD\Engine;

trait CrudeSetupTrait
{
    /**
     * Eloquent model
     * @var Eloquent model
     */
    protected $model;

    /**
     * Validation rules
     * @var array
     */
    protected $validationRules = [];

    public function prepareQuery()
    {
        return $this->model;
    }

    public function getCrudeSetup()
    {
        $modelAttr = array_merge(['id'], $this->model->getFillable(), ['created_at']);
        return (new Crude($this->getCalledClassName(), $modelAttr));
    }

    protected static function getCalledClassName()
    {
        $childClassName = get_called_class();
        $explodedClassPath = explode("\\", $childClassName);
        $count = count($explodedClassPath);
        if ($count <= 0) {
            return null;
        }

        $position = $count - 1;
        return $explodedClassPath[$position];
    }

    public function formatCollection($collection)
    {
        $newCollection = collect([]);

        $collection->each(function ($item) {
            $item->canBeEdited = true;
            $item->canBeRemoved = true;

            $newCollection->push($item);
        });

        return $newCollection;
    }

    public function formatModel($model)
    {
        $model->canBeEdited = true;
        $model->canBeRemoved = true;

        return $model;
    }

    public function getFilteredCollection($page, $numRows, $sortAttr, $sortOrder, $searchAttr, $searchValue)
    {
        $collection = $this
            ->prepareQuery()
            ->where($this->model->getTable() . '.' . $searchAttr, 'like', '%' . $searchValue . '%' )
            ->orderBy($sortAttr, $sortOrder)
            ->skip($toSkip)
            ->take($numRows)
            ->get();

        return $this->formatCollection($collection);
    }

    public function countFilteredCollection($searchAttr, $searchValue)
    {
        return $this
            ->prepareQuery()
            ->where($this->model->getTable() . '.' . $searchAttr, 'like', '%' . $searchValue . '%' )
            ->count();
    }

    public function getById($id)
    {
        $model = $this
            ->prepareQuery()
            ->where($this->model->getTable() . '.id', $id)
            ->first();

        return $this->formatModel($model);
    }

    public function updateById($id, $attributes)
    {
        $model = $this->getById($id);
        $model->update($attributes);

        return $this;
    }


    public function deleteById($id)
    {
        $model = $this->getById($id);
        $model->delete();

        return $this;
    }

    /**
     * Return validation rules as an array
     * Function returns the list of rules for attributes listed in $attrList
     * @param  array $attrList = []
     * @return array
     */
    public function getValidationRules($attrList = [])
    {
        $allRules = isset($this->validationRules)
            ? $this->validationRules
            : [];

        if (empty($attrList))
            return $allRules;

        foreach ($attrList as $attr)
            $rules[$attr] = isset($allRules[$attr]) ? $allRules[$attr] : '';

        return $rules;
    }

    /**
     * Set validation rules array
     * @param  array $validationRules
     * @return self
     */
    public function setValidationRules($validationRules)
    {
        $this->validationRules = $validationRules;

        return $this;
    }

    /**
     * Set model
     * @param  Eloquent model $model
     * @return self
     */
    public function setModel($model)
    {
        $this->model = $model;

        return $this;
    }
}
