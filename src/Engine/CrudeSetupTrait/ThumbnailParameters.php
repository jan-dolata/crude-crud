<?php

namespace JanDolata\CrudeCRUD\Engine\CrudeSetupTrait;

trait ThumbnailParameters
{
    /**
     * thumbnail database columns
     *
     * @var array
     */
    protected $thumbnailColumns = ['thumbnail'];

    public function getThumbnailColumns()
    {
        return $this->thumbnailColumns;
    }

    public function setThumbnailColumns(array $columns)
    {
        if (! is_array($columns))
            $columns = [$columns];

        $this->thumbnailColumns = $columns;

        return $this;
    }
}
