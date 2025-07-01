<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Http\Middleware\HandlePrecognitiveRequests;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('dashboard');
})->middleware(['throttle:60,1']);

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})
//    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::get('/tasks/create', function () {
    return Inertia::render('AddEditTask', ['task' => new App\Models\Task()]);
})
    ->middleware([HandlePrecognitiveRequests::class])
    ->name('create-task');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
