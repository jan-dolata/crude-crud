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
     * Gets all column attributes.
     *
     * @return array
     */
    public function getColumnAttr()
    {
        $attr = [];

        foreach ($this->column as $item) {
            if (is_array($item))
                $attr = array_merge($attr, $item);
            else
                $attr[] = $item;
        }

        return array_unique(array_values($attr));
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

    /**
     * Remove one or more columns attributes
     *
     * @param  string|array $column
     *
     * @return self
     */
    public function hideColumn($column)
    {
        if (! is_array($column))
            $column = [$column];

        $newColumn = [];
        foreach ($this->column as $item) {
            if (is_array($item)) {
                $new = array_values(array_diff($item, $column));
                if (! empty($new))
                    $newColumn[] = count($new) > 1
                        ? array_values($new)
                        : $new[0];
            }
            else if (! in_array($item, $column))
                $newColumn[] = $item;

        }
        $this->column = $newColumn;

        return $this;
    }
}
