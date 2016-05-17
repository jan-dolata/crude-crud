<?php

namespace JanDolata\CrudeCRUD\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;
use JanDolata\CrudeCRUD\Http\Controllers\Controller;
use JanDolata\CrudeCRUD\Engine\CrudeInstance;
use Storage;
use Validator;

class FilesController extends Controller
{
    /**
     * Handle files upload
     * file on model is a helper field
     * @author Wojciech Jurkowski <w.jurkowski@holonglobe.com>
     */
    public function upload(Request $request)
    {
        $input = $request->all();
        $crude = CrudeInstance::get($input['crudeName']);
        $rules = $crude->getValidationRules(['file']);

        foreach($input['file'] as $file) {
            $validator = Validator::make(['file' => $file], $rules);

            if ($validator->fails()){
                return ['success' => false, 'errors' => $validator->errors()];
            }
        }

        $id = $request->input('modelId');
        $model = $crude->getById($id);
        $filesArray = $model->files;

        foreach($input['file'] as $file) {

            $fileLogName = '\\' . config('crude.fileLogModelNamespace');
            $log = (new $fileLogName)->create([
                'model_id' => $input['modelId'],
                'model_name' => $input['crudeName'],
                'file_original_name' => $file->getClientOriginalName(),
            ]);

            $systemFileName = $this->createSystemFileName($log, $file);
            $filePath = $this->createFilePath($input['crudeName'], $systemFileName);

            Storage::put(
                $filePath,
                file_get_contents($file->path())
            );

            $log->fill([
                'file_path' => $filePath,
                'file_system_name' => $systemFileName
            ])->save();

            $filesArray[] = [
                'file_log_id' => $log->id,
                'path' => asset($log->file_path),
                'file_original_name' => $log->file_original_name
            ];
        }

        $model = $crude->updateById($id, ['files' => $filesArray]);

        return ['success' => true, 'model' => $model];
    }

    /**
     * delete file
     * @author Wojciech Jurkowski <w.jurkowski@holonglobe.com>
     */
    public function delete(Request $request)
    {
        $input = $request->all();
        $fileLogName = '\\' . config('crude.fileLogModelNamespace');
        $log = (new $fileLogName)->findOrFail($input['file_log_id']);
        $crude = CrudeInstance::get($log->model_name);
        $model = $crude->getModel()->findOrFale($log->model_id);

        Storage::delete($log->file_path);

        $updatedFiles = [];
        foreach($model->files as $file){
            if ($file['file_log_id'] == $log->id) continue;

            $updatedFiles[] = $file;
        }

        $model->fill(['files' => $updatedFiles])->save();
        $log->delete();

        return ['model' => $model];
    }

    /**
    * Create file path
    * @author Wojciech Jurkowski <w.jurkowski@holonglobe.com>
    */
    private function createFilePath($crudeName, $systemFileName)
    {
        return  config('crude.uploadFolder') . Str::lower($crudeName) . '/' . $systemFileName;
    }

    /**
    * Create system file name
    * @author Wojciech Jurkowski <w.jurkowski@holonglobe.com>
    */
    private function createSystemFileName($log, $file)
    {
        return $log->id . '_' . time() . '.' . $file->getClientOriginalExtension();
    }
}
