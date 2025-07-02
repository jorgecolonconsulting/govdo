<?php

namespace App\Http\Controllers;

use App\Http\Requests\TaskRequest;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $status = $request->query('status', 'all');

        $query = Task::query()->with('modifiedBy');

        if ($status === 'pending') {
            $query->pending('completed_at');
        } elseif ($status === 'completed') {
            $query->completed('completed_at');
        }

        $tasks = $query->latest('updated_at')->get();

        return Inertia::render('Dashboard', [
            'tasks' => $tasks,
            'filter' => $status
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(TaskRequest $request)
    {
        try {
            $validated = $request->validated();
            $validated['modified_by'] = Auth::id();

            Task::create($validated);

            return redirect()->route('tasks.index')->with('success', 'Task created successfully.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to create task. Please try again.'])->withInput();
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(TaskRequest $request, Task $task)
    {
        try {
            $validated = $request->validated();
            $validated['modified_by'] = Auth::id() ?? 1; // Fallback for demo

            $task->update($validated);

            return redirect()->route('tasks.index')->with('success', 'Task updated successfully.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to update task. Please try again.'])->withInput();
        }
    }

    /**
     * Mark a task as complete or incomplete.
     */
    public function complete(Request $request, Task $task)
    {
        try {
            $task->completed_at = $task->completed_at ? null : now();
            $task->modified_by = Auth::id();
            $task->save();

            $status = $task->completed_at ? 'completed' : 'marked as pending';
            return redirect()->route('tasks.index')->with('success', "Task {$status} successfully.");
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to update task status. Please try again.']);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task)
    {
        try {
            $task->delete();
            return redirect()->route('tasks.index')->with('success', 'Task deleted successfully.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to delete task. Please try again.']);
        }
    }
}
