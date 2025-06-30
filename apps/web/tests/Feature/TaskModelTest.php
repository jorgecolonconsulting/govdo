<?php

use App\Models\Task;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    // Create a test user for relationships
    $this->user = User::factory()->create([
        'name' => 'Test User',
        'email' => 'test@example.com',
        'timezone' => 'America/New_York',
    ]);
});

test('task can be created with fillable attributes', function () {
    $task = Task::create([
        'title' => 'Test Task',
        'description' => 'Test Description',
        'priority' => 'normal',
        'due_date' => '2025-12-31',
        'modified_by' => $this->user->id,
    ]);

    expect($task->title)->toBe('Test Task');
    expect($task->description)->toBe('Test Description');
    expect($task->priority)->toBe('normal');
    expect($task->due_date->format('Y-m-d'))->toBe('2025-12-31');
    expect($task->modified_by)->toBe($this->user->id);
    expect($task->completed_at)->toBeNull();
});

test('task belongs to user via modified_by relationship', function () {
    $task = Task::factory()->create(['modified_by' => $this->user->id]);

    expect($task->modifiedBy)->toBeInstanceOf(User::class);
    expect($task->modifiedBy->id)->toBe($this->user->id);
    expect($task->modifiedBy->name)->toBe('Test User');
});

test('pending scope returns only uncompleted tasks', function () {
    // Create pending task
    $pendingTask = Task::factory()->create([
        'completed_at' => null,
        'modified_by' => $this->user->id,
    ]);

    // Create completed task
    $completedTask = Task::factory()->create([
        'completed_at' => now(),
        'modified_by' => $this->user->id,
    ]);

    $pendingTasks = Task::pending()->get();

    expect($pendingTasks)->toHaveCount(1);
    expect($pendingTasks->first()->id)->toBe($pendingTask->id);
    expect($pendingTasks->contains($completedTask))->toBeFalse();
});

test('completed scope returns only completed tasks', function () {
    // Create pending task
    $pendingTask = Task::factory()->create([
        'completed_at' => null,
        'modified_by' => $this->user->id,
    ]);

    // Create completed task
    $completedTask = Task::factory()->create([
        'completed_at' => now(),
        'modified_by' => $this->user->id,
    ]);

    $completedTasks = Task::completed()->get();

    expect($completedTasks)->toHaveCount(1);
    expect($completedTasks->first()->id)->toBe($completedTask->id);
    expect($completedTasks->contains($pendingTask))->toBeFalse();
});

test('due_date_for_user accessor converts timezone correctly', function () {
    // TODO: needs a better example. Use completed_at column with a UTC that's the next day, but in New York it's still the day before.
    $task = Task::factory()->create([
        'due_date' => '2025-01-15', // UTC date
        'modified_by' => $this->user->id,
    ]);

    // Load the relationship
    $task->load('modifiedBy');

    $userDate = $task->due_date_for_user;

    expect($userDate)->toBeInstanceOf(Carbon::class);
    // The date should be converted to user's timezone (America/New_York)
    expect($userDate->timezone->getName())->toBe('America/New_York');
});

test('due_date_for_user accessor returns null when no due_date', function () {
    $task = Task::factory()->create([
        'due_date' => null,
        'modified_by' => $this->user->id,
    ]);

    expect($task->due_date_for_user)->toBeNull();
});

test('markCompleted method sets completed_at timestamp', function () {
    $task = Task::factory()->create([
        'completed_at' => null,
        'modified_by' => $this->user->id,
    ]);

    expect($task->completed_at)->toBeNull();

    $result = $task->markCompleted();

    expect($result)->toBeTrue(); // save() should return true

    $freshTask = $task->fresh();
    expect($freshTask->completed_at)->not->toBeNull();
    // Verify that completed_at is now set (as integer timestamp)
    expect($freshTask->completed_at)->toBeInt();
    expect($freshTask->completed_at)->toBeGreaterThan(0);
});

test('markPending method clears completed_at timestamp', function () {
    $task = Task::factory()->create([
        'completed_at' => now(),
        'modified_by' => $this->user->id,
    ]);

    expect($task->completed_at)->not->toBeNull();

    $result = $task->markPending();

    expect($result)->toBeTrue(); // save() should return true

    $freshTask = $task->fresh();
    expect($freshTask->completed_at)->toBeNull();
});

test('task priority enum accepts valid values', function () {
    $priorities = ['normal', 'resident', 'emergency'];

    foreach ($priorities as $priority) {
        $task = Task::factory()->create([
            'priority' => $priority,
            'modified_by' => $this->user->id,
        ]);

        expect($task->priority)->toBe($priority);
    }
});

test('task has proper casts', function () {
    // TODO: check that the actual cast was applied to these columns
    $casts = (new Task())->getCasts();

    expect($casts)->toHaveKey('due_date');
    expect($casts)->toHaveKey('completed_at');
    expect($casts['due_date'])->toBe('date');
    expect($casts['completed_at'])->toBe('timestamp');
});

test('task factory creates valid tasks', function () {
    $task = Task::factory()->create(['modified_by' => $this->user->id]);

    expect($task->title)->toBeString();
    expect($task->description)->toBeString();
    expect($task->priority)->toBeIn(['normal', 'resident', 'emergency']);
    expect($task->modified_by)->toBe($this->user->id);
});

test('task factory states work correctly', function () {
    $pendingTask = Task::factory()->pending()->create(['modified_by' => $this->user->id]);
    $completedTask = Task::factory()->completed()->create(['modified_by' => $this->user->id]);
    $emergencyTask = Task::factory()->emergency()->create(['modified_by' => $this->user->id]);

    expect($pendingTask->completed_at)->toBeNull();
    expect($completedTask->completed_at)->not->toBeNull();
    expect($emergencyTask->priority)->toBe('emergency');
});
