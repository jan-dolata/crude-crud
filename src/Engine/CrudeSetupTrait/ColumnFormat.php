<?php

namespace JanDolata\CrudeCRUD\Engine\CrudeSetupTrait;

trait ColumnFormat
{
    /**
     * Column cell format rules
     *
     * @var array
     */
    protected $columnFormat = [];

    /**
     * Gets the Column cell format rules.
     *
     * @return array
     */
    public function getColumnFormat()
    {
        return $this->columnFormat;
    }

    /**
     * Sets the Column cell format rules.
     *
     * @param array $columnFormat the column format
     *
     * @return self
     */
    public function setColumnFormat($attr, $format = null)
    {
        if (is_array($attr))
            $this->columnFormat = array_merge($this->columnFormat, $attr);
        else
            $this->columnFormat[$attr] = $format;

        return $this;
    }

}
