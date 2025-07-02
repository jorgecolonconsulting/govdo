import { TaskItem } from '@/Components/TaskItem';
import { TaskFilterOptions } from '@/enums/taskFilterOptions';
import { Task, TaskFilter } from '@/types';
import { Link, router } from '@inertiajs/react';
import {
    Calendar,
    CheckCircle,
    Clock,
    ListFilter,
    ListPlus,
    LucideProps,
    Search,
} from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

type FilterUIOption = {
    key: TaskFilterOptions;
    label: string;
    icon: React.FC<LucideProps>;
    count: number;
};

function FilterAside(props: {
    filterUIOptions: FilterUIOption[];
    selectedFilterCallback: (filter: FilterUIOption) => React.JSX.Element;
}) {
    return (
        <div className="order-first sm:order-none sm:w-80">
            <div className="border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="mb-6 text-xl font-light text-foreground">
                    Filters
                </h2>

                <div className="space-y-2">
                    {props.filterUIOptions.map(props.selectedFilterCallback)}
                </div>

                <div className="mt-8 border-t border-gray-200 pt-6">
                    <h3 className="mb-4 text-lg font-light text-foreground">
                        Quick Actions
                    </h3>
                    <div className="space-y-2">
                        <button className="flex w-full items-center space-x-3 rounded-lg p-3 text-left text-foreground transition-colors hover:bg-govdo-neutral-light">
                            <ListPlus className="h-5 w-5 text-gray-500" />
                            <Link href={route('tasks.create')}>
                                Create Task
                            </Link>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

const TaskManager = (props: { tasks: Task[]; initialFilter: TaskFilter }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState(TaskFilterOptions.ALL);
    const [tasks, setTasks] = useState(props.tasks || []);

    // Sync with server data when props change
    useEffect(() => {
        setTasks(props.tasks || []);
    }, [props.tasks]);

    const filteredTasks = useMemo(() => {
        let filtered = tasks;

        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            filtered = filtered.filter((task) =>
                task.title.toLowerCase().includes(searchLower),
            );
        }

        if (activeFilter === TaskFilterOptions.COMPLETED) {
            filtered = filtered.filter((task) => task.completed);
        } else if (activeFilter === TaskFilterOptions.PENDING) {
            filtered = filtered.filter((task) => !task.completed);
        }

        return filtered;
    }, [tasks, searchTerm, activeFilter]);

    const taskCounts = useMemo(
        () => ({
            all: tasks.length,
            completed: tasks.filter((t) => t.completed).length,
            pending: tasks.filter((t) => !t.completed).length,
        }),
        [tasks],
    );

    const toggleTaskCompletion = useCallback((taskId: number) => {
        setTasks((prevTasks) =>
            prevTasks.map((task) =>
                task.id === taskId
                    ? { ...task, completed: !task.completed }
                    : task,
            ),
        );

        router.put(
            route('tasks.complete', taskId),
            {},
            {
                onError: (errors) => {
                    setTasks((prevTasks) =>
                        prevTasks.map((task) =>
                            task.id === taskId
                                ? { ...task, completed: !task.completed }
                                : task,
                        ),
                    );

                    console.error('Failed to update task:', errors);
                },
            },
        );
    }, []);

    const FilterUIOptions = [
        {
            key: TaskFilterOptions.ALL,
            label: 'All Tasks',
            icon: ListFilter,
            count: taskCounts.all,
        },
        {
            key: TaskFilterOptions.PENDING,
            label: 'Pending',
            icon: Clock,
            count: taskCounts.pending,
        },
        {
            key: TaskFilterOptions.COMPLETED,
            label: 'Completed',
            icon: CheckCircle,
            count: taskCounts.completed,
        },
    ];
    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:gap-8">
            {/* Main Content */}
            <div className="flex-1 border border-gray-200 bg-white shadow-sm">
                {/* Search Bar and Create Task Button */}
                <div className="border-b border-gray-200 p-6">
                    <div className="flex items-center gap-4">
                        <Link
                            href={route('tasks.create')}
                            className="hidden items-center gap-2 rounded-lg bg-primary px-4 py-3 text-white transition-colors hover:bg-govdo-blue-dark focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:flex"
                        >
                            <ListPlus className="h-5 w-5" />
                            <span>Create Task</span>
                        </Link>
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search task list..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Task List */}
                <div className="divide-y divide-gray-100">
                    {filteredTasks.map((task) => (
                        <TaskItem
                            key={task.id}
                            task={task}
                            onToggleCompletion={toggleTaskCompletion}
                        />
                    ))}
                </div>

                {filteredTasks.length === 0 && (
                    <div className="p-12 text-center">
                        <div className="mb-4 text-gray-400">
                            <Calendar className="mx-auto h-12 w-12" />
                        </div>
                        <p className="mb-2 text-lg font-medium text-foreground">
                            No tasks found
                        </p>
                        <p className="text-gray-500">
                            Try adjusting your search or filter criteria.
                        </p>
                    </div>
                )}
            </div>

            {/* Sidebar */}
            <FilterAside
                filterUIOptions={FilterUIOptions}
                selectedFilterCallback={(filter) => (
                    <button
                        key={filter.key}
                        onClick={() => setActiveFilter(filter.key)}
                        className={`flex w-full items-center justify-between rounded-lg p-3 transition-colors ${
                            activeFilter === filter.key
                                ? 'border border-govdo-blue-light bg-govdo-blue-light/20 text-govdo-blue-dark'
                                : 'text-foreground hover:bg-govdo-neutral-light'
                        }`}
                    >
                        <filter.icon className="h-5 w-5" />
                        <span className="font-medium">{filter.label}</span>
                        <span
                            className={`rounded-full px-2 py-1 text-sm ${
                                activeFilter === filter.key
                                    ? 'bg-govdo-neutral-white text-govdo-blue-dark'
                                    : 'bg-govdo-neutral-light text-foreground'
                            }`}
                        >
                            {filter.count}
                        </span>
                    </button>
                )}
            />

            {/* Mobile FAB for Create Task */}
            <Link
                href={route('tasks.create')}
                className="fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-background shadow-lg transition-colors hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:hidden"
            >
                <ListPlus className="h-6 w-6" />
            </Link>
        </div>
    );
};

export default TaskManager;
