<?php

namespace JanDolata\CrudeCRUD\Engine\Traits;

trait WithValidationTrait
{
    /**
     * Validation rules for update
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
     * @param  string|array $attr
     * @param  string $validationRules = null
     * @return self
     */
    public function setValidationRules($attr, $validationRules = null)
    {
        $rules = is_array($attr)
            ? $attr
            : [$attr => $validationRules];

        $this->validationRules = array_merge($this->validationRules, $rules);

        return $this;
    }

}
