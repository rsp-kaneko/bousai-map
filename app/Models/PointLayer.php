<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PointLayer extends Model
{
    //
    protected $fillable = [
        'prefecture_id',
        'class_name',
        'local_name',
        'latlng',
        'properties',
        'delete_flg'
    ];

    public function prefecture()
    {
        return $this->belongsTo(Prefecture::class);
    }
}
