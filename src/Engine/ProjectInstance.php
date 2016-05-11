<?php

namespace JanDolata\CrudeCRUD\Engine;

class ProjectInstance
{

    /**
     * Create model instance
     * @param  string $name
     * @param  boolean $isHyperCase = false
     * @return Model
     */
    public function model($name, $isHyperCase = false)
    {
        if ($isHyperCase)
            $name = $this->changeFromHyperToCamel($name);

        $name = config('crude.modelNamespace') . $name;
        return new $name();
    }

    /**
     * Change heper case to camel case
     * @param  string $hyperCase
     * @return string
     */
    private function changeFromHyperToCamel($hyperCase)
    {
        return str_replace('-', '', ucwords($hyperCase, '-'));
    }

}
