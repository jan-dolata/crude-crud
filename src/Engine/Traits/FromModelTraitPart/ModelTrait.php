<?php

namespace JanDolata\CrudeCRUD\Engine\Traits\FromModelTraitPart;

use JanDolata\CrudeCRUD\Engine\CrudeSetup;

trait ModelTrait
{
    /**
     * Eloquent model
     * @var Eloquent model
     */
    protected $model;

    /**
     * Set model
     * @param  Eloquent model $model
     * @return self
     */
    public function setModel($model)
    {
        $this->model = $model;

        return $this;
    }

    /**
     * Get model
     * @return Eloquent model
     */
    public function getModel()
    {
        return $this->model;
    }

    /**
     * Prepare default crude setup
     * @return self
     */
    public function prepareModelCrudeSetup()
    {
        $crudeName = $this->getCalledClassName();
        $modelAttr = array_merge(['id'], $this->model->getFillable(), ['created_at']);

        foreach ($modelAttr as $attr)
            $this->scope[$attr] = $this->model->getTable() . '.' . $attr;

        $this->crudeSetup = new CrudeSetup($crudeName, $modelAttr);

        if ($this->cannotUpdate())
            $this->crudeSetup->lockEditOption();

        if ($this->cannotStore('check with permission'))
            $this->crudeSetup->lockAddOption();

        if ($this->cannotDelete())
            $this->crudeSetup->lockDeleteOption();

        if ($this->cannotOrder())
            $this->crudeSetup->lockOrderOption();

        $this->crudeSetup->setFilters(['id']);

        return $this->crudeSetup;
    }

}
