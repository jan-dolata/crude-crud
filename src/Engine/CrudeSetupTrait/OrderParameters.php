<?php

namespace JanDolata\CrudeCRUD\Engine\CrudeSetupTrait;

trait OrderParameters
{
    /**
     * Ordered list param
     *
     * @var array
     */
    protected $orderParameters = [
        'idAttr' => 'id',
        'orderAttr' => 'order',
        'labelAttr' => 'name'
    ];

    /**
     * Gets the Ordered list param.
     *
     * @return array
     */
    public function getOrderParameters()
    {
        return $this->orderParameters;
    }

    /**
     * Sets the Ordered list param.
     *
     * @param array $orderedList the ordered list
     *
     * @return self
     */
    public function setOrderParameters($idAttr, $orderAttr, $labelAttr)
    {
        $this->orderParameters = [
            'idAttr' => $idAttr,
            'orderAttr' => $orderAttr,
            'labelAttr' => $labelAttr
        ];

        return $this;
    }

    public function useOrderedList($labelAttr = 'name', $orderAttr = 'order', $idAttr = 'id')
    {
        $this->orderOption = true;
        $this->setOrderParameters($idAttr, $orderAttr, $labelAttr);
        $column = $this->getColumn();
        $this->setColumn(array_merge([$orderAttr], $column));

        return $this;
    }

    public function getOrderAttribute()
    {
        if (empty($this->orderParameters['orderAttr']) || ! $this->haveOption('order'))
            return config('crude.defaults.sortAttr');

        return $this->orderParameters['orderAttr'];
    }
}
