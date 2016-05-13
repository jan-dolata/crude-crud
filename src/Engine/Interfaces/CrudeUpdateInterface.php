<?php

namespace JanDolata\CrudeCRUD\Engine\Interfaces;

interface CrudeUpdateInterface
{
    public function updateById($id, $attributes);
}
