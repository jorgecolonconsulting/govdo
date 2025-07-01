import { PageHeader } from '@/Components/PageHeader';
import TaskManager from '@/Components/TaskManager';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <AuthenticatedLayout
            header={<PageHeader header="Dashboard"></PageHeader>}
        >
            <Head title="Dashboard" />

            <TaskManager />
        </AuthenticatedLayout>
    );
}
