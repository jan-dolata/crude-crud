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
     * @param  array $values = null
     * @return array
     */
    public function getValidationRules($attrList = [], $values = [])
    {
        $allRules = isset($this->validationRules)
            ? $this->validationRules
            : [];

        foreach ($allRules as &$item) {
            $keys = $this->getRuleAttr($item);

            foreach ($keys as $key) {
                $value = isset($values[$key]) ? $values[$key] : 'NULL';
                $item = str_replace('{$' . $key . '}', $value, $item);
            }
        }
        unset($item);

        if (empty($attrList))
            return $allRules;

        foreach ($attrList as $attr)
            $rules[$attr] = isset($allRules[$attr]) ? $allRules[$attr] : '';

        return $rules;
    }

    private function getRuleAttr($rule)
    {
        $ruleE = explode('{', $rule);
        $keys = [];
        foreach ($ruleE as $key) {
            if (strpos($key, '$') === 0 && strpos($key, '}') !== false) {
                $keyE = explode('}', $key);
                $keys[] = substr($keyE[0], 1);
            }
        }
        return $keys;
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
