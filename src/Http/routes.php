<?php

$group = [];

$group['prefix'] = config('crude.routePrefix');

if(! empty(config('crude.middleware')))
    $group['middleware'] = config('crude.middleware');

Route::group($group, function () {

    // REST api controller
    Route::get('api/{crudeName}', 'ApiController@index');
    Route::post('api/{crudeName}', 'ApiController@store');
    Route::put('api/{crudeName}/{id}', 'ApiController@update');
    Route::delete('api/{crudeName}/{id}', 'ApiController@destroy');

    // Autocomplete
    Route::group(['prefix' => 'autocomplete'], function() {
        Route::get('get/{crudeName}/{attr}', 'AutocompleteController@get');
        Route::post('label', 'AutocompleteController@label');
    });

    // File
    Route::group(['prefix' => 'files'], function() {
        Route::post('upload', 'FilesController@upload');
        Route::post('delete', 'FilesController@delete');
    });

});
