import { Copy, CopyCheckIcon } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';

interface ICopyButtonProps {
  onCopy?: () => void;
  content: string;
}

const CopyButton = ({ onCopy, content } : ICopyButtonProps) => {
    const [wasCopied, setWasCopied] = useState(false);
    return (
        <div>
            <Button
                variant="outline"
                onClick={async () => {
                    await navigator.clipboard.writeText(content);
                    onCopy?.();
                    setWasCopied(true);
                }}
            >
                {!wasCopied ? <Copy className="w-6 h-6" /> : <CopyCheckIcon />}
            </Button>
        </div>
    );
};

export default CopyButton;