<?php

namespace JanDolata\CrudeCRUD\Engine\CrudeSetupTrait;

trait PanelView
{

    /**
     * Single item on list
     *
     * @var boolean
     */
    protected $panelView = false;


    /**
     * Gets the Single item on list.
     *
     * @return boolean
     */
    public function getPanelView()
    {
        return $this->panelView;
    }

    /**
     * Sets the Single item on list.
     *
     * @param boolean $panelView the panel view
     *
     * @return self
     */
    public function setPanelView($panelView)
    {
        $this->panelView = $panelView;

        return $this;
    }

    public function panel()
    {
        $this->lockAddOption();
        $this->lockDeleteOption();
        return $this->setPanelView(true);
    }
}
