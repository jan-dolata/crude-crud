<?php

namespace JanDolata\CrudeCRUD\Http\Requests;

use JanDolata\CrudeCRUD\Http\Requests\Abstracts\RequestWithAttributes;
use JanDolata\CrudeCRUD\Engine\CrudeInstance;

class ApiStoreRequest extends RequestWithAttributes
{

    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        $crude = CrudeInstance::get($this->crudeName);

        if ($crude == null)
            return false;

        return $crude->canView() && $crude->canStore('check with permission');
    }

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

        return $crude->getValidationRules($attr, $this->all());
    }
}
