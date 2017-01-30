<?php

namespace JanDolata\CrudeCRUD;

use Illuminate\Support\ServiceProvider;
use Illuminate\Routing\Router;

class CrudeCRUDServiceProvider extends ServiceProvider
{
    /**
     * Indicates if loading of the provider is deferred.
     *
     * @var bool
     */
    protected $defer = false;

    /**
     * Perform post-registration booting of services.
     *
     * @return void
     */
    public function boot()
    {
        // use this if your package has views
        $this->loadViewsFrom(__DIR__.'/resources/views', 'CrudeCRUD');

        // use this if your package has lang files
        $this->loadTranslationsFrom(__DIR__.'/resources/lang', 'CrudeCRUD');

        // use this if your package has routes
        $this->setupRoutes($this->app->router);

        // use this if your package needs a config file
        $this->publishes([
            __DIR__.'/config/crude.php' => config_path('crude.php')
        ], 'config');

        $this->publishes([
            __DIR__.'/../public/' => public_path('vendor/jan-dolata/crude-crud')
        ], 'tg_assets');

        $this->publishes([
            __DIR__.'/database/migrations/2016_05_04_091202_create_file_logs_table.php' => app_path('../database/migrations/2016_05_04_091202_create_file_logs_table.php')
        ], 'files');

        // use the vendor configuration file as fallback
        $this->mergeConfigFrom(
            __DIR__.'/config/crude.php', 'crude'
        );
    }

    /**
     * Define the routes for the application.
     *
     * @param  \Illuminate\Routing\Router  $router
     * @return void
     */
    public function setupRoutes(Router $router)
    {
        $router->group(['namespace' => 'JanDolata\CrudeCRUD\Http\Controllers'], function($router)
        {
            require __DIR__.'/Http/routes.php';
        });
    }

    /**
     * Register any package services.
     *
     * @return void
     */
    public function register()
    {
        $this->registerCrudeCRUD();

        config([
            'config/crude.php',
        ]);


        $loader = \Illuminate\Foundation\AliasLoader::getInstance();
        $loader->alias('Crude', 'JanDolata\CrudeCRUD\Engine\Crude');

        $loader->alias('CrudeListInterface', 'JanDolata\CrudeCRUD\Engine\Interfaces\ListInterface');
        $loader->alias('CrudeUpdateInterface', 'JanDolata\CrudeCRUD\Engine\Interfaces\UpdateInterface');
        $loader->alias('CrudeDeleteInterface', 'JanDolata\CrudeCRUD\Engine\Interfaces\DeleteInterface');
        $loader->alias('CrudeStoreInterface', 'JanDolata\CrudeCRUD\Engine\Interfaces\StoreInterface');
        $loader->alias('CrudeOrderInterface', 'JanDolata\CrudeCRUD\Engine\Interfaces\OrderInterface');
        $loader->alias('CrudeWithValidationInterface', 'JanDolata\CrudeCRUD\Engine\Interfaces\WithValidationInterface');
        $loader->alias('CrudeWithThumbnailInterface', 'JanDolata\CrudeCRUD\Engine\Interfaces\WithThumbnailInterface');
        $loader->alias('CrudeWithFileInterface', 'JanDolata\CrudeCRUD\Engine\Interfaces\WithFileInterface');
        $loader->alias('CrudeCRUDInterface', 'JanDolata\CrudeCRUD\Engine\Interfaces\CRUDInterface');
        $loader->alias('CrudeCRUDWithValidationInterface', 'JanDolata\CrudeCRUD\Engine\Interfaces\CRUDWithValidationInterface');

        $loader->alias('CrudeFromModelTrait', 'JanDolata\CrudeCRUD\Engine\Traits\FromModelTrait');
        $loader->alias('CrudeWithValidationTrait', 'JanDolata\CrudeCRUD\Engine\Traits\WithValidationTrait');
        $loader->alias('CrudeWithThumbnailTrait', 'JanDolata\CrudeCRUD\Engine\Traits\WithThumbnailTrait');
        $loader->alias('CrudeWithFileTrait', 'JanDolata\CrudeCRUD\Engine\Traits\WithFileTrait');
        $loader->alias('CrudeCrudeSetup', 'JanDolata\CrudeCRUD\Engine\CrudeSetup');

        $loader->alias('CrudeFileLog', 'JanDolata\CrudeCRUD\Engine\Models\FileLog');

        $loader->alias('CrudeFiles', 'JanDolata\CrudeCRUD\Engine\Helpers\CrudeFiles');
        $loader->alias('CrudeData', 'JanDolata\CrudeCRUD\Engine\Helpers\CrudeData');
        $loader->alias('CrudeOptions', 'JanDolata\CrudeCRUD\Engine\Helpers\CrudeOptions');
        $loader->alias('CrudeQueryHelper', 'JanDolata\CrudeCRUD\Engine\Helpers\CrudeQueryHelper');
    }

    private function registerCrudeCRUD()
    {
        $this->app->bind('CrudeCRUD', function($app) {
            return new CrudeCRUD($app);
        });
    }
}
