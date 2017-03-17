<?php

namespace JanDolata\CrudeCRUD\Engine\Helpers;

abstract class CrudeOptions
{
    protected static $backupColors = [
        '#92C9E3',
        '#FFE5A0',
        '#9CA5E7',
        '#FFD3A0'
    ];

    public static function getOptions()
    {
        $childName = get_called_class();
        $child = new $childName;

        $constants = self::getConstants();

        $backupColors = self::$backupColors;
        $colors = property_exists($child, 'colors')
            ? $child->colors
            : [];

        $options = [];
        $i = 0;
        foreach ($constants as $const) {
            $color = array_key_exists($const, $colors)
                ? $colors[$const]
                : $backupColors[$i % count($backupColors)];

            $options[] = [
                'id' => $const,
                'label' => self::getLabel($const),
                'color' => $color
            ];

            $i++;
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

    public static function getConstants()
    {
        return (new \ReflectionClass(get_called_class()))->getConstants();
    }
}
