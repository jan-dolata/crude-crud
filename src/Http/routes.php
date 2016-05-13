<?php

$group = [];

$group['prefix'] = config('crude.routePrefix');

if(! empty(config('crude.middleware')))
    $group['middleware'] = config('crude.middleware');

Route::group($group, function () {

    // REST api controller
    Route::get('api/{modelName}', 'ApiController@index');
    Route::post('api/{modelName}', 'ApiController@store');
    Route::put('api/{modelName}/{id}', 'ApiController@update');
    Route::delete('api/{modelName}/{id}', 'ApiController@destroy');

    // Autocomplete
    Route::group(['prefix' => 'autocomplete'], function() {
        Route::get('get/{model}/{attr}', 'AutocompleteController@get');
        Route::post('label', 'AutocompleteController@label');
    });
});
