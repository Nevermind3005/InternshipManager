import { useState } from "react";
import { Input } from "../ui/input";
import { Eye, EyeOff } from "lucide-react";

const SecretInput = ({ className, ...props }: React.ComponentProps<"input">) => {
    const [isVisible, setIsVisible] = useState(false);
    return <div className="relative w-full">
        <Input 
            className={`pr-8 ${className ?? ""}`}
            type={isVisible ? "text" : "password"} 
            {...props}
        />
        {isVisible ? (
            <Eye
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                size={16}
                onClick={() => setIsVisible(false)}
            />
        ) : (
            <EyeOff
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                size={16}
                onClick={() => setIsVisible(true)}
            />
        )}
    </div>;
};

export default SecretInput;