<?php

namespace JanDolata\CrudeCRUD\Engine\Traits;

use JanDolata\CrudeCRUD\Engine\Models\FileLog;
use Illuminate\Support\Str;
use Storage;
use JanDolata\CrudeCRUD\Helpers\CrudeFiles;

trait WithFileTrait
{

    /**
     * Upload files
     * @param  integer $id   - model id
     * @param  array $files
     * @return Model
     */
    public function uploadFilesById($id, $files)
    {
        $crudeName = $this->getCalledClassName();
        $model = $this->getById($id);

        $model = (new CrudeFiles)->upload($model, $crudeName, $files);

        return $this->updateById($id, ['files' => $model->files]);
    }

    /**
     * Delete files
     * @param  integer $id  - model id
     * @param  FileLog $log
     * @return Model
     */
    public function deleteFileByFileLog(FileLog $log)
    {
        Storage::delete($log->file_path);
        $id = $log->model_id;

        $model = $this->getById($id);
        $model = (new CrudeFiles)->delete($model, $log);

        return $this->updateById($id, ['files' => $model->files]);
    }

    /**
     * Create file path
     * @param  string $crudeName
     * @param  string $fileName = ''
     * @return string
     */
    private function createFilePath($crudeName, $fileName = '')
    {
        return config('crude.uploadFolder') . '/' . Str::lower($crudeName) . '/' . $fileName;
    }

    /**
     * Create system file name
     * @param  FileLog $log
     * @param  File    $file
     * @return string
     */
    private function createSystemFileName(FileLog $log, $file)
    {
        return $log->id . '_' . time() . '.' . $file->getClientOriginalExtension();
    }
}
