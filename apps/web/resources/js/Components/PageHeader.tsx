import { cn } from '@/lib/utils';

export function PageHeader(props: { header: string; className?: string }) {
    return (
        <h2
            className={cn(
                'text-2xl font-semibold leading-tight text-foreground/90',
                props.className,
            )}
        >
            {props.header}
        </h2>
    );
}
