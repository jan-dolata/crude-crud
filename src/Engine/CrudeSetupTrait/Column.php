<?php

namespace JanDolata\CrudeCRUD\Engine\CrudeSetupTrait;

trait Column
{
    /**
     * Column
     *
     * @var array
     */
    protected $column = [];

    /**
     * Gets the Column.
     *
     * @return array
     */
    public function getColumn()
    {
        return $this->column;
    }

    /**
     * Sets the Column.
     *
     * @param array $column the column
     *
     * @return self
     */
    public function setColumn(array $column)
    {
        $this->column = $column;

        return $this;
    }
}
