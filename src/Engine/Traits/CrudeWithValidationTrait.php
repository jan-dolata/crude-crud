<?php

namespace JanDolata\CrudeCRUD\Engine\Traits;

trait CrudeWithValidationTrait
{
    /**
     * Validation rules
     * @var array
     */
    protected $validationRules = [];

    /**
     * Return validation rules as an array
     * Function returns the list of rules for attributes listed in $attrList
     * @param  array $attrList = []
     * @return array
     */
    public function getValidationRules($attrList = [])
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

    /**
     * Set validation rules array
     * @param  array $validationRules
     * @return self
     */
    public function setValidationRules($validationRules)
    {
        $this->validationRules = $validationRules;

        return $this;
    }

}
