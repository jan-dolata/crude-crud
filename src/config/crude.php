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
     * Number of rows on list, select option
     * @var array
     */
    'numRowsOptions' => [5, 10, 20, 30, 40, 50],

    /**
     * Icon css class name
     * @var array
     */
    'iconClassName' => [
        'form' => 'fa fa-pencil fa-lg',
        'map' => 'fa fa-map-marker fa-lg',
        'file' => 'fa fa-file fa-lg'
    ],

];
