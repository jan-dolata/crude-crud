<?php

namespace JanDolata\CrudeCRUD\Engine\CrudeSetupTrait;

trait Actions
{
    /**
     * Action, one of { form, map, file }
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
    }

    /**
     * Set 'map' action
     */
    private function setMapAction()
    {
        array_push($this->actions, 'map');

        $this->setModelDefaults([
            'lat' => config('crude.mapDefaults')['lat'],
            'lng' => config('crude.mapDefaults')['lng'],
            'address' => ''
        ]);

        $this->addForm = array_diff($this->addForm, ['lat', 'lng', 'address']);
        $this->editForm = array_diff($this->addForm, ['lat', 'lng', 'address']);
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
    }
}
