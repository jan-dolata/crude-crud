<?php

namespace JanDolata\CrudeCRUD\Engine\CrudeSetupTrait;

trait SelectOptions
{
    /**
     * Select options
     *
     * @var array
     */
    protected $selectOptions = [];

    /**
     * Gets the Select options.
     *
     * @return array
     */
    public function getSelectOptions()
    {
        return $this->selectOptions;
    }

    /**
     * Sets the Select options.
     *
     * @param  string|array $attr
     * @param  array $options = null
     *
     * @return self
     */
    public function setSelectOptions($attr, $options = null)
    {
        $optionsList = is_array($attr)
            ? $attr
            : [$attr => $options];

        foreach ($optionsList as $key => $value)
            $this->selectOptions[$key] = $value;

        return $this;
    }
}
