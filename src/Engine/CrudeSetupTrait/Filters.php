<?php

namespace JanDolata\CrudeCRUD\Engine\CrudeSetupTrait;

trait Filters
{
    /**
     * Filters
     *
     * @var array
     */
    protected $filters = [];

    /**
     * Gets the Filters.
     *
     * @return array
     */
    public function getFilters()
    {
        return $this->filters;
    }

    /**
     * Sets the Filters.
     *
     * @param array|sting $filters the filters
     *
     * @return self
     */
    public function setFilters($filters)
    {
        if (! is_array($filters))
            $filters = [$filters];

        $this->filters = array_unique(array_merge($this->filters, $filters));

        return $this;
    }

    public function resetFilters($filters = [])
    {
        $this->filters = $filters;
    }
}
