<?php

return [

    /**
     * Eloquent Models namespace
     * @var array
     */
    'modelNamespace' => '\App\\',

    /**
     * Routes middleware
     * @var string | array
     */
    'middleware' => ['web', 'auth'],

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
