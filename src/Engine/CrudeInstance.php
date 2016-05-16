<?php

namespace JanDolata\CrudeCRUD\Engine;

class CrudeInstance
{

    /**
     * Create crude instance
     * @param  string $name
     * @return Model|null
     */
    public static function get($name)
    {
        $name = config('crude.namespace') . $name;

        return class_exists($name)
            ? new $name()
            : null;
    }

}
