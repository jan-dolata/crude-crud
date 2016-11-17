<?php

namespace JanDolata\CrudeCRUD\Engine\Helpers;

use Chumper\Zipper\Zipper;
use File;

class CrudeZip
{
    protected $files = [];
    protected $tempPath;
    protected $tempFolder = 'temp';
    protected $storagePath;
    protected $extension = 'zip';
    protected $model;

    private $fileName;

    public static function run($model)
    {
        return $model ? (new self($model))->prepare() : null;
    }

    private function __construct($model)
    {
        $this->model = $model;

        $this->tempPath = public_path("{$this->tempFolder}");

        $modelFolder = strtolower(class_basename($this->model));
        $this->storagePath = storage_path('app/' . config('crude.uploadFolder') . "/$modelFolder/");
        $this->model = $model;
    }

    private function prepare()
    {
        if (! $this->modelHasFiles())
            return false;

        $this
            ->getFiles()
            ->setFileName()
            ->createArchive();

        return "{$this->tempPath}/{$this->fileName}";
    }

    private function modelHasFiles()
    {
        return count($this->model->files) > 0;
    }

    private function getFiles()
    {
        foreach ($this->model->files as $file)
            $this->files[] = $this->storagePath.basename($file['path']);

        return $this;
    }

    private function setFileName()
    {
        $time = time();
        $this->fileName = "{$this->model->id}_{$time}.{$this->extension}";

        return $this;
    }

    private function createArchive()
    {
        (new Zipper)->make("{$this->tempFolder}/{$this->fileName}")->add($this->files)->close();
    }

}
