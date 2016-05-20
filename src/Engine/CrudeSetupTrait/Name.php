<?php

namespace JanDolata\CrudeCRUD\Engine\CrudeSetupTrait;

trait Name
{
    /**
     * Setup name
     *
     * @var string
     */
    protected $name = '';

    /**
     * Gets the Setup name.
     *
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * Sets the Setup name.
     *
     * @param string $name the name
     *
     * @return self
     */
    public function setName($name)
    {
        $this->name = $name;

        return $this;
    }
}
