import { Task } from '@/types';

export default function TaskForm({task}: {task: Task | null}) {
    return (
        <form>
            <input type="text" placeholder="What needs to be done?" />
        </form>
    );
}
