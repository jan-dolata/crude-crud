<?php

namespace JanDolata\CrudeCRUD\Engine;

use JanDolata\CrudeCRUD\Engine\CrudeSetup;
use JanDolata\CrudeCRUD\Engine\Traits\WithPermissionTrait;

abstract class Crude
{

    use WithPermissionTrait;

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

    public function can($optionName)
    {
        $option = $this->crudeSetup->haveOption($optionName);

        if ($optionName == 'add')
            return $option &&
                $this instanceof \JanDolata\CrudeCRUD\Engine\Interfaces\StoreInterface;

        if ($optionName == 'edit')
            return $option &&
                $this instanceof \JanDolata\CrudeCRUD\Engine\Interfaces\UpdateInterface;

        if ($optionName == 'delete')
            return $option &&
                $this instanceof \JanDolata\CrudeCRUD\Engine\Interfaces\DeleteInterface;

        return $option;
    }

    public function cannot($optionName)
    {
        return ! $this->can($optionName);
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
