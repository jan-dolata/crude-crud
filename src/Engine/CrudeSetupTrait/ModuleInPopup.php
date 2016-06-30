<?php

namespace JanDolata\CrudeCRUD\Engine\CrudeSetupTrait;

trait ModuleInPopup
{

    /**
     * Show modules in popup
     *
     * @var boolean
     */
    protected $moduleInPopup = false;

    /**
     * Gets the Show modules in popup.
     *
     * @return boolean
     */
    public function getModuleInPopup()
    {
        return $this->moduleInPopup;
    }

    /**
     * Sets the Show modules in popup.
     *
     * @param boolean $moduleInPopup the module in popup
     *
     * @return self
     */
    public function setModuleInPopup($moduleInPopup)
    {
        $this->moduleInPopup = $moduleInPopup;

        return $this;
    }

    public function usePopup()
    {
        return $this->setModuleInPopup(true);
    }
}
