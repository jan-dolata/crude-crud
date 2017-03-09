<?php

namespace JanDolata\CrudeCRUD\Engine;

class CrudeSetup
{

    use \JanDolata\CrudeCRUD\Engine\CrudeSetupTrait\Title;
    use \JanDolata\CrudeCRUD\Engine\CrudeSetupTrait\Name;
    use \JanDolata\CrudeCRUD\Engine\CrudeSetupTrait\Description;
    use \JanDolata\CrudeCRUD\Engine\CrudeSetupTrait\Column;
    use \JanDolata\CrudeCRUD\Engine\CrudeSetupTrait\ExtraColumn;
    use \JanDolata\CrudeCRUD\Engine\CrudeSetupTrait\ColumnFormat;
    use \JanDolata\CrudeCRUD\Engine\CrudeSetupTrait\CsvColumn;
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
    use \JanDolata\CrudeCRUD\Engine\CrudeSetupTrait\ThumbnailColumns;
    use \JanDolata\CrudeCRUD\Engine\CrudeSetupTrait\DateTimePickerOptions;
    use \JanDolata\CrudeCRUD\Engine\CrudeSetupTrait\CheckboxColumn;
    use \JanDolata\CrudeCRUD\Engine\CrudeSetupTrait\DefaultSortAttr;
    use \JanDolata\CrudeCRUD\Engine\CrudeSetupTrait\RichFilters;
    use \JanDolata\CrudeCRUD\Engine\CrudeSetupTrait\InterfaceTrans;

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
        $mapAttr = ['map_lat', 'map_lng'];
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
            'description'   => $this->description,
            'column'        => $this->column,
            'extraColumn'   => $this->extraColumn,
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
            'richFilters'   => $this->richFilters,
            'showFilters'   => $this->showFilters,
            'trans'         => $this->trans,
            'moduleInPopup' => $this->moduleInPopup,
            'customActions' => $this->customActions,
            'panelView'     => $this->panelView,
            'orderParameters' => $this->orderParameters,
            'checkboxColumn' => $this->checkboxColumn,
            'defaultSortAttr' => $this->defaultSortAttr,
            'defaultSortOrder' => $this->defaultSortOrder,
            'interfaceTrans' => $this->getInterfaceTrans(),
            'thumbnailColumns' => $this->getThumbnailColumns(),
            'dateTimePickerOptions' => $this->getDateTimePickerOptions(),

            'config' => [
                'routePrefix'    => config('crude.routePrefix'),
                'numRowsOptions' => config('crude.numRowsOptions'),
                'iconClassName'  => config('crude.iconClassName'),
                'refreshAll'     => config('crude.refreshAll'),
                'mapCenter'      => config('crude.mapCenter'),
                'sortAttr'       => $this->getOrderAttribute(),
            ],
        ];
    }

}
