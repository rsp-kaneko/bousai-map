<?php

use App\Http\Controllers\CoastLineController;
use App\Http\Controllers\ManagerController;
use App\Http\Controllers\PointLayerController;
use App\Http\Controllers\PrefectureController;
use App\Http\Controllers\TopController;
use Illuminate\Support\Facades\Route;

Route::get('/', [TopController::class, 'index'])->name('top');

Route::get('/managers', [ManagerController::class, 'index'])->middleware('auth')->name('managers.index');

Route::controller(PrefectureController::class)->prefix('prefectures')->group(function() {
    Route::get('/getAll', 'getAll')->name('prefectures.getAll');
    Route::post('/getPolygons', 'getPolygons')->name('prefectures.getPolygons');
    Route::post('/storePolygons', 'storePolygons')->name('prefectures.storePolygons');
});

Route::controller(PointLayerController::class)->prefix('pointLayers')->group(function() {
    Route::post('/getShelters', 'getShelters')->name('pointLayers.getShelters');
    Route::post('/storePoints', 'storePoints')->name('pointLayers.storePoints');
});

Route::controller(CoastLineController::class)->prefix('coastLines')->group(function() {
    Route::post('/getLines', 'getLines')->name('coastLines.getLines');
    Route::post('/storeLines', 'storeLines')->name('coastLines.storeLines');
});

// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');

// Route::middleware('auth')->group(function () {
//     Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
//     Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
//     Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
// });

require __DIR__.'/auth.php';
