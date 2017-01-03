<?php

namespace JanDolata\CrudeCRUD\Engine\CrudeSetupTrait;

trait CheckboxColumn
{

    protected $checkboxColumn = false;

    public function getCheckboxColumn()
    {
        return $this->checkboxColumn;
    }

    public function setCheckboxColumn()
    {
        $this->checkboxColumn = true;

        return $this;
    }
}
