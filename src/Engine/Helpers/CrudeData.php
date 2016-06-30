<?php

namespace JanDolata\CrudeCRUD\Engine\Helpers;

use Session;

class CrudeData
{
    public static function put(array $data)
    {
        Session::forget('crudeData');
        Session::put('crudeData', $data);
    }

    public static function get($attr = null)
    {
        $data = Session::has('crudeData') ? Session::get('crudeData') : [];

        if (empty($attr))
            return $data;

        if (isset($data[$attr]))
            return $data[$attr];

        return null;
    }
}
