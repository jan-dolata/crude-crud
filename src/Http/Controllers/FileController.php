<?php

namespace JanDolata\CrudeCRUD\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;
use JanDolata\CrudeCRUD\Http\Controllers\Controller;
use JanDolata\CrudeCRUD\Engine\Models\FileLog;
use JanDolata\CrudeCRUD\Engine\CrudeInstance;
use JanDolata\CrudeCRUD\Http\Requests\FileRequest;
use Storage;
use Validator;

class FileController extends Controller
{
    /**
     * Handle files upload
     * file on model is a helper field
     * @author Wojciech Jurkowski <w.jurkowski@holonglobe.com>
     */
    public function upload(FileRequest $request)
    {
        $crude = CrudeInstance::get($request->input('crudeName'));
        $files = $request->file()['file'];

        if ($crude instanceof \JanDolata\CrudeCRUD\Engine\Interfaces\WithValidationInterface) {
            $rules = $crude->getValidationRules(['file']);

            foreach($files as $file) {
                $validator = Validator::make(['file' => $file], $rules);

                if ($validator->fails()){
                    return ['success' => false, 'errors' => $validator->errors()];
                }
            }
        }

        $id = $request->input('modelId');
        $model = $crude->uploadFilesById($id, $files);

        return ['success' => true, 'model' => $model];
    }

    /**
     * delete file
     * @author Wojciech Jurkowski <w.jurkowski@holonglobe.com>
     */
    public function delete(FileRequest $request)
    {
        $log = (new FileLog)->findOrFail($request->input('file_log_id'));
        $crude = CrudeInstance::get($log->model_name);
        $model = $crude->deleteFileById($log);

        return ['model' => $model];
    }
}
