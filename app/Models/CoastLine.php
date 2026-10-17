<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CoastLine extends Model
{
    //
    protected $fillable = [
        'prefecture_id',
        'name',
        'latlngs',
        'delete_flg'
    ];

    public function prefecture()
    {
        return $this->belongsTo(Prefecture::class);
    }
}
