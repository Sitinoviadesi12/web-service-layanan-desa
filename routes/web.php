<?php

use App\Http\Controllers\PageController;
use Illuminate\Support\Facades\Route;

// Public citizen portal (pengguna as source of truth)
Route::get('/', [PageController::class, 'pengguna'])->name('pengguna');
Route::get('/warga', [PageController::class, 'pengguna'])->name('warga');

// Admin panel (dasbor)
Route::get('/admin', [PageController::class, 'dasbor'])->name('dasbor');
Route::get('/dasbor', function () {
    return redirect()->route('dasbor');
});


Route::get('/docs/openapi.yaml', function () {
    $path = app_path('docs/openapi.yaml');

    abort_unless(file_exists($path), 404);

    return response(
        file_get_contents($path),
        200,
        ['Content-Type' => 'application/yaml; charset=UTF-8']
    );
})->name('api.docs');
