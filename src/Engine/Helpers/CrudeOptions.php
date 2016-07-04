<?php

namespace JanDolata\CrudeCRUD\Engine\Helpers;

abstract class CrudeOptions
{
    public static function getOptions()
    {
        $constants = self::getConstants();

        $options = [];
        foreach ($constants as $const) {
            $options[] = [
                'id' => $const,
                'label' => self::getLabel($const)
            ];
        }

        return $options;
    }

    public static function getLabel($name)
    {
        $childName = get_called_class();
        $child = new $childName;
        if (property_exists($child, 'optionsTrans'))
            return  trans($child->optionsTrans . '.' . $name);

        return $name;
    }

    protected static function getConstants()
    {
        return (new \ReflectionClass(get_called_class()))->getConstants();
    }
}
