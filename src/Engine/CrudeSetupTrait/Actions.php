<?php

namespace JanDolata\CrudeCRUD\Engine\CrudeSetupTrait;

trait Actions
{
    /**
     * Action, one of { form, map, file, thumbnail }
     *
     * @var array
     */
    protected $actions = [];

    /**
     * Gets the Action
     *
     * @return array
     */
    public function getActions()
    {
        return $this->actions;
    }

    /**
     * Sets the Action
     *
     * @param array $actions the actions
     *
     * @return self
     */
    public function setActions(array $actions)
    {
        $this->actions = $actions;

        return $this;
    }

    /**
     * Set 'form' action
     */
    private function setFormAction()
    {
        array_push($this->actions, 'form');

        return $this;
    }

    /**
     * Set 'map' action
     */
    private function setMapAction()
    {
        array_push($this->actions, 'map');

        $this->addForm = array_diff($this->addForm, ['map_lat', 'map_lng', 'map_address', 'map_province', 'map_locality', 'map_postal_code']);
        $this->editForm = array_diff($this->addForm, ['map_lat', 'map_lng', 'map_address', 'map_province', 'map_locality', 'map_postal_code']);

        return $this;
    }

    /**
     * Set 'file' action
     */
    private function setFileAction()
    {
        array_push($this->actions, 'file');

        $this->addForm = array_diff($this->addForm, ['files']);
        $this->editForm = array_diff($this->addForm, ['files']);

        $this->setModelDefaults('files', []);
        $this->setColumnFormat('files', 'files');

        return $this;
    }

    /**
     * Set 'thumbnail' action
     */
    public function setThumbnailAction()
    {
        array_push($this->actions, 'thumbnail');

        return $this;
    }
}
