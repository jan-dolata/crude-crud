<?php

namespace JanDolata\CrudeCRUD\Engine\CrudeSetupTrait;

trait ExtraColumn
{
    /**
     * Extra column
     *
     * @var array
     */
    protected $extraColumn = [];

    /**
     * Gets the Extra column.
     *
     * @return array
     */
    public function getExtraColumn()
    {
        return $this->extraColumn;
    }

    /**
     * Sets the Extra column.
     *
     * @param array|sting $name
     * @param sting $description = true
     * @param boolean $visible = false
     *
     * @return self
     */
    public function setExtraColumn($name, $visible = false, $description = '')
    {
        $extraColumns = is_array($name)
            ? $name
            : [[$name, $visible, $description]];

        foreach ($extraColumns as $column) {
            if (! is_array($column))
                $column = [$column];

            $this->extraColumn[$column[0]] = [
                'name' => $column[0],
                'visible' => isset($column[1]) ? $column[1] : false,
                'description' => isset($column[2]) ? $column[2] : ''
            ];
        }

        return $this;
    }
}
