<?php

$group = [];

$group['prefix'] = '';

if(! empty(config('crude.middleware')))
    $group['middleware'] = config('crude.middleware');

Route::group($group, function () {

    // REST api controller
    Route::get('api/{modelName}', 'ApiController@index');
    Route::post('api/{modelName}', 'ApiController@store');
    Route::put('api/{modelName}/{id}', 'ApiController@update');
    Route::delete('api/{modelName}/{id}', 'ApiController@destroy');
});
