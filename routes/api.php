<?php

use App\Http\Controllers\DailyNoteController;
use App\Http\Controllers\EmergencyContactController;
use App\Http\Controllers\FieldTeamController;
use App\Http\Controllers\ReportController;
use Illuminate\Support\Facades\Route;

// Reports API (JSON backed)
Route::get('/reports', [ReportController::class, 'index']);
Route::post('/reports', [ReportController::class, 'store']);
Route::get('/reports/stats', [ReportController::class, 'stats']);
Route::get('/reports/export', [ReportController::class, 'export']);
Route::get('/reports/{id}', [ReportController::class, 'show']);
Route::put('/reports/{id}', [ReportController::class, 'update']);
Route::patch('/reports/{id}', [ReportController::class, 'update']);
Route::delete('/reports/{id}', [ReportController::class, 'destroy']);
Route::post('/reports/{id}/verify', [ReportController::class, 'verify']);
Route::post('/reports/{id}/upvote', [ReportController::class, 'toggleUpvote']);
Route::post('/reports/{id}/comments', [ReportController::class, 'addComment']);

// Field Teams API
Route::get('/teams', [FieldTeamController::class, 'index']);
Route::put('/teams/{id}', [FieldTeamController::class, 'update']);

// Daily Notes API
Route::get('/daily-notes', [DailyNoteController::class, 'index']);
Route::post('/daily-notes', [DailyNoteController::class, 'store']);

// Emergency Contacts API
Route::get('/emergency-contacts', [EmergencyContactController::class, 'index']);

// Citizen Auth & Accounts API
Route::post('/citizen/login', [\App\Http\Controllers\CitizenAuthController::class, 'login']);
Route::post('/citizen/register', [\App\Http\Controllers\CitizenAuthController::class, 'register']);
Route::get('/citizen/demo-accounts', [\App\Http\Controllers\CitizenAuthController::class, 'demoAccounts']);
Route::get('/citizen/me', [\App\Http\Controllers\CitizenAuthController::class, 'me']);

