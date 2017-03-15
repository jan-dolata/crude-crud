<?php

return [

    /**
     * List of special files names
     * @var array
     */
    'files' => [
        // 'guide',
        // 'rules'
    ],

    /**
     * Upload path in storage/app
     * @var string
     */
    'storage' => 'special_files',

    /**
     * Trans key for list of files labels
     * @var string
     */
    'trans' => 'special_files',

    /**
     * Routes middleware for upload
     * @var string | array
     */
    'uploadMiddleware' => ['web', 'auth'],

    /**
     * Routes middleware for download
     * @var string | array
     */
    'downloadMiddleware' => '',

];
