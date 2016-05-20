<?php

namespace JanDolata\CrudeCRUD\Engine\CrudeSetupTrait;

trait Title
{
    /**
     * Setup title
     *
     * @var string
     */
    protected $title = '';

    /**
     * Gets the Setup title.
     *
     * @return string
     */
    public function getTitle()
    {
        return $this->title;
    }

    /**
     * Sets the Setup title.
     *
     * @param string $title the title
     *
     * @return self
     */
    public function setTitle($title)
    {
        $this->title = $title;

        return $this;
    }
}
