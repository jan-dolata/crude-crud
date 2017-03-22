<?php

namespace JanDolata\CrudeCRUD\Engine\Helpers;

use JanDolata\CrudeCRUD\Engine\Helpers\CrudeData;
use JanDolata\CrudeCRUD\Engine\CrudeInstance;

class CrudeMagic
{
    public static function make($crudeName, $attr = null, $value = null)
    {
        if ($attr)
            CrudeData::put($crudeName, $attr, $value);

        return CrudeInstance::get($crudeName);
    }

    public static function view($crudeName, $attr = null, $value = null)
    {
        $crude = self::make($crudeName, $attr, $value);
        if ($crude)
            return $crude->getCrudeSetupData();

        return [];
    }

    public static function form($modelId, $crudeName, $attr = null, $value = null)
    {
        $crude = self::make($crudeName, $attr, $value);
        if ($crude)
            return [
                'setup' => $crude->getCrudeSetupData(),
                'model' => $crude->getById($modelId)
            ];

        return [];
    }


}
