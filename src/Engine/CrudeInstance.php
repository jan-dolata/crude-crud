<?php

namespace JanDolata\CrudeCRUD\Engine;

class CrudeInstance
{

    /**
     * Create crude instance
     * @param  string $name
     * @return Model
     */
    public static function get($name)
    {
        $name = config('crude.namespace') . $name;
        return new $name();
    }

}
