<?php

return [

    /**
     * Route prefix
     * @var string
     */
    'routePrefix' => 'crude',

    /**
     * Namespace of crude class
     * @var string
     */
    'namespace' => '\App\Engine\Crude\\',

    /**
     * Routes middleware
     * @var string | array
     */
    'middleware' => ['web', 'auth'],

    /**
     * Upload path in storage/app
     * @var string
     */
    'uploadFolder' => 'upload',

    /**
     * Default interface and api translation file
     * @var string
     */
    'defaultInterfaceTrans' => 'CrudeCRUD::crude',

    /**
     * Defaults filters
     * @var array
     */
    'defaults' => [
        'numRows' => 20,
        'sortAttr' => 'id',
        'sortOrder' => 'asc',
        'searchAttr' => 'id'
    ],

    /**
     * Map center
     * @var array
     */
    'mapCenter' => [
        'lat' => 52.03,
        'lng' => 19.27
    ],

    /**
     * Google api key for maps
     */
    'googleApiKey' => env('GOOGLE_API_KEY'),

    /**
     * Default thumbnails size
     * @var array
     */
    'thumbnailSize' => [
        'width' => 300,
        'height' => 300
    ],

    /**
     * Number of rows on list, select option
     * @var array
     */
    'numRowsOptions' => [5, 10, 20, 30, 40, 50],

    /**
     * Refresh all list on page after change
     */
    'refreshAll' => true,
];
