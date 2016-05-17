<?php

namespace JanDolata\CrudeCRUD\Http\Controllers;

use Illuminate\Routing\Controller;
use Illuminate\Http\Request;
use JanDolata\CrudeCRUD\Http\Controllers\Traits\ApiResponseTrait;
use JanDolata\CrudeCRUD\Engine\CrudeInstance;
use JanDolata\CrudeCRUD\Http\Requests\ApiRequest;
use JanDolata\CrudeCRUD\Http\Requests\ApiUpdateRequest;
use JanDolata\CrudeCRUD\Http\Requests\ApiStoreRequest;


class ApiController extends Controller
{

    use ApiResponseTrait;

    /**
     * Releated crude instance
     * @var Crude instance
     */
    protected $crude;

    function __construct(Request $request)
    {
        $this->crude = CrudeInstance::get($request->crudeName);
    }

    /**
     * Fetch collection
     */
    public function index(ApiRequest $request)
    {
        $page = $request->input('page', 1);
        $numRows = $request->input('numRows', config('crude.defaults.numRows'));
        $sortAttr = $request->input('sortAttr', config('crude.defaults.sortAttr'));
        $sortOrder = $request->input('sortOrder', config('crude.defaults.sortOrder'));
        $searchAttr = $request->input('searchAttr', config('crude.defaults.searchAttr'));
        $searchValue = $request->input('searchValue', '');

        $count = $this->crude->countFiltered($searchAttr, $searchValue);
        $numPages = $numRows > 0
            ? ceil($count / $numRows)
            : 1;

        if ($page < 1)
            $page = 1;
        if ($page > $numPages)
            $page = $numPages;

        // if ($numRows > $count)
            // $numRows = $count;


        $collection = $this->crude->getFiltered($page, $numRows, $sortAttr, $sortOrder, $searchAttr, $searchValue);

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
        ]);
    }

    /**
     * Add new model
     */
    public function store(ApiStoreRequest $request, $crudeName)
    {
        if (! $this->crude instanceof \JanDolata\CrudeCRUD\Engine\Interfaces\StoreInterface)
            return $request->forbiddenResponse();

        $model = $this->crude->store($request->all());

        return $this->successResponse([
            'model' => $model,
            'message' => trans('crude.item_has_been_saved')
        ]);
    }

    /**
     * Update model
     */
    public function update(ApiUpdateRequest $request, $crudeName, $id)
    {
        if (! $this->crude instanceof \JanDolata\CrudeCRUD\Engine\Interfaces\UpdateInterface)
            return $request->forbiddenResponse();

        $model = $this->crude->updateById($id, $request->all());

        return $this->successResponse([
            'message' => trans('admin.item_has_been_updated')
        ]);
    }

    /**
     * Remove model
     */
    public function destroy(ApiRequest $request, $crudeName, $id)
    {
        if (! $this->crude instanceof \JanDolata\CrudeCRUD\Engine\Interfaces\DeleteInterface)
            return $request->forbiddenResponse();

        $model = $this->crude->deleteById($id);

        return $this->successResponse([
            'message' => trans('admin.item_has_been_removed')
        ]);
    }

}
