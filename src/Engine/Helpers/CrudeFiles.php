<?php

namespace JanDolata\CrudeCRUD\Engine\Helpers;

use JanDolata\CrudeCRUD\Engine\Models\FileLog;
use Illuminate\Support\Str;
use Storage;
use Image;
use File;

class CrudeFiles
{

    /**
     * Upload files for model, without save model
     * @param  Model $model      - with 'files' attribute
     * @param  string $folderName
     * @param  Files $files
     * @return Model
     */
    public function upload($model, $folderName, $files, $fileAttrName = 'files', $width = null)
    {
        $updatedFiles = $model->$fileAttrName;

        foreach ($files as $file) {

            $log = (new FileLog)->create([
                'model_id' => $model->id,
                'model_name' => $folderName,
                'file_original_name' => $file->getClientOriginalName(),
            ]);

            $systemFileName = $this->createSystemFileName($log, $file);
            $filePath = $this->createFilePath($folderName, $systemFileName);
            $folderPath = $this->createFilePath($folderName);

            Storage::put(
                $filePath,
                file_get_contents($file->path())
            );

            $log->fill([
                'file_path' => $filePath,
                'file_system_name' => $systemFileName
            ])->save();

            if ($width)
                $this->imageResize($width, $file, $filePath);

            $updatedFiles[] = [
                'file_log_id' => $log->id,
                'path' => asset($log->file_path),
                'file_original_name' => $log->file_original_name
            ];
        }

        $model->$fileAttrName = $updatedFiles;
        return $model;
    }

    private function imageResize($width, $file, $filePath)
    {
        $preparedFileMimeType = explode("/", File::mimeType($file))[0];

        if($preparedFileMimeType == 'image') {
            $img = Image::make($filePath);
            $img->widen($width, function ($constraint) {
                $constraint->upsize();
            });
            $img->save();
        }
    }

    /**
     * Delete file for model, without save model
     * @param  Model $model
     * @param  FileLog $log
     * @param  String $fileAttrName = 'files'
     * @param  String $fileLogId = 0 - used when log is missing
     * @return Model
     */
    public function delete($model, $log, $fileAttrName = 'files', $fileLogId = 0)
    {
        $updatedFiles = [];
        if ($log)
            $fileLogId = $log->id;

        $fileToDelete = [];
        foreach ($model->files as $file) {
            if ($file['file_log_id'] == $fileLogId)
                $fileToDelete = $file;
            else
                $updatedFiles[] = $file;
        }

        if ($log)
            Storage::delete($log->file_path);
        else
            Storage::delete($fileToDelete['path']);

        if ($log)
            $log->delete();

        $model->$fileAttrName = $updatedFiles;
        return $model;
    }

    /**
     * Create file path
     * @param  string $folderName
     * @param  string $fileName = ''
     * @return string
     */
    private function createFilePath($folderName, $fileName = '')
    {
        return config('crude.uploadFolder') . '/' . Str::lower($folderName) . '/' . $fileName;
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
