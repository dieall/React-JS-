<?php

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\GuruController;
use App\Http\Controllers\API\MapelController;
use App\Http\Controllers\API\SiswaController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Auth Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected Routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/profile', [AuthController::class, 'profile']);

    // Siswa Routes
    Route::apiResource('siswa', SiswaController::class);

    // Mapel Routes
    Route::apiResource('mapel', MapelController::class);

    // Guru Routes
    Route::apiResource('guru', GuruController::class);
});

// Public Routes untuk testing
Route::get('/siswa-public', [SiswaController::class, 'index']);
Route::get('/mapel-public', [MapelController::class, 'index']);
Route::get('/guru-public', [GuruController::class, 'index']); 