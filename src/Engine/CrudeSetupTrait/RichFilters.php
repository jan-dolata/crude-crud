<?php

namespace JanDolata\CrudeCRUD\Engine\CrudeSetupTrait;

trait RichFilters
{

    /**
     * Filters with extra logic
     *
     * @var array
     */
    protected $richFilters = [];

    public function addRichFilter($name, $label, $type = 'text')
    {
        $this->hideFilters();

        $this->richFilters[$name] = [
            'name' => $name,
            'type' => $type,
            'label' => $label
        ];

        return $this;
    }

    public function addRichFilters($filters)
    {
        foreach ($filters as $filter)
            isset($filter[2])
                ? $this->addRichFilter($filter[0], $filter[1], $filter[2])
                : $this->addRichFilter($filter[0], $filter[1]);

        return $this;
    }

    public function getRichFilters()
    {
        return $this->richFilters;
    }
}
