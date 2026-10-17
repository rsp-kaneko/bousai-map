<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PrefecturePolygon extends Model
{
    //
    protected $fillable = [
        'prefecture_id',
        'name',
        'point',
        'latlngs',
        'delete_flg'
    ];

    public function prefecture()
    {
        return $this->belongsTo(Prefecture::class);
    }
}
