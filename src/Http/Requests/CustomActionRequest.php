<?php

namespace JanDolata\CrudeCRUD\Http\Requests;

use App\Http\Requests\Request;
use JanDolata\CrudeCRUD\Engine\CrudeInstance;

class CustomActionRequest extends Request
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

        if ($crude->cannotView())
            return false;

        $model = $crude->getById($this->id);

        $permission = $this->action . 'CustomActionPermission';
        if (method_exists($crude, $permission) && ! $crude->$permission($model))
            return false;

        $method = $this->action . 'CustomAction';
        if (! method_exists($crude, $method))
            return false;

        $this->crude = $crude;
        $this->model = $model;

        return true;
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

