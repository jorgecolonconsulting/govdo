import { UTCToLocalDate } from '@/lib/date';
import { Task } from '@/types';
import { Link } from '@inertiajs/react';
import { AlertTriangle, Calendar } from 'lucide-react';
import React from 'react';

const getPriorityColor = (priority: string): string => {
    switch (priority) {
        case 'emergency':
            return 'bg-red-100 text-red-800 border-red-200';
        case 'normal':
            return 'bg-blue-100 text-blue-800 border-blue-200';
        case 'resident':
            return 'bg-green-100 text-green-800 border-green-200';
        default:
            return 'bg-gray-100 text-gray-800 border-gray-200';
    }
};
const getPriorityIcon = (priority: string) => {
    if (priority === 'emergency') {
        return (
            <AlertTriangle className="inline-block h-4 w-4 text-govdo-pink-dark" />
        );
    }
    return null;
};
const capitalizePriority = (priority: string): string => {
    return priority.charAt(0).toUpperCase() + priority.slice(1);
};
export const TaskItem = React.memo(
    ({
        task,
        onToggleCompletion,
    }: {
        task: Task;
        onToggleCompletion: (id: number) => void;
    }) => {
        return (
            <div
                className={`p-6 transition-colors hover:bg-govdo-neutral-light/50 ${
                    task.completed ? 'opacity-75' : ''
                }`}
            >
                <div className="flex items-center space-x-4">
                    {/* Selection Checkbox */}
                    <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => onToggleCompletion(task.id)}
                        className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-blue-500"
                    />

                    {/* Task Content */}
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-3">
                            <div className="min-w-0 flex-1">
                                <p
                                    className={`text-lg font-medium text-foreground ${
                                        task.completed ? 'line-through' : ''
                                    }`}
                                >
                                    <Link href={route('tasks.edit', task.id)}>
                                        {getPriorityIcon(task.priority)}{' '}
                                        {task.title}
                                    </Link>
                                </p>

                                {task.due_date && (
                                    <p className="flex items-center space-x-1 text-sm text-gray-500">
                                        <Calendar className="h-3 w-3" />
                                        <span>
                                            Due: {UTCToLocalDate(task.due_date)}
                                        </span>
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Priority */}
                    <span
                        className={`rounded-full border px-3 py-1 text-sm font-medium ${getPriorityColor(task.priority)}`}
                    >
                        {capitalizePriority(task.priority)}
                    </span>
                </div>
            </div>
        );
    },
);

TaskItem.displayName = 'TaskItem';
