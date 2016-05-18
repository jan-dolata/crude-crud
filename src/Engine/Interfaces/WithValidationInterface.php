<?php

namespace JanDolata\CrudeCRUD\Engine\Interfaces;

interface WithValidationInterface
{
    public function getValidationRules($attrList = []);
    public function setValidationRules($validationRules);
}
