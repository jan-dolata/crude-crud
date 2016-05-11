<?php

namespace JanDolata\CrudeCRUD\Engine;

trait CrudeModelTrait
{

    /**
     * Default scope to overwrite in child class
     */
    public function scopeFullData($query)
    {
        return $query;
    }

    /**
     * Get all models
     * @param  integer $page = 1         - selected page
     * @param  integer $numPages = 20    - number of rows on page
     * @param  string $sortAttr = 'id'   - sort attribute
     * @param  string $sortOrder = 'asc' - sort order
     * @param  string $searchAttr = 'id' - search attribute
     * @param  string $searchValue = ''  - search value
     * @return Collection
     */
    public function getAll($page = 1, $numRows = 20, $sortAttr = 'id', $sortOrder = 'asc', $searchAttr = 'id', $searchValue = '')
    {
        $toSkip = ($page - 1) * $numRows;

        return $this::fullData()
            ->where($this->getTable() . '.' . $searchAttr, 'like', '%' . $searchValue . '%' )
            ->orderBy($sortAttr, $sortOrder)
            ->skip($toSkip)
            ->take($numRows)
            ->get();
    }

    public function countFiltered($searchAttr = 'id', $searchValue = '')
    {
        return $this::fullData()
            ->where($this->getTable() . '.' . $searchAttr, 'like', '%' . $searchValue . '%' )
            ->count();
    }

    /**
     * Get model by id
     * @param  integer $id
     * @return Model
     */
    public function getById($id)
    {
        return $this::fullData()
            ->where($this->getTable() . '.id', $id)
            ->first();
    }

    /**
     * Get models by ids
     * @param  integer|array $ids
     * @return Collection
     */
    public function getByIds($ids)
    {
        if (! is_array($ids))
            $ids = [$ids];

        return $this::fullData()
            ->whereIn($this->getTable() . '.id', $ids)
            ->get();
    }

    /**
     * Update model by id
     * @param  integer $id
     * @return boolean
     */
    public function updateById($id, $attributes)
    {
        return $this
            ->getById($id)
            ->update($attributes);
    }

    /**
     * Delete model by id
     * @param  integer $id
     * @return boolean
     */
    public function deleteById($id)
    {
        return $this
            ->getById($id)
            ->delete();
    }

    /**
     * Return validation rules of model as an array
     * Function returns the list of rules for attributes listed in $attrList
     * @param Array $attrList
     * @return array
     */
    public function getValidationRules(array $attrList = [])
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
}
