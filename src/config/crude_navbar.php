<?php

return [

    /**
     * Trans key for list of groups labels
     * @var string
     */
    'groupTrans' => 'navbar.group',

    /**
     * Trans key for list of routes labels (by routes names)
     * @var string
     */
    'routeTrans' => 'navbar.routes',

    /**
     * Home route name
     * @var string
     */
    'homeRoute' => 'home',

    /**
     * Add login or logout link
     * @var boolean
     */
    'loginLogout' => false,

    /**
     * Left side of navbar
     * @var array
     */
    'left' => [
        // [
        //     'icon' => 'users',                      // name of fontawesome icon
        //     'routeName' => 'users_list'             // route name
        // ],
        // [
        //     'groupName' => 'list',                  // name of group
        //     'icon' => 'list',                       // name of fontawesome icon
        //     'routeName' => [ 'route_1', 'route_2' ] // list of group routes
        // ]
    ],

    /**
     * Right side of navbar
     * @var array
     */
    'right' => [
        // [
        //     'icon' => 'language',
        //     'routeName' => 'translation_get'
        // ],
        // [
        //     'icon' => 'exclamation-circle',
        //     'routeName' => 'admin_logs'
        // ]
    ]
];
