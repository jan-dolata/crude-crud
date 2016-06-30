<?php

namespace JanDolata\CrudeCRUD\Http\Controllers;

use Illuminate\Routing\Controller;
use JanDolata\CrudeCRUD\Engine\CrudeInstance;
use JanDolata\CrudeCRUD\Http\Controllers\Traits\ApiResponseTrait;
use JanDolata\CrudeCRUD\Http\Requests\CustomActionRequest;

class CustomActionController extends Controller
{

    use ApiResponseTrait;

    public function execute(CustomActionRequest $request, $crudeName, $action, $id)
    {
        $method = $action . 'CustomAction';

        $message = $request->crude->$method($request->model);

        return $this->successResponse([
            'message' => $message
        ]);
    }

}
