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
        $formats = is_array($attr)
            ? $attr
            : [$attr => $format];

        foreach ($formats as $a => $f)
            $this->_setSingleColumnFormat($a, $f);

        return $this;
    }

    private function _setSingleColumnFormat($attr, $format)
    {
        $this->columnFormat[$attr] = is_array($format)
            ? $format
            : ['type' => $format];
    }

}
