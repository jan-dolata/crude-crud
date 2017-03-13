<?php

namespace JanDolata\CrudeCRUD\Http\Requests;

use JanDolata\CrudeCRUD\Http\Requests\CrudeRequest;
use JanDolata\CrudeCRUD\Engine\CrudeInstance;

abstract class AbstractRequest extends CrudeRequest
{

    public function attributes()
    {
        $crude = CrudeInstance::get($this->crudeName);

        if ($crude == null)
            return [];

        if (! $crude instanceof \JanDolata\CrudeCRUD\Engine\Interfaces\WithValidationInterface)
            return [];

        return $crude->getCrudeSetup()->getTrans();
    }
}
