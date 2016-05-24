<?php

namespace JanDolata\CrudeCRUD\Engine\Traits;

use JanDolata\CrudeCRUD\Engine\Models\FileLog;
use JanDolata\CrudeCRUD\Helpers\CrudeFiles;
use Illuminate\Support\Str;
use Storage;

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
        $model = $this->getById($log->model_id);
        $model = (new CrudeFiles)->delete($model, $log);

        return $this->updateById($log->model_id, ['files' => $model->files]);
    }
}
