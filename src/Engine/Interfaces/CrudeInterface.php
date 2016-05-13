<?php

namespace JanDolata\CrudeCRUD\Engine\Interfaces;

interface CrudeInterface
{
    public function getFiltered($page, $numRows, $sortAttr, $sortOrder, $searchAttr, $searchValue);
    public function countFiltered($searchAttr, $searchValue);
    public function getById($id);
}
