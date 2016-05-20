<?php

namespace JanDolata\CrudeCRUD\Engine\CrudeSetupTrait;

trait Options
{
    /**
     * Show delete option
     *
     * @var boolean
     */
    protected $deleteOption = true;

    /**
     * Show add option
     *
     * @var boolean
     */
    protected $addOption = true;

    /**
     * Show edit option
     *
     * @var boolean
     */
    protected $editOption = true;

    public function lockEditOption()
    {
        $this->editOption = false;
        $this->setEditForm([]);

        return $this;
    }

    public function lockAddOption()
    {
        $this->addOption = false;
        $this->setAddForm([]);

        return $this;
    }

    public function lockDeleteOption()
    {
        $this->deleteOption = false;

        return $this;
    }
}
