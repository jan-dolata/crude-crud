<?php

namespace JanDolata\CrudeCRUD\Engine;

use JanDolata\CrudeCRUD\Engine\CrudeSetup;
use JanDolata\CrudeCRUD\Engine\Traits\FromModelTrait;
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
        $this->crudeSetup->setFilters($this->crudeSetup->getColumnAttr());

        $data = $this->crudeSetup->getJSData();

        $data['fileAttrName'] = method_exists($this, 'getFileAttrName')
            ? $this->getFileAttrName()
            : 'files';

        return $data;
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

    public function getScope($attr = null)
    {
        if ($attr != null)
            return $this->scope[$attr];

        return $this->scope;
    }

    public function setScope($attr, $value = null)
    {
        if (! is_array($attr))
            $attr = [$attr => $value];

        $this->scope = array_merge($this->scope, $attr);

        return $this;
    }

    public function inScope($attr)
    {
        return isset($this->scope[$attr]) && ! empty($this->scope[$attr]);
    }

}
