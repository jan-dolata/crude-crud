<?php

namespace JanDolata\CrudeCRUD\Engine\Traits;

use JanDolata\CrudeCRUD\Engine\CrudeSetup;

trait FromModelTrait
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
     * Get model
     * @return Eloquent model
     */
    public function getModel()
    {
        return $this->model;
    }

    /**
     * Prepare default crude setup
     * @return self
     */
    public function prepareModelCrudeSetup()
    {
        $crudeName = $this->getCalledClassName();
        $modelAttr = array_merge(['id'], $this->model->getFillable(), ['created_at']);

        foreach ($modelAttr as $attr)
            $this->scope[$attr] = $this->model->getTable() . '.' . $attr;

        $this->crudeSetup = new CrudeSetup($crudeName, $modelAttr);

        if (! $this->canUpdate())
            $this->crudeSetup->lockEditOption();

        if (! $this->canStore('check with permission'))
            $this->crudeSetup->lockAddOption();

        if (! $this->canDelete())
            $this->crudeSetup->lockDeleteOption();

        $this->crudeSetup->setFilters(['id']);

        return $this;
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
     * Format collection to overwrite in child class - filter collection etc.
     * @param  Collection $collection
     * @return Collection
     */
    public function formatCollection($collection)
    {
        return $collection;
    }

    /**
     * Format model to overwrite in child class - add or change attribues etc.
     * @param  Model $model
     * @return Model
     */
    public function formatModel($model)
    {
        return $model;
    }

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
        $query = $this->prepareQuery();

        if ($sortAttr && $sortOrder && $this->inScope($sortAttr)) {
            $scope = $this->getScope($sortAttr);
            $query = $query->orderBy($scope, $sortOrder);
        }

        if ($page && $numRows) {
            $toSkip = ($page - 1) * $numRows;
            $query = $query->skip($toSkip)->take($numRows);
        }

        if ($searchAttr && $searchValue && $this->inScope($searchAttr)) {
            $scope = $this->getScope($searchAttr);
            $query = $query->where($scope, 'like', '%' . $searchValue . '%');
        }

        $collection = $this->addPermissions($query->get());

        $collection = $this->formatCollection($collection);

        $collection = $collection->each(function ($model) {
            $model = $this->formatModel($model);
        });

        if ($sortAttr && $sortOrder && ! $this->inScope($sortAttr)) {
            if ($sortOrder == 'asc')
                $collection = $collection->sortBy($sortAttr)->toArray();
            if ($sortOrder == 'desc')
                $collection = $collection->sortByDesc($sortAttr)->toArray();
        }

        if ($searchAttr && $searchValue && ! $this->inScope($searchAttr)) {
            $collection = $collection->filter(function ($model) use ($searchAttr, $searchValue) {
                $value = (string) $model->$searchAttr;
                $value = strtolower($value);
                $search = strtolower($searchValue);
                return strpos($value, $search) !== false;
            });
        }

        return collect(array_values($collection->toArray()));
    }



    /**
     * Count all rows with condition
     * @param  string $searchAttr
     * @param  string $searchValue
     * @return integer
     */
    public function countFiltered($searchAttr, $searchValue)
    {
        $collection = $this->getFiltered(null, null, null, null, $searchAttr, $searchValue);
        return count($collection);
    }

    /**
     * Filter collection by permissions and add attributes canBeEdited and canBeRemoved
     * @param Collection $collection
     * @return Collection
     */
    public function addPermissions($collection)
    {
        $newCollection = collect([]);

        $collection->each(function ($model) use ($newCollection) {
            if ($this->permissionView($model)) {
                $model->canBeEdited = $this->permissionStore($model);
                $model->canBeRemoved = $this->permissionDelete($model);
                $newCollection->push($model);
            }
        });

        return $newCollection;
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
     * Store new model
     * @param  array $attributes
     * @return Model
     */
    public function store($attributes)
    {
        // $attributes = $this->filterWithForm($attributes, $this->crudeSetup->getAddForm());

        $attributes = $this->mapAttributesWithScope($attributes);

        $attributes = $this->formatStoreAttributes($attributes);

        $model = $this->model->create($attributes);

        return $this->getById($model->id);
    }

    /**
     * Update by id
     * @param  integer $id
     * @param  array   $attributes
     * @return Model
     */
    public function updateById($id, $attributes)
    {
        // $attributes = $this->filterWithForm($attributes, $this->crudeSetup->getEditForm());

        $attributes = $this->mapAttributesWithScope($attributes);

        $attributes = $this->formatUpdateAttributes($attributes);

        $model = $this->model->find($id);

        if (empty($model))
            return $this;

        $model->update($attributes);

        return $this->getById($model->id);
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

        return $this;
    }
}
