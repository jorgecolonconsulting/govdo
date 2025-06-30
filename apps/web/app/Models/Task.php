<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Carbon;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'priority',
        'due_date',
        'completed_at',
        'modified_by',
    ];

    protected $casts = [
        'due_date' => 'date',
        'completed_at' => 'timestamp',
    ];

    /**
     * Relationship: User who last modified the task
     */
    public function modifiedBy()
    {
        return $this->belongsTo(User::class, 'modified_by');
    }

    /**
     * Scope: Pending tasks (not completed)
     */
    public function scopePending(Builder $query)
    {
        return $query->whereNull('completed_at');
    }

    /**
     * Scope: Completed tasks
     */
    public function scopeCompleted(Builder $query)
    {
        return $query->whereNotNull('completed_at');
    }

    /**
     * Accessor: Due date formatted in user's timezone
     */
    public function getDueDateForUserAttribute(): ?Carbon
    {
        // Get the user's timezone, fallback to default
        $user = $this->modifiedBy;
        $timezone = ($user && $user->timezone) ? $user->timezone : 'America/New_York';

        return $this->due_date
            ? Carbon::parse($this->due_date, 'UTC')->setTimezone($timezone)
            : null;
    }

    /**
     * Mark task as completed
     */
    public function markCompleted()
    {
        $this->completed_at = now();
        return $this->save();
    }

    /**
     * Mark task as pending if needed. Null by default.
     */
    public function markPending()
    {
        $this->completed_at = null;
        return $this->save();
    }
}
