<?php

namespace JanDolata\CrudeCRUD\Engine\Interfaces;

interface WithThumbnailInterface
{
    public function uploadThumbnailByIdAndColumn($id, $column, $file);
    public function deleteThumbnailByIdAndColumn($id, $column);
}
