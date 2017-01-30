<?php

namespace JanDolata\CrudeCRUD\Engine\CrudeSetupTrait;

trait DefaultSortAttr
{
    /**
     * Default sort attributes and order
     *
     * @var string
     */
    protected $defaultSortAttr = 'id';
    protected $defaultSortOrder = 'asc';

    public function getDefaultSortAttr()
    {
        return $this->defaultSortAttr;
    }

    public function getDefaultSortOrder()
    {
        return $this->defaultSortOrder;
    }

    public function setDefaultSort($attr, $orderAsc = true)
    {
        $this->defaultSortAttr = $attr;
        $this->defaultSortOrder = $orderAsc ? 'asc' : 'desc';

        return $this;
    }
}
