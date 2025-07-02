import { PageHeader } from '@/Components/PageHeader';
import TaskManager from '@/Components/TaskManager';
import { TaskFilterOptions } from '@/enums/taskFilterOptions';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Task, TaskFilter } from '@/types';
import { Head } from '@inertiajs/react';

interface DashboardProps {
    tasks: Task[];
    filter: TaskFilter;
}

export default function Dashboard({
    tasks = [],
    filter = TaskFilterOptions.ALL,
}: DashboardProps) {
    return (
        <AuthenticatedLayout
            header={<PageHeader header="Task Dashboard"></PageHeader>}
        >
            <Head title="Task Dashboard" />

            <TaskManager tasks={tasks} initialFilter={filter} />
        </AuthenticatedLayout>
    );
}
