<?php

namespace JanDolata\CrudeCRUD\Http\Requests;

use App\Http\Requests\Request;
use JanDolata\CrudeCRUD\Engine\ProjectInstance;

class ApiRequest extends Request
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        $model = (new ProjectInstance)->model($this->modelName, true);
        return $model->getValidationRules();
    }
}

