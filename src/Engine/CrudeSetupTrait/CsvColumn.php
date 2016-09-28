<?php

namespace JanDolata\CrudeCRUD\Engine\CrudeSetupTrait;

trait CsvColumn
{
    /**
     * Column
     *
     * @var array
     */
    protected $csvColumn = [];

    /**
     * Gets the Column.
     *
     * @return array
     */
    public function getCsvColumn()
    {
        return $this->csvColumn;
    }

    /**
     * Sets the Column.
     *
     * @param array $column the column
     *
     * @return self
     */
    public function setCsvColumn(array $csvColumn)
    {
        $this->csvColumn = $csvColumn;

        return $this;
    }
}
