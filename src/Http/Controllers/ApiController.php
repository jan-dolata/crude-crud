<?php

namespace JanDolata\CrudeCRUD\Http\Controllers;

use Illuminate\Routing\Controller;
use Illuminate\Http\Request;
use JanDolata\CrudeCRUD\Http\Controllers\Traits\ApiResponseTrait;
use JanDolata\CrudeCRUD\Engine\CrudeInstance;
use JanDolata\CrudeCRUD\Http\Requests\ApiRequest;
use JanDolata\CrudeCRUD\Http\Requests\ApiUpdateRequest;
use JanDolata\CrudeCRUD\Http\Requests\ApiStoreRequest;
use JanDolata\CrudeCRUD\Http\Requests\ApiDeleteRequest;

class ApiController extends Controller
{

    use ApiResponseTrait;

    /**
     * Releated crude instance
     * @var Crude instance
     */
    protected $crude;

    /**
     * Fetch collection
     */
    public function index(ApiRequest $request)
    {
        $this->crude = CrudeInstance::get($request->crudeName);

        $page = $request->input('page', 1);
        $numRows = $request->input('numRows', config('crude.defaults.numRows'));
        $sortAttr = $request->input('sortAttr', config('crude.defaults.sortAttr'));
        $sortOrder = $request->input('sortOrder', config('crude.defaults.sortOrder'));
        $searchAttr = $request->input('searchAttr', config('crude.defaults.searchAttr'));
        $searchValue = $request->input('searchValue', '');
        $richFilters = $request->input('richFilters', []);

        $count = $this->crude->countFiltered($searchAttr, $searchValue, $richFilters);
        $numPages = $numRows > 0
            ? ceil($count / $numRows)
            : 1;

        if ($page < 1)
            $page = 1;
        if ($page > $numPages)
            $page = $numPages;

        // if ($numRows > $count)
            // $numRows = $count;

        $collection = $this->crude->getFiltered($page, $numRows, $sortAttr, $sortOrder, $searchAttr, $searchValue, $richFilters);

        return $this->successResponse([
            'collection' => $collection,
            'pagination' => [
                'page' => $page,
                'numRows' => $numRows,
                'numPages' => $numPages,
                'count' => $count,
            ],
            'sort' => [
                'attr' => $sortAttr,
                'order' => $sortOrder
            ],
            'search' => [
                'attr' => $searchAttr,
                'value' => $searchValue
            ],

            'setup' => $this->crude->getCrudeSetupData()
        ]);
    }

    /**
     * Add new model
     */
    public function store(ApiStoreRequest $request, $crudeName)
    {
        $this->crude = CrudeInstance::get($request->crudeName);

        $model = $this->crude->store($request->all());

        return $this->successResponse([
            'model' => $model,
            'message' => $this->crude->getCrudeSetup()->trans('item_has_been_saved')
        ]);
    }

    /**
     * Update model
     */
    public function update(ApiUpdateRequest $request, $crudeName, $id)
    {
        $this->crude = CrudeInstance::get($request->crudeName);

        $model = $this->crude->updateById($id, $request->all());

        return $this->successResponse([
            'model' => $model,
            'message' => $this->crude->getCrudeSetup()->trans('item_has_been_updated')
        ]);
    }

    /**
     * Remove model
     */
    public function destroy(ApiDeleteRequest $request, $crudeName, $id)
    {
        $this->crude = CrudeInstance::get($request->crudeName);

        $model = $this->crude->deleteById($id);

        return $this->successResponse([
            'message' => $this->crude->getCrudeSetup()->trans('item_has_been_removed')
        ]);
    }

}
