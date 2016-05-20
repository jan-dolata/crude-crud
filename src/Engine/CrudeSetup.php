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
     * Setup title
     * @var string
     */
    protected $title = '';

    /**
     * Model attributes on list
     * @var array
     */
    protected $column = [];

    /**
     * Model attributes format on list
     * ['name' => ['type' => 'link', 'url' => route(), 'attribute' => 'name']]
     * @var array
     */
    protected $columnFormat = [];

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
     * Data to select field
     * @var array
     */
    protected $selectOptions = [];

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
            'title'         => $this->title,
            'column'        => $this->column,
            'columnFormat'  => $this->columnFormat,
            'addForm'       => $this->addForm,
            'editForm'      => $this->editForm,
            'inputType'     => $this->inputType,
            'actions'       => $this->actions,
            'deleteOption'  => $this->deleteOption,
            'editOption'    => $this->editOption,
            'addOption'     => $this->addOption,
            'modelDefaults' => $this->modelDefaults,
            'selectOptions' => $this->selectOptions,

            'config' => [
                'routePrefix'    => config('crude.routePrefix'),
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
     * @param  string|array $attr
     * @param  string $format
     * @return self
     */
    public function setColumnFormat($attr, $format = null)
    {
        if (is_array($attr))
            $this->columnFormat = array_merge($this->columnFormat, $attr);
        else
            $this->columnFormat[$attr] = $format;

        return $this;
    }

    /**
     * Set new or change input types
     * @param  string|array $types
     * @param  array $attr
     * @return self
     */
    public function setTypesGroup($types, $attr = null)
    {
        if (! is_array($types))
            $types = [$types => $attr];

        foreach ($types as $type => $attrList) {
            if (! is_array($attrList))
                $attrList = [$attrList];

            foreach ($attrList as $attr)
                $this->inputType[$attr] = $type;
        }

        return $this;
    }

    /**
     * Set new model defaults value
     * @param  string|array $attr
     * @param  array $value
     * @return self
     */
    public function setModelDefaults($attr, $value = null)
    {
        if (is_array($attr))
            $this->modelDefaults = array_merge($this->modelDefaults, $attr);
        else
            $this->modelDefaults[$attr] = $value;

        return $this;
    }

    /**
     * Set title
     * @param  string $title
     * @return self
     */
    public function setTitle($title)
    {
        $this->title = $title;

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

    public function setAddAndEditForm($form)
    {
        return $this
            ->setAddForm($form)
            ->setEditForm($form);
    }

    /**
     * Get add form attributes list
     * @return  array $addForm
     */
    public function getAddForm()
    {
        return $this->addForm;
    }

    /**
     * Get edit form attributes list
     * @return  array $editForm
     */
    public function getEditForm()
    {
        return $this->editForm;
    }

    public function setSelectOptions($attr, $options = null)
    {
        $optionsList = is_array($attr)
            ? $attr
            : [$attr => $options];

        $this->selectOptions = array_merge($this->selectOptions, $optionsList);

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

    private function setFormAction()
    {
        array_push($this->actions, 'form');
    }

    private function setMapAction()
    {
        array_push($this->actions, 'map');

        $this->modelDefaults = array_merge($this->modelDefaults, [
            'lat' => config('crude.mapDefaults')['lat'],
            'lng' => config('crude.mapDefaults')['lng'],
            'address' => ''
        ]);

        $this->addForm = array_diff($this->addForm, ['lat', 'lng', 'address']);
        $this->editForm = array_diff($this->addForm, ['lat', 'lng', 'address']);
    }

    private function setFileAction()
    {
        array_push($this->actions, 'file');

        $this->modelDefaults = array_merge($this->modelDefaults, [
            'files' => []
        ]);

        $this->addForm = array_diff($this->addForm, ['files']);
        $this->editForm = array_diff($this->addForm, ['files']);
    }
}
