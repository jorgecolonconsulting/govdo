import { PageHeader } from '@/Components/PageHeader';
import TaskForm from '@/Components/TaskForm';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Task } from '@/types';
import { Head } from '@inertiajs/react';

export default function AddEditTask({ task }: { task: Task | null }) {
    const isEditing = !!task?.id;
    const pageTitle = isEditing ? `Edit Task: ${task.title}` : 'New Task';

    return (
        <AuthenticatedLayout header={<PageHeader header={pageTitle} />}>
            <Head title={pageTitle} />

            <TaskForm task={task} />
        </AuthenticatedLayout>
    );
}
