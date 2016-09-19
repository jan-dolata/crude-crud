<?php

namespace JanDolata\CrudeCRUD\Engine\Traits;

use JanDolata\CrudeCRUD\Engine\Models\FileLog;
use JanDolata\CrudeCRUD\Engine\Helpers\CrudeFiles;

trait WithFileTrait
{

    /**
     * File attributes name
     * @var string
     */
    protected $fileAttrName = 'files';

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

        $fileAttrName = $this->getFileAttrName();

        $model = (new CrudeFiles)->upload($model, $crudeName, $files, $fileAttrName);

        return $this->updateById($id, [$fileAttrName => $model->files]);
    }

    /**
     * Delete files
     * @param  integer $id  - model id
     * @param  FileLog $log
     * @return Model
     */
    public function deleteFileByFileLog(FileLog $log)
    {
        $id = $log->model_id;

        $fileAttrName = $this->getFileAttrName();

        $model = $this->getById($id);
        $model = (new CrudeFiles)->delete($model, $log, $fileAttrName);

        return $this->updateById($id, [$fileAttrName => $model->files]);
    }

    /**
     * Gets the File attributes name.
     *
     * @return string
     */
    public function getFileAttrName()
    {
        return $this->fileAttrName;
    }

    /**
     * Sets the File attributes name.
     *
     * @param string $fileAttrName the file attr name
     *
     * @return self
     */
    protected function setFileAttrName($fileAttrName)
    {
        $this->fileAttrName = $fileAttrName;

        return $this;
    }
}
