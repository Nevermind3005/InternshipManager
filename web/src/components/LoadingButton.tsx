import { LoaderIcon } from "lucide-react";
import { Button } from "./ui/button";
import type { ReactNode } from "react";

interface ILoadingButtonProps {
    children: ReactNode,
    isPending: boolean,
    form?: string,
    disabled?: boolean,
    variant?: "default" | "link" | "destructive" | "outline" | "secondary" | "ghost" | null | undefined
}

const LoadingButton = ({ children, isPending, form, disabled = false, variant = "default" }: ILoadingButtonProps) => {
    return (
        <Button type="submit" form={form} disabled={isPending || disabled} variant={variant}>
            {isPending ? <LoaderIcon
                role="status"
                aria-label="Loading"
                className="size-4 animate-spin"
            /> : null}
            {isPending ? "Processing" : children}
        </Button>
    );
};

export default LoadingButton;