<?php

namespace JanDolata\CrudeCRUD\Http\Controllers;

use JanDolata\CrudeCRUD\Http\Controllers\Controller;
use JanDolata\CrudeCRUD\Engine\CrudeInstance;
use JanDolata\CrudeCRUD\Http\Requests\ThumbnailRequest;
use Storage;

//todo validation

class ThumbnailController extends Controller
{
    /**
     * Handle thumbnail upload
     * @author Wojciech Jurkowski <w.jurkowski@holonglobe.com>
     */
    public function upload(ThumbnailRequest $request)
    {
        $crudeName = $request->input('crudeName');
        $crude = CrudeInstance::get($crudeName);
        $column = $request->input('columnName');
        $file = $request->file()['file'];

        $id = $request->input('modelId');
        $model = $crude->uploadThumbnailByIdAndColumn($id, $column, $file);

        return ['success' => true, 'model' => $model];
    }

    /**
     * delete thumbnail file
     * @author Wojciech Jurkowski <w.jurkowski@holonglobe.com>
     */
    public function delete(ThumbnailRequest $request)
    {
        $crudeName = $request->input('crudeName');
        $crude = CrudeInstance::get($crudeName);
        $id = $request->input('model_id');
        $column = $request->input('model_column');

        $model = $crude->deleteThumbnailByIdAndColumn($id, $column);

        return ['model' => $model];
    }
}
