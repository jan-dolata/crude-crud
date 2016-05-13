<?php

namespace JanDolata\CrudeCRUD\Engine\Interfaces;

interface CrudeWithValidationInterface
{
    public function getValidationRules($attrList = []);
    public function setValidationRules($validationRules);

}
