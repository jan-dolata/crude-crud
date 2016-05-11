<?php

namespace JanDolata\CrudeCRUD\Http\Controllers;

use Illuminate\Routing\Controller;
use Illuminate\Http\Request;
use JanDolata\CrudeCRUD\Engine\ProjectInstance;
use JanDolata\CrudeCRUD\Http\Controllers\ApiResponseTrait;
use JanDolata\CrudeCRUD\Http\Requests\ApiRequest;

class ApiController extends Controller
{

    use ApiResponseTrait;

    /**
     * Related model name
     *
     * @var string
     */
    protected $modelName = '';

    /**
     * Fetch collection
     */
    public function index(Request $request, $modelName)
    {
        $page = $request->input('page', 1);
        $numRows = $request->input('numRows', 20);
        $sortAttr = $request->input('sortAttr', 'id');
        $sortOrder = $request->input('sortOrder', 'asc');
        $searchAttr = $request->input('searchAttr', 'id');
        $searchValue = $request->input('searchValue', '');

        try {
            $model = (new ProjectInstance)->model($modelName);
            $collection = $model->getAll($page, $numRows, $sortAttr, $sortOrder, $searchAttr, $searchValue);

            $count = $model->countFiltered($searchAttr, $searchValue);
            $numPages = ceil($count / $numRows);

            return $this->successResponse([
                'collection' => $collection,
                'numPages' => $numPages,
                'count' => $count,
            ]);
        } catch (Exception $e) {
            dd( 'Exception: ' .  $e->getMessage() );
        }
    }

    /**
     * Add new model
     */
    public function store(ApiRequest $request, $modelName)
    {
        try {
            $model = (new ProjectInstance)->model($modelName);
            $model = $model->create($request->all());
            return $this->successResponse([
                'model' => $model,
                'message' => trans('admin.item_has_been_saved')
            ]);
        } catch (Exception $e) {
            dd( 'Exception: ' .  $e->getMessage() );
        }
    }

    /**
     * Update model
     */
    public function update(ApiRequest $request, $modelName, $id)
    {
        try {
            $model = (new ProjectInstance)->model($modelName);
            $model->updateById($id, $request->all());
            return $this->successResponse([
                'message' => trans('admin.item_has_been_updated')
            ]);
        } catch (Exception $e) {
            dd( 'Exception: ' .  $e->getMessage() );
        }
    }

    /**
     * Remove model
     */
    public function destroy($modelName, $id)
    {
        try {
            $model = (new ProjectInstance)->model($modelName);
            $model->deleteById($id);
            return $this->successResponse([
                'message' => trans('admin.item_has_been_removed')
            ]);
        } catch (Exception $e) {
            dd( 'Exception: ' .  $e->getMessage() );
        }
    }

}
