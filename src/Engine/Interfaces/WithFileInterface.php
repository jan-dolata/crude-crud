<?php

namespace JanDolata\CrudeCRUD\Engine\Interfaces;

use JanDolata\CrudeCRUD\Engine\Models\FileLog;

interface WithFileInterface
{
    public function uploadFilesById($id, $files);
    public function deleteFileByFileLog(FileLog $log);
}
