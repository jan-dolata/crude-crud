<?php

namespace JanDolata\CrudeCRUD\Engine\CrudeSetupTrait;

trait CustomActions
{
    /**
     * Custom actions
     *
     * @var array
     */
    protected $customActions = [];

    /**
     * Gets the Custom actions.
     *
     * @return array
     */
    public function getCustomActions()
    {
        return $this->customActions;
    }

    /**
     * Sets the Custom actions.
     *
     * @param string|array $name
     * @param array $data = null
     *
     * @return self
     */
    public function setCustomActions($name, $data = null)
    {
        $actions = is_array($name) ? $name : [$name => $data];

        foreach ($actions as $key => $value) {
            $this->customActions[$key] = $value;
        }

        return $this;
    }
}
