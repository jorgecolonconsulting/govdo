<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TaskController;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Http\Middleware\HandlePrecognitiveRequests;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('login');
})->middleware(['throttle:60,1']);

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Task routes
    Route::get('/tasks', [TaskController::class, 'index'])
        ->name('tasks.index');

    Route::get('/tasks/create', function () {
        return Inertia::render('AddEditTask', ['task' => null]);
    })
        ->middleware([HandlePrecognitiveRequests::class])
        ->name('tasks.create');

    Route::get('/tasks/{task}/edit', function (App\Models\Task $task) {
        return Inertia::render('AddEditTask', ['task' => $task]);
    })
        ->middleware([HandlePrecognitiveRequests::class])
        ->name('tasks.edit');

    // API routes for task operations
    Route::post('/tasks', [TaskController::class, 'store'])
        ->middleware([HandlePrecognitiveRequests::class])
        ->name('tasks.store');

    Route::put('/tasks/{task}', [TaskController::class, 'update'])
        ->middleware([HandlePrecognitiveRequests::class])
        ->name('tasks.update');

    Route::put('/tasks/{task}/complete', [TaskController::class, 'complete'])
        ->name('tasks.complete');

    Route::delete('/tasks/{task}', [TaskController::class, 'destroy'])
        ->name('tasks.destroy');
});

require __DIR__.'/auth.php';
