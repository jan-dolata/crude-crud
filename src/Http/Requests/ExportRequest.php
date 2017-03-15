<?php

namespace JanDolata\CrudeCRUD\Http\Requests;

use JanDolata\CrudeCRUD\Http\Requests\Abstracts\BaseRequest;
use JanDolata\CrudeCRUD\Engine\CrudeInstance;

class ExportRequest extends BaseRequest
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

        if ($crude->cannotExport())
            return false;

        $this->crude = $crude;

        return true;
    }
    
}
