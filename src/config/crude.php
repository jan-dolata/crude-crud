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
     * Map defaults
     * @var array
     */
    'mapDefaults' => [
        'lat' => 52.03,
        'lng' => 19.27
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
