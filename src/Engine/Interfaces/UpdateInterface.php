<?php

namespace JanDolata\CrudeCRUD\Engine\Interfaces;

interface UpdateInterface
{
    public function updateById($id, $attributes);
}
