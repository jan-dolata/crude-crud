<?php

namespace JanDolata\CrudeCRUD\Engine\CrudeSetupTrait;

trait ThumbnailColumns
{
    /**
     * thumbnail database columns
     *
     * @var array
     */
    protected $thumbnailColumns = [];

    public function getThumbnailColumns($column = null)
    {
        $default = [
            'name' => 'thumbnail',
            'width' => config('crude.thumbnailSize.width'),
            'height' => config('crude.thumbnailSize.height')
        ];

        if ($column)
            return isset($this->thumbnailColumns[$column])
                ? $this->thumbnailColumns[$column]
                : $default;

        return empty($this->thumbnailColumns)
            ? [ 'thumbnail' => $default ]
            : $this->thumbnailColumns;
    }

    public function setThumbnailColumns($column, $width = null, $height = null)
    {
        if (! is_array($columns))
            $columns = [$columns, $width, $height];

        $thumbnailColumns = [];
        foreach ($columns as $column)
            $thumbnailColumns[$column[0]] = [
                'name' => $column[0],
                'width' => $column[1] ? : config('crude.thumbnailSize.width'),
                'height' => $column[2] ? : config('crude.thumbnailSize.height')
            ];

        $this->thumbnailColumns = $thumbnailColumns;

        return $this;
    }
}
