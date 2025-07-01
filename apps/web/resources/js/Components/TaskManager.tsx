import { Task } from '@/types';
import {
    AlertTriangle,
    Calendar,
    CheckCircle,
    Clock,
    ListFilter,
    ListPlus,
    MoreHorizontal,
    Search,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from '@inertiajs/react';

const TaskManager = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');
    const [selectedTasks, setSelectedTasks] = useState<Set<number>>(new Set());

    const initialTasks: Task[] = [
        {
            id: 1,
            title: 'Draft Emergency Alert for Severe Weather Warning',
            completed: false,
            assignees: [
                { name: 'Sarah Chen', avatar: 'SC' },
                { name: 'Marcus Johnson', avatar: 'MJ' },
                { name: 'Elena Rodriguez', avatar: 'ER' },
            ],
            priority: 'emergency',
        },
        {
            id: 2,
            title: 'Prepare Town Hall Meeting Announcement',
            completed: false,
            assignees: [
                { name: 'David Kim', avatar: 'DK' },
                { name: 'Lisa Thompson', avatar: 'LT' },
            ],
            priority: 'resident',
        },
        {
            id: 3,
            title: 'Review Policy Change Documentation',
            completed: true,
            assignees: [
                { name: 'Robert Martinez', avatar: 'RM' },
                { name: 'Amanda Foster', avatar: 'AF' },
                { name: 'James Wilson', avatar: 'JW' },
            ],
            priority: 'normal',
        },
        {
            id: 4,
            title: 'Update Public Transportation Schedule Notice',
            completed: false,
            assignees: [
                { name: 'Patricia Lee', avatar: 'PL' },
                { name: 'Carlos Rivera', avatar: 'CR' },
            ],
            priority: 'resident',
        },
        {
            id: 5,
            title: 'Coordinate Press Release for Budget Approval',
            completed: false,
            assignees: [
                { name: 'Jennifer Park', avatar: 'JP' },
                { name: 'Michael Brown', avatar: 'MB' },
                { name: 'Nicole Davis', avatar: 'ND' },
            ],
            priority: 'emergency',
        },
        {
            id: 6,
            title: 'Emergency Protocol Communication Update',
            completed: true,
            assignees: [{ name: 'Thomas Anderson', avatar: 'TA' }],
            priority: 'emergency',
        },
        {
            id: 7,
            title: 'Community Feedback Response Framework',
            completed: false,
            assignees: [
                { name: 'Anna Garcia', avatar: 'AG' },
                { name: "Kevin O'Brien", avatar: 'KO' },
            ],
            priority: 'normal',
        },
        {
            id: 8,
            title: 'Compliance Report for State Audit',
            completed: false,
            assignees: [
                { name: 'Rachel Kim', avatar: 'RK' },
                { name: 'Daniel Smith', avatar: 'DS' },
                { name: 'Maria Gonzalez', avatar: 'MG' },
            ],
            priority: 'emergency',
        },
    ];

    const [tasks, setTasks] = useState(initialTasks);

    const filteredTasks = useMemo(() => {
        let filtered = tasks;

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter((task) =>
                task.title.toLowerCase().includes(searchTerm.toLowerCase()),
            );
        }

        // Apply status filter
        if (activeFilter === 'Completed') {
            filtered = filtered.filter((task) => task.completed);
        } else if (activeFilter === 'Pending') {
            filtered = filtered.filter((task) => !task.completed);
        }

        return filtered;
    }, [tasks, searchTerm, activeFilter]);

    const taskCounts = useMemo(() => {
        return {
            all: tasks.length,
            completed: tasks.filter((t) => t.completed).length,
            pending: tasks.filter((t) => !t.completed).length,
        };
    }, [tasks]);

    const toggleTaskCompletion = (taskId: number) => {
        setTasks((prevTasks) =>
            prevTasks.map((task) =>
                task.id === taskId
                    ? { ...task, completed: !task.completed }
                    : task,
            ),
        );
    };

    const toggleTaskSelection = (taskId: number) => {
        setSelectedTasks((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(taskId)) {
                newSet.delete(taskId);
            } else {
                newSet.add(taskId);
            }
            return newSet;
        });
    };

    const getPriorityColor = (priority: string) => {
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
            return <AlertTriangle className="h-4 w-4 text-red-500" />;
        }
        return null;
    };

    const capitalizePriority = (priority: string) => {
        return priority.charAt(0).toUpperCase() + priority.slice(1);
    };

    const Avatar = ({ avatar, name }: { avatar: string; name: string }) => (
        <div
            className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-purple-500 text-xs font-medium text-white ring-2 ring-white"
            title={name}
        >
            {avatar}
        </div>
    );

    return (
        <div className="mx-auto max-w-7xl px-8 py-8">
            <div className="flex gap-8">
                {/* Main Content */}
                <div className="flex-1">
                    <div className="overflow-hidden border border-gray-200 bg-white shadow-sm">
                        {/* Search Bar */}
                        <div className="border-b border-gray-200 p-6">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search task list..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {/* Task List */}
                        <div className="divide-y divide-gray-100">
                            {filteredTasks.map((task) => (
                                <div
                                    key={task.id}
                                    className={`p-6 transition-colors hover:bg-gray-50 ${
                                        task.completed ? 'opacity-75' : ''
                                    }`}
                                >
                                    <div className="flex items-center space-x-4">
                                        {/* Checkbox */}
                                        <input
                                            type="checkbox"
                                            checked={selectedTasks.has(task.id)}
                                            onChange={() =>
                                                toggleTaskSelection(task.id)
                                            }
                                            className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />

                                        {/* Task Content */}
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center space-x-3">
                                                <h3
                                                    className={`text-lg font-medium text-gray-900 ${
                                                        task.completed
                                                            ? 'line-through'
                                                            : ''
                                                    }`}
                                                >
                                                    {task.title}
                                                </h3>
                                                {getPriorityIcon(task.priority)}
                                            </div>
                                        </div>

                                        {/* Priority */}
                                        <span
                                            className={`rounded-full border px-3 py-1 text-sm font-medium ${getPriorityColor(task.priority)}`}
                                        >
                                            {capitalizePriority(task.priority)}
                                        </span>

                                        {/* Assignees */}
                                        <div className="flex -space-x-2">
                                            {task.assignees
                                                .slice(0, 3)
                                                .map((assignee, index) => (
                                                    <Avatar
                                                        key={index}
                                                        avatar={assignee.avatar}
                                                        name={assignee.name}
                                                    />
                                                ))}
                                            {task.assignees.length > 3 && (
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-xs font-medium text-gray-600 ring-2 ring-white">
                                                    +{task.assignees.length - 3}
                                                </div>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <button className="rounded p-2 transition-colors hover:bg-gray-200">
                                            <MoreHorizontal className="h-5 w-5 text-gray-400" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {filteredTasks.length === 0 && (
                            <div className="p-12 text-center">
                                <div className="mb-4 text-gray-400">
                                    <Calendar className="mx-auto h-12 w-12" />
                                </div>
                                <h3 className="mb-2 text-lg font-medium text-gray-900">
                                    No tasks found
                                </h3>
                                <p className="text-gray-500">
                                    Try adjusting your search or filter
                                    criteria.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="w-80">
                    <div className="border border-gray-200 bg-white p-6 shadow-sm">
                        <h2 className="mb-6 text-xl font-light text-gray-900">
                            Filters
                        </h2>

                        <div className="space-y-2">
                            {[
                                {
                                    key: 'All',
                                    label: 'All Tasks',
                                    icon: ListFilter,
                                    count: taskCounts.all,
                                },
                                {
                                    key: 'Pending',
                                    label: 'Pending',
                                    icon: Clock,
                                    count: taskCounts.pending,
                                },
                                {
                                    key: 'Completed',
                                    label: 'Completed',
                                    icon: CheckCircle,
                                    count: taskCounts.completed,
                                },
                            ].map((filter) => (
                                <button
                                    key={filter.key}
                                    onClick={() => setActiveFilter(filter.key)}
                                    className={`flex w-full items-center justify-between rounded-lg p-3 transition-colors ${
                                        activeFilter === filter.key
                                            ? 'border border-blue-200 bg-blue-50 text-blue-700'
                                            : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    <filter.icon className="h-5 w-5" />
                                    <span className="font-medium">
                                        {filter.label}
                                    </span>
                                    <span
                                        className={`rounded-full px-2 py-1 text-sm ${
                                            activeFilter === filter.key
                                                ? 'bg-blue-100 text-blue-700'
                                                : 'bg-gray-100 text-gray-600'
                                        }`}
                                    >
                                        {filter.count}
                                    </span>
                                </button>
                            ))}
                        </div>

                        <div className="mt-8 border-t border-gray-200 pt-6">
                            <h3 className="mb-4 text-lg font-light text-gray-900">
                                Quick Actions
                            </h3>
                            <div className="space-y-2">
                                <button className="flex w-full items-center space-x-3 rounded-lg p-3 text-left text-gray-700 transition-colors hover:bg-gray-50">
                                    <ListPlus className="h-5 w-5 text-gray-500" />
                                    <Link href={route('create-task')}>Create Task</Link>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskManager;
