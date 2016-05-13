<?php

namespace JanDolata\CrudeCRUD\Engine;

interface CrudeSetupInterface
{
    public function getCrudeSetup();

    public function getFilteredCollection($page, $numRows, $sortAttr, $sortOrder, $searchAttr, $searchValue);

    public function countFilteredCollection($searchAttr, $searchValue);

    public function getById($id);

    public function updateById($id, $attributes);

    public function deleteById($id);

    /**
     * Return validation rules as an array
     * Function returns the list of rules for attributes listed in $attrList
     * @param  array $attrList = []
     * @return array
     */
    public function getValidationRules($attrList = []);

    /**
     * Set validation rules array
     * @param  array $validationRules
     * @return self
     */
    public function setValidationRules($validationRules);

    /**
     * Set model
     * @param  Eloquent model $model
     * @return self
     */
    public function setModel($model);

}
