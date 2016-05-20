<?php

namespace JanDolata\CrudeCRUD\Engine\CrudeSetupTrait;

trait ModelDefaults
{
    /**
     * Model default values
     *
     * @var array
     */
    protected $modelDefaults = [];

    /**
     * Gets the Model default values.
     *
     * @return array
     */
    public function getModelDefaults()
    {
        return $this->modelDefaults;
    }

    /**
     * Sets the Model default values.
     *
     * @param  string|array $attr
     * @param  array $value
     *
     * @return self
     */
    public function setModelDefaults($attr, $value = null)
    {
        if (is_array($attr))
            $this->modelDefaults = array_merge($this->modelDefaults, $attr);
        else
            $this->modelDefaults[$attr] = $value;

        return $this;
    }
}
