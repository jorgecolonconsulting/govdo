import { PageHeader } from '@/Components/PageHeader';
import TaskForm from '@/Components/TaskForm';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Task } from '@/types';
import { Head } from '@inertiajs/react';

export default function AddEditTask({ task }: { task: Task | null }) {
    return (
        <AuthenticatedLayout header={<PageHeader header="New Task" />}>
            <Head title="New Task" />

            <TaskForm task={task} />
        </AuthenticatedLayout>
    );
}
