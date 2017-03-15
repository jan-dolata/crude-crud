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
    Route::group(['prefix' => 'file'], function() {
        Route::post('upload', 'FileController@upload');
        Route::delete('delete', 'FileController@delete');
        Route::post('download', 'FileController@download')->name('download');
        Route::get('download-all/{crudeName?}/{modelId?}', 'FileController@downloadAll')->name('download_all');
    });

    // Thumbnail
    Route::group(['prefix' => 'thumbnail'], function() {
        Route::post('upload', 'ThumbnailController@upload');
        Route::delete('delete', 'ThumbnailController@delete');
    });

    // Custom actions
    Route::get('custom-action/{crudeName}/{action}/{id}', 'CustomActionController@execute');

    // List order
    Route::post('ordered-list/{crudeName}', 'OrderedListController@execute');

    // Export to CSV
    Route::get('export-csv/{crudeName?}', 'ExportController@csv');
});

// Special file
Route::group(['prefix' => config('crude.routePrefix') . '/special-file'], function() {
    Route::post('upload/{name}', 'SpecialFilesController@upload')
        ->name('special_file_upload')
        ->middleware(config('crude_special_files.uploadMiddleware'));

    Route::get('download/{name}', 'SpecialFilesController@download')
        ->name('special_file_download')
        ->middleware(config('crude_special_files.downloadMiddleware'));
});
