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

    public function setRichFilters($name, $label = '', $type = 'text')
    {
        $this->hideFilters();

        $filters = is_array($name)
            ? $name
            : [$name, $label, $type];

        foreach ($filters as $filter) {
            $this->richFilters[$filter[0]] = [
                'name' => $filter[0],
                'label' => isset($filter[1]) ? $filter[1] : '',
                'type' => isset($filter[2]) ? $filter[2] : 'text'
            ];
        }

        return $this;
    }

    public function getRichFilters()
    {
        return $this->richFilters;
    }
}
