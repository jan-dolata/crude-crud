<?php

namespace JanDolata\CrudeCRUD\Http\Controllers;

use Illuminate\Routing\Controller;
use Illuminate\Http\Request;
use JanDolata\CrudeCRUD\Http\Controllers\Traits\ApiResponseTrait;
use JanDolata\CrudeCRUD\Http\Requests\ApiRequest;
use JanDolata\CrudeCRUD\Engine\CrudeInstance;

class ApiController extends Controller
{

    use ApiResponseTrait;

    /**
     * Fetch collection
     */
    public function index(Request $request, $crudeName)
    {
        $crude = CrudeInstance::get($crudeName);

        if (! $crude instanceof \JanDolata\CrudeCRUD\Engine\Interfaces\CrudeInterface)
            return $this->forbiddenResponse();

        $page = $request->input('page', 1);
        $numRows = $request->input('numRows', 20);
        $sortAttr = $request->input('sortAttr', 'id');
        $sortOrder = $request->input('sortOrder', 'asc');
        $searchAttr = $request->input('searchAttr', 'id');
        $searchValue = $request->input('searchValue', '');

        $collection = $crude->getFiltered($page, $numRows, $sortAttr, $sortOrder, $searchAttr, $searchValue);
        $count = $crude->countFiltered($searchAttr, $searchValue);
        $numPages = ceil($count / $numRows);

        return $this->successResponse([
            'collection' => $collection,
            'numPages' => $numPages,
            'count' => $count,
        ]);
    }

    /**
     * Add new model
     */
    public function store(ApiRequest $request, $crudeName)
    {
        $crude = CrudeInstance::get($crudeName);

        if (! $crude instanceof \JanDolata\CrudeCRUD\Engine\Interfaces\CrudeInterface)
            return $this->forbiddenResponse();

        if (! $crude instanceof \JanDolata\CrudeCRUD\Engine\Interfaces\CrudeStoreInterface)
            return $this->forbiddenResponse();

        $model = $crude->store($request->all());

        return $this->successResponse([
            'model' => $model,
            'message' => trans('crude.item_has_been_saved')
        ]);
    }

    /**
     * Update model
     */
    public function update(ApiRequest $request, $crudeName, $id)
    {
        $crude = CrudeInstance::get($crudeName);

        if (! $crude instanceof \JanDolata\CrudeCRUD\Engine\Interfaces\CrudeInterface)
            return $this->forbiddenResponse();

        if (! $crude instanceof \JanDolata\CrudeCRUD\Engine\Interfaces\CrudeUpdateInterface)
            return $this->forbiddenResponse();

        $model = $crude->updateById($id, $request->all());

        return $this->successResponse([
            'message' => trans('admin.item_has_been_updated')
        ]);
    }

    /**
     * Remove model
     */
    public function destroy($crudeName, $id)
    {
        // try {
        //     $model = (new ProjectInstance)->model($crudeName);
        //     $model->deleteById($id);
        //     return $this->successResponse([
        //         'message' => trans('admin.item_has_been_removed')
        //     ]);
        // } catch (Exception $e) {
        //     dd( 'Exception: ' .  $e->getMessage() );
        // }
    }

}
