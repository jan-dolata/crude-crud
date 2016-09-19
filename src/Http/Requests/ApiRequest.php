<?php

namespace JanDolata\CrudeCRUD\Http\Requests;

use App\Http\Requests\Request;
use JanDolata\CrudeCRUD\Engine\CrudeInstance;

class ApiRequest extends Request
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

        return $crude->canView();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [];
    }

}

