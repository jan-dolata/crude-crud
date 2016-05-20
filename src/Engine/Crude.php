<?php

namespace JanDolata\CrudeCRUD\Engine;

use JanDolata\CrudeCRUD\Engine\CrudeSetup;

abstract class Crude
{
    /**
     * Crude Setup instance
     * @var CrudeSetup
     */
    protected $crudeSetup;

    /**
     * Selected attributes
     * @var array
     */
    protected $scope = [];

    /**
     * Get crude setup
     * @return CrudeSetup
     */
    public function getCrudeSetup()
    {
        return $this->crudeSetup;
    }

    public function getCrudeSetupData()
    {
        return $this->crudeSetup->getJSData();
    }

    /**
     * Prepare default crude setup
     * @return self
     */
    public function prepareCrudeSetup()
    {
        if (method_exists($this, 'prepareModelCrudeSetup'))
            return $this->prepareModelCrudeSetup();

        $this->crudeSetup = new CrudeSetup($this->getCalledClassName(), []);

        return $this;
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
