<?php

namespace JanDolata\CrudeCRUD\Engine\Interfaces;

interface ListInterface
{
    public function getCrudeSetup();
    public function getFiltered($page, $numRows, $sortAttr, $sortOrder, $searchAttr, $searchValue, $richFilters);
    public function countFiltered($searchAttr, $searchValue, $richFilters);
    public function getById($id);
}
