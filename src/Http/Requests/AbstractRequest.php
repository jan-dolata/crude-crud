<?php

namespace JanDolata\CrudeCRUD\Http\Requests;

use App\Http\Requests\Request;
use JanDolata\CrudeCRUD\Engine\CrudeInstance;

abstract class AbstractRequest extends Request
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
