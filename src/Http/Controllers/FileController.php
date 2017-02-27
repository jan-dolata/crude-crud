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
use JanDolata\CrudeCRUD\Engine\Helpers\CrudeZip;

class FileController extends Controller
{
    /**
     * Handle files upload
     * file on model is a helper field
     * @author Wojciech Jurkowski <w.jurkowski@holonglobe.com>
     */
    public function upload(FileRequest $request)
    {
        $crudeName = $request->input('crudeName');
        $crude = CrudeInstance::get($crudeName);
        $files = $request->file()['file'];
        $id = $request->input('modelId');
        $errors = [];

        if ($crude instanceof \JanDolata\CrudeCRUD\Engine\Interfaces\WithValidationInterface) {
            foreach($files as $key => $file) {
                $rules = $crude->getValidationRules(['file']);

                $mime = $file->getMimeType();
                $fileTypeRules = 'file_'.collect(explode('/', $mime))->first();

                empty($crude->getValidationRules([$fileTypeRules])[$fileTypeRules])
                    ? $rules = $rules
                    : $rules['file'] = $rules['file'] . '|' . $crude->getValidationRules([$fileTypeRules])[$fileTypeRules];

                $validator = Validator::make(['file' => $file], $rules);

                if ($validator->fails()) {
                    unset($files[$key]);
                    $errors[] = $file->getClientOriginalName() . ': '. $validator->messages()->first();
                }
            }
        }

        $model = empty($files)
            ? $crude->getById($id)
            : $crude->uploadFilesById($id, $files);

        $response = ['success' => true, 'model' => $model];

        if (!empty($errors)) {
            $response = array_merge($response, ['errors' => join('<br/>', $errors)]);
            $response['success'] = false;
        }

        return $response;
    }

    /**
     * delete file
     * @author Wojciech Jurkowski <w.jurkowski@holonglobe.com>
     */
    public function delete(FileRequest $request)
    {
        $crude = CrudeInstance::get($request->input('crudeName'));
        $model = $crude->deleteFileByData($request->input('crudeModelId'), $request->input('file_log_id'));

        return ['model' => $model];
    }

    /**
     * Download file
     */
    public function download(Request $request)
    {
        $path = $request->input('path');
        $name = $request->input('name');

        $path = parse_url($path)['path'];
        $file = storage_path('app' . $path);
        return response()->download($file, $name);
    }

    /**
     * Download all files for model
     */
    public function downloadAll($crudeName = null, $id = null)
    {
        if (! $crudeName || ! $id)
            return redirect()->back();

        $crude = CrudeInstance::get($crudeName);
        if (! $crude)
            return redirect()->back();

        $model = $crude->getModel()->find($id);
        if (! $model)
            return redirect()->back();

        $filesZip = CrudeZip::run($model);
        if (! $filesZip)
            return redirect()->back();

        return response()->download($filesZip, $crudeName . '-' . $id . '.zip')->deleteFileAfterSend(true);
    }
}
