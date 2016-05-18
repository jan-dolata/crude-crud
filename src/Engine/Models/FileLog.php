<?php

namespace JanDolata\CrudeCRUD\Engine\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class FileLog extends Model
{
    use SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'model_id',
        'model_name',
        'file_path',
        'file_original_name',
        'file_system_name'
    ];
}
