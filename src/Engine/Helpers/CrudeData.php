<?php

namespace JanDolata\CrudeCRUD\Engine\Helpers;

use Session;

class CrudeData
{
    public static function put($crudeName, $attr, $value = null)
    {
        if (! is_array($attr))
            $attr = [$attr => $value];

        Session::put(self::prepareName($crudeName), $attr);
    }

    public static function get($crudeName, $attr = null)
    {
        $data = Session::has(self::prepareName($crudeName))
            ? Session::get(self::prepareName($crudeName))
            : [];

        if (empty($attr))
            return $data;

        if (isset($data[$attr]))
            return $data[$attr];

        return null;
    }

    private static function prepareName($crudeName)
    {
        return 'crudeData.' . $crudeName;
    }
}
