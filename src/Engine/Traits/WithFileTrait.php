<?php

namespace JanDolata\CrudeCRUD\Engine\Traits;

use JanDolata\CrudeCRUD\Engine\Models\FileLog;
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
        $filesArray = $model->files;

        foreach ($files as $file) {

            $log = (new FileLog)->create([
                'model_id' => $id,
                'model_name' => $crudeName,
                'file_original_name' => $file->getClientOriginalName(),
            ]);

            $systemFileName = $this->createSystemFileName($log, $file);
            $filePath = $this->createFilePath($crudeName, $systemFileName);
            $folderPath = $this->createFilePath($crudeName);

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

        return $this->updateById($id, ['files' => $filesArray]);
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

        $model = $this->getById($log->model_id);

        $updatedFiles = [];
        foreach ($model->files as $file) {
            if ($file['file_log_id'] == $log->id) continue;

            $updatedFiles[] = $file;
        }

        $log->delete();

        return $this->updateById($id, ['files' => $updatedFiles]);
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
