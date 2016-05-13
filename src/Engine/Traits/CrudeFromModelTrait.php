<?php

namespace JanDolata\CrudeCRUD\Engine\Traits;

use JanDolata\CrudeCRUD\Engine\CrudeSetup;

trait CrudeFromModelTrait
{
    /**
     * Eloquent model
     * @var Eloquent model
     */
    protected $model;

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

    /**
     * Get crude setup
     * @return CrudeSetup
     */
    public function getCrudeSetup()
    {
        return $this->getDefaultCrudeSetup();
    }

    /**
     * Get default crude setup
     * @return CrudeSetup
     */
    public function getDefaultCrudeSetup()
    {
        $crudeName = $this->getCalledClassName();
        $modelAttr = array_merge(['id'], $this->model->getFillable(), ['created_at']);

        $crude = new CrudeSetup($crudeName, $modelAttr);

        if (! $this instanceof \JanDolata\CrudeCRUD\Engine\Interfaces\CrudeUpdateInterface)
            $crude->lockEditOption();

        if (! $this instanceof \JanDolata\CrudeCRUD\Engine\Interfaces\CrudeAddInterface)
            $crude->lockAddOption();

        if (! $this instanceof \JanDolata\CrudeCRUD\Engine\Interfaces\CrudeDeleteInterface)
            $crude->lockDeleteOption();

        return $crude;
    }

    /**
     * Get called class name
     * @return string
     */
    protected static function getCalledClassName()
    {
        $class = get_called_class();
        $class = explode('\\', $class);
        return end($class);
    }

    /**
     * Default scope to overwrite in child class
     * @return query
     */
    public function prepareQuery()
    {
        return $this->model;
    }

    /**
     * Format collection - filter collection by permision etc.
     * @param  Collection $collection
     * @return Collection
     */
    public function formatCollection($collection)
    {
        $newCollection = collect([]);

        $collection->each(function ($model) use ($newCollection) {
            $newCollection->push($this->formatModel($model));
        });

        return $newCollection;
    }

    /**
     * Format model - add or change attribues etc.
     * Returned model should contain Boolean parameters:
     *     canBeEdited - true when the model have permission to be edit
     *     canBeRemoved - true when the model have permission to be remove
     * @param  Model $model
     * @return Model
     */
    public function formatModel($model)
    {
        $model->canEdit = true;
        $model->canRemove = true;

        return $model;
    }

    /**
     * Get filtered collection
     * @param  integer $page
     * @param  integer $numRows
     * @param  string  $sortAttr
     * @param  string  $sortOrder
     * @param  string  $searchAttr
     * @param  string  $searchValue
     * @return Collection
     */
    public function getFiltered($page, $numRows, $sortAttr, $sortOrder, $searchAttr, $searchValue)
    {
        $toSkip = ($page - 1) * $numRows;

        $collection = $this
            ->prepareQuery()
            ->where($this->model->getTable() . '.' . $searchAttr, 'like', '%' . $searchValue . '%' )
            ->orderBy($sortAttr, $sortOrder)
            ->skip($toSkip)
            ->take($numRows)
            ->get();

        return $this->formatCollection($collection);
    }

    /**
     * Count all rows with condition
     * @param  string $searchAttr
     * @param  string $searchValue
     * @return integer
     */
    public function countFiltered($searchAttr, $searchValue)
    {
        return $this
            ->prepareQuery()
            ->where($this->model->getTable() . '.' . $searchAttr, 'like', '%' . $searchValue . '%' )
            ->count();
    }

    /**
     * Get by id
     * @param  integer $id
     * @return [type]     [description]
     */
    public function getById($id)
    {
        $model = $this
            ->prepareQuery()
            ->where($this->model->getTable() . '.id', $id)
            ->first();

        return empty($model)
            ? null
            : $this->formatModel($model);
    }

    /**
     * Update by id
     * @param  integer $id
     * @param  array   $attributes
     * @return self
     */
    public function updateById($id, $attributes)
    {
        $model = $this->getById($id);

        if (empty($model))
            return $this;

        $model->update($attributes);

        return $this;
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

        return $this;
    }
}
