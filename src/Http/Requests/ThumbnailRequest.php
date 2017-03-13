<?php

namespace JanDolata\CrudeCRUD\Http\Requests;

use JanDolata\CrudeCRUD\Http\Requests\CrudeRequest;
use JanDolata\CrudeCRUD\Engine\CrudeInstance;

class ThumbnailRequest extends CrudeRequest
{

    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        $crude = CrudeInstance::get($this->input('crudeName'));

        if ($crude == null)
            return false;

        if (! $crude instanceof \JanDolata\CrudeCRUD\Engine\Interfaces\ListInterface)
            return false;

        if (! $crude instanceof \JanDolata\CrudeCRUD\Engine\Interfaces\WithThumbnailInterface)
            return false;

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

