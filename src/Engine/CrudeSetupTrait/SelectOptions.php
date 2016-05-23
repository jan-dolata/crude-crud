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
     * @param array $selectOptions the select options
     *
     * @return self
     */
    public function setSelectOptions($attr, $options = null)
    {
        $optionsList = is_array($attr)
            ? $attr
            : [$attr => $options];

        $this->selectOptions = array_merge($this->selectOptions, $optionsList);

        return $this;
    }
}
