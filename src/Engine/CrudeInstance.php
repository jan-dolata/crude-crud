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
        $namespaces = config('crude.namespace');

        if (! is_array($namespaces)) {
            $fullName = $namespaces . $name;

            return class_exists($fullName)
                ? new $fullName()
                : null;
        }

        foreach ($namespaces as $namespace) {
            $fullName = $namespace . $name;
            if (class_exists($fullName))
                return new $fullName();
        }

        return null;
    }

}
