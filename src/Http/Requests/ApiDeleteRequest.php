<?php

namespace JanDolata\CrudeCRUD\Http\Requests;

use JanDolata\CrudeCRUD\Http\Requests\Abstracts\BaseRequest;
use JanDolata\CrudeCRUD\Engine\CrudeInstance;

class ApiDeleteRequest extends BaseRequest
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

        return $crude->canDelete($model);
    }
}
