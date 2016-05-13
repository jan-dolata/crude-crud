<?php

namespace JanDolata\CrudeCRUD\Engine;

use JanDolata\CrudeCRUD\Engine\CrudeSetup;

abstract class Crude
{

    /**
     * Get crude setup
     * @return CrudeSetup
     */
    public function getCrudeSetup()
    {
        if (method_exists($this, 'getModelCrudeSetup'))
            return $this->getModelCrudeSetup();

        return new CrudeSetup($this->getCalledClassName(), []);
    }

    /**
     * Get called class name
     * @return string
     */
    protected static function getCalledClassName()
    {
        $class = get_called_class();
        $class = explode('\\', $class);
        return end($class);
    }

}
