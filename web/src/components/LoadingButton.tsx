import { LoaderIcon } from "lucide-react";
import { Button } from "./ui/button";
import type { ReactNode } from "react";

interface ILoadingButtonProps {
    children: ReactNode,
    isPending: boolean,
    form?: string,
    disabled?: boolean,
    variant?: "default" | "link" | "destructive" | "outline" | "secondary" | "ghost" | null | undefined,
    type?: "button" | "submit" | "reset" | undefined,
    onClick?: () => void | undefined
}

const LoadingButton = ({ children, isPending, form, onClick, disabled = false, variant = "default", type = "submit" }: ILoadingButtonProps) => {
    return (
        <Button 
            type={type}
            form={form}
            disabled={isPending || disabled}
            onClick={onClick}
            variant={variant}>
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