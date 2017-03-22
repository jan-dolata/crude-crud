<?php

namespace JanDolata\CrudeCRUD\Engine\Traits\FromModelTraitPart;

use JanDolata\CrudeCRUD\Engine\CrudeSetup;

trait CollectionTrait
{

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
     * Filter query with richFilters values
     * @param  $query
     * @param  $richFilters
     * @return query
     */
    public function richFiltersOnQuery($query, $richFilters)
    {
        return $query;
    }

    /**
     * Filter collection with richFilters values
     * @param  $collection
     * @param  $richFilters
     * @return Collection
     */
    public function richFiltersOnCollection($collection, $richFilters)
    {
        return $collection;
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
    public function getFiltered($page, $numRows, $sortAttr, $sortOrder, $searchAttr, $searchValue, $richFilters = [])
    {
        $query = $this->prepareQuery();

        $query = $this->richFiltersOnQuery($query, $richFilters);

        if ($sortAttr && $sortOrder && $this->inScope($sortAttr)) {
            $scope = $this->getScope($sortAttr);
            $query = $query->orderBy($scope, $sortOrder);
        }

        if ($searchAttr && $searchValue && $this->inScope($searchAttr)) {
            $scope = $this->getScope($searchAttr);
            $query = $query->where($scope, 'like', '%' . $searchValue . '%');
        }

        $collection = $query->get();

        $collection = $this->addPermissions($collection);

        $collection = $this->formatCollection($collection);

        $collection = $collection->each(function ($model) {
            $model = $this->formatModel($model);
        });

        if ($sortAttr && $sortOrder && ! $this->inScope($sortAttr)) {
            $collection = $sortOrder == 'asc'
                ? $collection->sortBy($sortAttr)
                : $collection->sortByDesc($sortAttr);
        }

        $collection = $this->richFiltersOnCollection($collection, $richFilters);

        if ($searchAttr && $searchValue && ! $this->inScope($searchAttr)) {
            $collection = $collection->filter(function ($model) use ($searchAttr, $searchValue) {
                $value = (string) $model->$searchAttr;
                $value = strtolower($value);
                $search = strtolower($searchValue);
                return strpos($value, $search) !== false;
            });
        }

        if ($page && $numRows) {
            $toSkip = ($page - 1) * $numRows;
            $count = $collection->count();
            $collection = $collection->take(- ($count - $toSkip))->take($numRows);
        } else if ($numRows)
            $collection = $collection->take($numRows);

        return collect(array_values($collection->toArray()));
    }

    /**
     * Count all rows with condition
     * @param  string $searchAttr
     * @param  string $searchValue
     * @return integer
     */
    public function countFiltered($searchAttr, $searchValue, $richFilters)
    {
        $collection = $this->getFiltered(null, null, null, null, $searchAttr, $searchValue, $richFilters);
        return count($collection);
    }

    /**
     * Filter collection by permissions and add attributes canBeEdited and canBeRemoved
     * @param  Collection $collection
     * @return Collection
     */
    public function addPermissions($collection)
    {
        $newCollection = collect([]);

        $customActions = $this->crudeSetup->getCustomActions();

        $collection->each(function ($model) use ($newCollection, $customActions) {
            if ($this->permissionView($model)) {
                $model = $this->addPermissionsForModel($model, $customActions);
                $newCollection->push($model);
            }
        });

        return $newCollection;
    }

    private function addPermissionsForModel($model, $customActions = null)
    {
        $model->canBeEdited = $this->permissionUpdate($model);
        $model->canBeRemoved = $this->permissionDelete($model);

        if ($customActions == null)
            $customActions = $this->crudeSetup->getCustomActions();

        if (empty($customActions))
            return $model;

        foreach ($customActions as $action => $value) {
            $permission = $action . 'CustomActionPermission';
            $param = $action . 'CustomActionAvailable';
            $model->$param = method_exists($this, $permission)
                ? $this->$permission($model)
                : true;
        }

        return $model;
    }

    /**
     * Get by id
     * @param  integer $id
     * @return Model
     */
    public function getById($id)
    {
        $model = $this
            ->prepareQuery()
            ->where($this->model->getTable() . '.id', $id)
            ->first();

        if (empty($model))
            return null;

        $model = $this->addPermissionsForModel($model);

        return $this->formatModel($model);
    }
}
