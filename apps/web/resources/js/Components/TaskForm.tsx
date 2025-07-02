import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { Task, TaskFormFields } from '@/types';
import { InertiaFormProps, router, useForm } from '@inertiajs/react';
import { AlertTriangle, Calendar, CheckCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react';

function DeleteConfirmation(props: {
    onCancel: () => void;
    onConfirmDelete: () => void;
}) {
    return (
        <div className="py-8 text-center">
            <AlertTriangle className="mx-auto mb-4 h-12 w-12 text-govdo-pink-dark" />

            <h3 className="mb-2 text-lg font-medium text-foreground">
                Delete Task
            </h3>

            <p className="mb-6 text-sm text-gray-600">
                Are you sure you want to delete this task? This action cannot be
                undone.
            </p>

            <div className="flex justify-center gap-4">
                <SecondaryButton onClick={props.onCancel}>
                    Cancel
                </SecondaryButton>

                <DangerButton onClick={props.onConfirmDelete}>
                    Delete Task
                </DangerButton>
            </div>
        </div>
    );
}

function TaskEditActions(props: {
    handleComplete: () => void;
    completedAt: string | null | undefined;
    onDelete: () => void;
}) {
    return (
        <div className="flex gap-4">
            {/* Complete Button */}
            <SecondaryButton
                type="button"
                onClick={props.handleComplete}
                className="flex items-center gap-2"
            >
                <CheckCircle className="h-4 w-4" />
                {props.completedAt ? 'Mark as Pending' : 'Mark as Complete'}
            </SecondaryButton>

            {/* Delete Button */}
            <DangerButton type="button" onClick={props.onDelete}>
                Delete
            </DangerButton>
        </div>
    );
}

function TaskPrimaryActions(props: {
    onSubmit: () => void;
    disabled: boolean;
    editing: boolean;
}) {
    return (
        <div className="flex gap-4">
            {/* Cancel Button */}
            <SecondaryButton type="button" onClick={props.onSubmit}>
                Cancel
            </SecondaryButton>

            {/* Submit Button */}
            <PrimaryButton type="submit" disabled={props.disabled}>
                {props.editing ? 'Update Task' : 'Create Task'}
            </PrimaryButton>
        </div>
    );
}

function TaskDueDate(props: {
    data: InertiaFormProps<TaskFormFields>['data'];
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    errors: InertiaFormProps<TaskFormFields>['errors'];
}) {
    return (
        <div>
            <InputLabel htmlFor="due_date" value="Due Date (Optional)" />

            <div className="mt-1 flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-gray-400" />
                <TextInput
                    id="due_date"
                    type="date"
                    value={props.data.due_date || undefined}
                    onChange={props.onChange}
                    className="block w-full"
                />
            </div>

            <InputError message={props.errors.due_date} className="mt-2" />
        </div>
    );
}

const getPriorityColor = (priority: string) => {
    switch (priority) {
        case 'emergency':
            return 'bg-red-100 text-red-800 border-red-200';
        case 'resident':
            return 'bg-green-100 text-green-800 border-green-200';
        default:
            return 'bg-blue-100 text-blue-800 border-blue-200';
    }
};

function TaskPriority(props: {
    mapPriorityOptionsCallback: (
        priority: InertiaFormProps<TaskFormFields>['data']['priority'],
    ) => React.JSX.Element;
    errors: InertiaFormProps<TaskFormFields>['errors'];
}) {
    return (
        <div>
            <InputLabel htmlFor="priority" value="Priority" />

            <div className="mt-2 flex gap-4">
                {(['normal', 'resident', 'emergency'] as const).map(
                    props.mapPriorityOptionsCallback,
                )}
            </div>

            <InputError message={props.errors.priority} className="mt-2" />
        </div>
    );
}

export default function TaskForm({ task }: { task: Task | null }) {
    const isEditing = !!task?.id;
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [characterCount, setCharacterCount] = useState(0);
    const maxTitleLength = 160;

    const { data, setData, post, put, processing, errors, reset } =
        useForm<TaskFormFields>({
            title: task?.title || '',
            description: task?.description || '',
            priority: task?.priority || 'normal',
            due_date: task?.due_date || '',
        });

    // Update character count when title changes
    useEffect(() => {
        setCharacterCount(data.title.length);
    }, [data.title]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEditing) {
            put(route('tasks.update', task.id), {
                onSuccess: () => reset(),
                onError: (errors) => console.error(errors),
            });
        } else {
            post(route('tasks.store'), {
                onSuccess: () => reset(),
                onError: (errors) => console.error(errors),
            });
        }
    };

    const handleComplete = () => {
        if (!isEditing) return;

        router.put(
            route('tasks.complete', task.id),
            {},
            {
                onSuccess: () => {},
                onError: (errors) => console.error(errors),
            },
        );
    };

    const handleDelete = () => {
        if (!isEditing) return;

        router.delete(route('tasks.destroy', task.id), {
            onSuccess: () => {},
            onError: (errors) => console.error(errors),
        });
    };

    return (
        <div className="bg-white p-6 shadow-sm">
            {/* Main Form */}
            {!showDeleteConfirm ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title Field */}
                    <div>
                        <div className="flex items-center justify-between">
                            <InputLabel htmlFor="title" value="Title" />

                            <span
                                className={`text-xs ${characterCount > maxTitleLength ? 'font-semibold text-red-500' : 'text-gray-500'}`}
                            >
                                {characterCount}/{maxTitleLength}
                            </span>
                        </div>

                        <TextInput
                            id="title"
                            type="text"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            className="mt-1 block w-full"
                            placeholder="Task title"
                            maxLength={maxTitleLength}
                        />

                        <InputError message={errors.title} className="mt-2" />
                    </div>

                    {/* Description Field */}
                    <div>
                        <InputLabel htmlFor="description" value="Description" />

                        <textarea
                            id="description"
                            value={data.description}
                            onChange={(e) =>
                                setData('description', e.target.value)
                            }
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            placeholder="Task description (optional)"
                            rows={4}
                        />

                        <InputError
                            message={errors.description}
                            className="mt-2"
                        />
                    </div>

                    {/* Priority Field */}
                    <TaskPriority
                        mapPriorityOptionsCallback={(priority) => (
                            <label
                                key={priority}
                                className={`flex cursor-pointer items-center gap-2 rounded-lg border p-3 ${
                                    data.priority === priority
                                        ? `ring-2 ring-offset-2 ${getPriorityColor(priority)}`
                                        : 'bg-white'
                                }`}
                            >
                                <input
                                    type="radio"
                                    name="priority"
                                    value={priority}
                                    checked={data.priority === priority}
                                    onChange={() =>
                                        setData('priority', priority)
                                    }
                                    className="hidden"
                                />
                                {priority === 'emergency' && (
                                    <AlertTriangle className="h-4 w-4 text-govdo-pink-dark" />
                                )}
                                <span className="capitalize">{priority}</span>
                            </label>
                        )}
                        errors={errors}
                    />

                    {/* Due Date Field */}
                    <TaskDueDate
                        data={data}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setData('due_date', e.target.value)
                        }
                        errors={errors}
                    />

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-4">
                        <TaskPrimaryActions
                            onSubmit={() => router.visit(route('tasks.index'))}
                            disabled={processing}
                            editing={isEditing}
                        />

                        {/* Task Actions (Edit mode only) */}
                        {isEditing && (
                            <TaskEditActions
                                handleComplete={handleComplete}
                                completedAt={task?.completed_at}
                                onDelete={() => setShowDeleteConfirm(true)}
                            />
                        )}
                    </div>
                </form>
            ) : (
                /* Delete Confirmation */
                <DeleteConfirmation
                    onCancel={() => setShowDeleteConfirm(false)}
                    onConfirmDelete={handleDelete}
                />
            )}
        </div>
    );
}
