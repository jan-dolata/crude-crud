<?php

namespace JanDolata\CrudeCRUD\Engine;

class CrudeSetup
{

    use \JanDolata\CrudeCRUD\Engine\CrudeSetupTrait\Title;
    use \JanDolata\CrudeCRUD\Engine\CrudeSetupTrait\Name;
    use \JanDolata\CrudeCRUD\Engine\CrudeSetupTrait\Column;
    use \JanDolata\CrudeCRUD\Engine\CrudeSetupTrait\ColumnFormat;
    use \JanDolata\CrudeCRUD\Engine\CrudeSetupTrait\Form;
    use \JanDolata\CrudeCRUD\Engine\CrudeSetupTrait\Actions;
    use \JanDolata\CrudeCRUD\Engine\CrudeSetupTrait\Options;
    use \JanDolata\CrudeCRUD\Engine\CrudeSetupTrait\InputType;
    use \JanDolata\CrudeCRUD\Engine\CrudeSetupTrait\SelectOptions;
    use \JanDolata\CrudeCRUD\Engine\CrudeSetupTrait\Filters;
    use \JanDolata\CrudeCRUD\Engine\CrudeSetupTrait\ModelDefaults;
    use \JanDolata\CrudeCRUD\Engine\CrudeSetupTrait\Trans;
    use \JanDolata\CrudeCRUD\Engine\CrudeSetupTrait\ModuleInPopup;
    use \JanDolata\CrudeCRUD\Engine\CrudeSetupTrait\CustomActions;
    use \JanDolata\CrudeCRUD\Engine\CrudeSetupTrait\PanelView;
    use \JanDolata\CrudeCRUD\Engine\CrudeSetupTrait\OrderParameters;

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
        $mapAttr = ['lat', 'lng', 'address'];
        if (count(array_intersect($mapAttr, $formAttr)) == count($mapAttr))
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
            'orderOption'   => $this->orderOption,
            'exportOption'  => $this->exportOption,
            'modelDefaults' => $this->modelDefaults,
            'selectOptions' => $this->selectOptions,
            'filters'       => $this->filters,
            'trans'         => $this->trans,
            'moduleInPopup' => $this->moduleInPopup,
            'customActions' => $this->customActions,
            'panelView'     => $this->panelView,
            'orderParameters' => $this->orderParameters,

            'config' => [
                'routePrefix'    => config('crude.routePrefix'),
                'numRowsOptions' => config('crude.numRowsOptions'),
                'iconClassName'  => config('crude.iconClassName'),
                'refreshAll'     => config('crude.refreshAll'),
                'sortAttr'       => $this->getOrderAttribute()
            ],
        ];
    }

}
