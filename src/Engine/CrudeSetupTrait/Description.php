<?php

namespace JanDolata\CrudeCRUD\Engine\CrudeSetupTrait;

trait Description
{
    /**
     * Setup description
     *
     * @var string
     */
    protected $description = '';

    /**
     * Gets the Setup description.
     *
     * @return string
     */
    public function getDescription()
    {
        return $this->description;
    }

    /**
     * Sets the Setup description.
     *
     * @param string $description the description
     *
     * @return self
     */
    public function setDescription($description)
    {
        $this->description = $description;

        return $this;
    }
}
