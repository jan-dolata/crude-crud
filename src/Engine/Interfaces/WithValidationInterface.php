<?php

namespace JanDolata\CrudeCRUD\Engine\Interfaces;

interface WithValidationInterface
{
    public function getValidationRules($attrList = [], $values = []);
    public function setValidationRules($validationRules);
}
