<?php

namespace JanDolata\CrudeCRUD\Engine;

class CrudeSetup
{

    /**
     * Setup name
     * @var string
     */
    protected $name = '';

    /**
     * Model attributes on list
     * @var array
     */
    protected $column = [];

    /**
     * Type of add / edit form inputs
     * ['name_of_attr' => 'input_type']
     * @var array
     */
    protected $inputType = [];

    /**
     * Model attributes for add form
     * @var array
     */
    protected $addForm = [];

    /**
     * Model attributes for add form
     * @var array
     */
    protected $editForm = [];

    /**
     * Model action, one of { form, map, file }
     * @var array
     */
    protected $actions = [];

    /**
     * New JS model defaults values
     * @var array
     */
    protected $modelDefaults = [];

    /**
     * Show delete option
     * @var boolean
     */
    protected $deleteOption = true;

    /**
     * Show add option
     * @var boolean
     */
    protected $addOption = true;

    /**
     * Show edit option
     * @var boolean
     */
    protected $editOption = true;

    /**
     * Construct
     * @param  string $name
     * @param  array  $modelAttr
     * @return self
     */
    function __construct($name, $modelAttr)
    {
        $this->name = $name;
        $modelAttr = is_array($modelAttr) ? $modelAttr : [$modelAttr];

        $formAttr = array_diff($modelAttr, ['id', 'created_at', 'updated_at', 'deleted_at']);

        $this->column = $modelAttr;
        $this->addForm = $formAttr;
        $this->editForm = $formAttr;

        // add default form view
        $this->setFormAction();

        // add map view
        if (in_array('address', $formAttr))
            $this->setMapAction();

        // add file view
        if (in_array('files', $formAttr))
            $this->setFileAction();

        foreach ($formAttr as $attr)
            $this->inputType[$attr] = 'text';

        return $this;
    }

    /**
     * Prepare data for JS list config model
     * @return array
     */
    public function getJSData()
    {
        return [
            'name'          => $this->name,
            'column'        => $this->column,
            'addForm'       => $this->addForm,
            'editForm'      => $this->editForm,
            'inputType'     => $this->inputType,
            'actions'       => $this->actions,
            'deleteOption'  => $this->deleteOption,
            'editOption'    => $this->editOption,
            'addOption'     => $this->addOption,
            'modelDefaults' => $this->modelDefaults,

            'config' => [
                'routePrefix' => config('crude.routePrefix'),
                'numRowsOptions' => config('crude.numRowsOptions'),
                'iconClassName'  => config('crude.iconClassName')
            ],
        ];
    }

    /**
     * Set new or change input types
     * @param  string|array $attr
     * @param  string $type
     * @return self
     */
    public function setTypes($attr, $type = null)
    {
        if (is_array($attr))
            $this->inputType = array_merge($this->inputType, $attr);
        else
            $this->inputType[$attr] = $type;

        return $this;
    }

    /**
     * Set new or change input types
     * @param  array $types
     * @return self
     */
    public function setTypesGroup($types)
    {
        foreach ($types as $type => $attrList) {
            if (! is_array($attrList))
                $attrList = [$attrList];

            foreach ($attrList as $attr)
                $this->inputType[$attr] = $type;
        }

        return $this;
    }

    /**
     * Set new column list
     * @param  array $column
     * @return self
     */
    public function setColumn($column)
    {
        $this->column = $column;

        return $this;
    }

    /**
     * Set new action list
     * @param  array $action
     * @return self
     */
    public function setActions($actions)
    {
        $this->actions = $actions;

        return $this;
    }

    /**
     * Set add form attributes list
     * @param  array $addForm
     * @return self
     */
    public function setAddForm($addForm)
    {
        $this->addForm = $addForm;

        return $this;
    }

    /**
     * Set edit form attributes list
     * @param  array $editForm
     * @return self
     */
    public function setEditForm($editForm)
    {
        $this->editForm = $editForm;

        return $this;
    }

    public function lockEditOption()
    {
        $this->editOption = false;
        $this->setEditForm([]);

        return $this;
    }

    public function lockAddOption()
    {
        $this->addOption = false;
        $this->setAddForm([]);

        return $this;
    }

    public function lockDeleteOption()
    {
        $this->deleteOption = false;

        return $this;
    }

    public function setFormAction()
    {
        array_push($this->actions, 'form');
    }

    public function setMapAction()
    {
        array_push($this->actions, 'map');

        $this->modelDefaults = array_merge($this->modelDefaults, [
            'lat' => 52.03,
            'lng' => 19.27,
            'address' => ''
        ]);

        $this->addForm = array_diff($this->addForm, ['lat', 'lng', 'address']);
        $this->editForm = array_diff($this->addForm, ['lat', 'lng', 'address']);
    }

    public function setFileAction()
    {
        array_push($this->actions, 'file');

        $this->modelDefaults = array_merge($this->modelDefaults, [
            'files' => []
        ]);

        $this->addForm = array_diff($this->addForm, ['files']);
        $this->editForm = array_diff($this->addForm, ['files']);
    }
}
