<?php

namespace JanDolata\CrudeCRUD\Engine\Traits;

// todo refactor
use Storage;
use Image;

trait WithThumbnailTrait
{

    public function uploadThumbnailByIdAndColumn($id, $column, $file)
    {
        $model = $this->getById($id);

        $columnSetup = $this->getCrudeSetup()->getThumbnailColumns($column);
        $width = $columnSetup['width'];
        $height = $columnSetup['height'];

        $systemFileName = $this->createSystemFileName($file);
        $fileOriginalPath = $this->createFileOriginalPath($column, $systemFileName);
        $fileThumbnailName = $this->createFileThumbnailName($file, $width, $height);
        $fileThumbnailPath = $this->createFileThumbnailPath($column, $fileThumbnailName);
        $folderOriginalPath = $this->createFileOriginalPath($column);
        $folderThumbnailPath = $this->createFileThumbnailPath($column);

        // delete previous file
        if (! empty($model->{$column})) {
            Storage::delete($model->{$column}['file_original_path']);
            Storage::delete($model->{$column}['file_thumbnail_path']);
        }

        //save original picture
        Storage::put(
            $fileOriginalPath,
            file_get_contents($file->path())
        );

        Storage::copy($fileOriginalPath, $fileThumbnailPath);

        //create thumb
        $img = Image::make(storage_path('app/'.$fileThumbnailPath));
        $img->heighten($height, function ($constraint) {
            $constraint->upsize();
        });
        $img->widen($width, function ($constraint) {
            $constraint->upsize();
        });
        //save thumbnail
        $img->save();

        $thumbnail = [
            'file_original_name' => $file->getClientOriginalName(),
            'system_file_name' => $systemFileName,
            'file_original_path' => $fileOriginalPath,
            'folder_original_path' => $folderOriginalPath,
            'original_path' => asset($fileOriginalPath),
            'file_thumbnail_path' => $fileThumbnailPath,
            'thumbnail_path' => asset($fileThumbnailPath),
            'thumbnail_name' => $fileThumbnailName,
            'thumbnail_folder_path' => $folderThumbnailPath,
            'current_thumbnail_width' => $width,
            'current_thumbnail_heigth' => $height
        ];

        $model = $this->model->find($id);
        $model->$column = $thumbnail;
        $model->save();

        return $this->getById($id);
    }

    public function deleteThumbnailByIdAndColumn($id, $column)
    {
        $model = $this->model->find($id);

        Storage::delete($model->{$column}['file_original_path']);
        Storage::delete($model->{$column}['file_thumbnail_path']);

        $model->{$column} = null;
        $model->save();

        return $model;
    }

    /**
     * Create file path
     * @param  string $folderName
     * @param  string $fileName = ''
     * @return string
     */
    private function createFileOriginalPath($folderName, $fileName = '')
    {
        return config('crude.uploadFolder') . '/' . strtolower($folderName) . '/original/' . $fileName;
    }

    private function createFileThumbnailPath($folderName, $fileThumbnailName = '')
    {
        return config('crude.uploadFolder') . '/' . strtolower($folderName) . '/thumbnail/' . $fileThumbnailName;
    }

    /**
     * Create system file name
     * @param  File    $file
     * @return string
     */
    private function createSystemFileName($file)
    {
        return uniqid() . '_' . time() . '.' . $file->getClientOriginalExtension();
    }

    private function createFileThumbnailName($file, $width, $height)
    {
        $name = uniqid() . '_' . time();
        $name .= sprintf('_%sx%s', $width, $height);
        $name .= '.' . $file->getClientOriginalExtension();
        return $name;
    }
}
