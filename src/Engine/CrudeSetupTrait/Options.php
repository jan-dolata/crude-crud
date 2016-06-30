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

    /**
     * Show order option
     *
     * @var boolean
     */
    protected $orderOption = false;

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

    public function haveOption($optionName = '')
    {
        if ($optionName == 'add')
            return $this->addOption;

        if ($optionName == 'edit')
            return $this->editOption;

        if ($optionName == 'delete')
            return $this->deleteOption;

        if ($optionName == 'order')
            return $this->orderOption;

        return false;
    }
}
