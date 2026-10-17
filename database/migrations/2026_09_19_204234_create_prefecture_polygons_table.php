<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('prefecture_polygons', function (Blueprint $table) {
            $table->id();
            $table->integer('prefecture_id');
            $table->string('name');
            $table->string('latlngs');
            $table->integer('delete_flg')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('prefecture_polygons');
    }
};
