<?php

namespace JanDolata\CrudeCRUD\Http\Requests;

use JanDolata\CrudeCRUD\Http\Requests\ApiRequest;
use JanDolata\CrudeCRUD\Engine\CrudeInstance;

class ApiStoreRequest extends ApiRequest
{

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        $crude = CrudeInstance::get($this->crudeName);

        if ($crude == null)
            return [];

        if (! $crude instanceof \JanDolata\CrudeCRUD\Engine\Interfaces\WithValidationInterface)
            return [];

        $attr = $crude->getCrudeSetup()->getAddForm();

        return $crude->getValidationRules($attr);
    }
}

