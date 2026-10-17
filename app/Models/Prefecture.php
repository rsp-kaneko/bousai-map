<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Prefecture extends Model
{
    //
    protected $fillable = [
        'region',
        'name',
        'delete_flg'
    ];

    public function prefecturePolygon()
    {
        return $this->hasOne(PrefecturePolygon::class);
    }

    public function coastLine()
    {
        return $this->hasOne(CoastLine::class);
    }

    public function pointLayers()
    {
        return $this->hasMany(PointLayer::class);
    }
}
