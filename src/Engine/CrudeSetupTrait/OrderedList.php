<?php

namespace JanDolata\CrudeCRUD\Engine\CrudeSetupTrait;

trait OrderedList
{
    /**
     * Ordered list param
     *
     * @var array
     */
    protected $orderedList = [
        'idAttr' => 'id',
        'orderAttr' => 'order',
        'labelAttr' => 'name'
    ];

    /**
     * Gets the Ordered list param.
     *
     * @return array
     */
    public function getOrderedList()
    {
        return $this->orderedList;
    }

    /**
     * Sets the Ordered list param.
     *
     * @param array $orderedList the ordered list
     *
     * @return self
     */
    public function setOrderedList($idAttr, $orderAttr, $labelAttr)
    {
        $this->orderedList = [
            'idAttr' => $idAttr,
            'orderAttr' => $orderAttr,
            'labelAttr' => $labelAttr
        ];

        return $this;
    }

    public function useOrderedList($labelAttr, $orderAttr = 'order', $idAttr = 'id')
    {
        $this->orderOption = true;
        $this->setOrderedList($idAttr, $orderAttr, $labelAttr);
        $column = $this->getColumn();
        $this->setColumn(array_merge(['order'], $column));

        return $this;
    }

    public function getOrderAttribute()
    {
        if (empty($this->orderedList['orderAttr']))
            return config('crude.defaults.sortAttr');

        return $this->orderedList['orderAttr'];
    }
}
