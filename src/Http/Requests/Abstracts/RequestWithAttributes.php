<?php

namespace JanDolata\CrudeCRUD\Http\Requests\Abstracts;

use JanDolata\CrudeCRUD\Http\Requests\Abstracts\BaseRequest;
use JanDolata\CrudeCRUD\Engine\CrudeInstance;

abstract class RequestWithAttributes extends BaseRequest
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
