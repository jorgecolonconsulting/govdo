import { Config } from 'ziggy-js';

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
    ziggy: Config & { location: string };
};

type Assignee = {
    name: string;
    avatar: string;
};

export type Task = {
    id: number;
    title: string;
    description?: string;
    completed: boolean;
    completed_at?: string | null;
    assignees?: Assignee[];
    priority: 'normal' | 'resident' | 'emergency';
    due_date?: string | null;
    created_at?: string;
    updated_at?: string;
    modified_by?: number;
};

export type TaskFilter = 'all' | 'pending' | 'completed';

export type TaskFormFields = Pick<
    Task,
    'title' | 'description' | 'priority' | 'due_date'
>;
