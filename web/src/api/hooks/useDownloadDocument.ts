import { useState } from "react";
import { useIntl } from "react-intl";
import { toast } from "sonner";
import { HTTPError } from "ky";
import { authHttpClient } from "../http";
import { API } from "../api";

type DocumentType = 'report' | 'agreement' | 'instructions';

export const useDownloadDocument = () => {
    const [isDownloading, setIsDownloading] = useState<DocumentType | null>(null);
    const intl = useIntl();

    const downloadDocument = async (type: DocumentType) => {
        setIsDownloading(type);
        
        try {
            const endpoints: Record<DocumentType, string> = {
                report: API.Endpoints.Document.Report(),
                agreement: API.Endpoints.Document.Agreement(),
                instructions: API.Endpoints.Document.Instructions()
            };

            const response = await authHttpClient.get(endpoints[type]);
            const blob = await response.blob();
            
            // Get filename from Content-Disposition header
            const contentDisposition = response.headers.get("Content-Disposition");
            let fileName = `document.${type === 'instructions' ? 'pdf' : 'docx'}`;
            
            if (contentDisposition) {
                const fileNameMatch = contentDisposition.match(/filename\*?=(?:UTF-8'')?["']?([^"';\n]+)["']?/i);
                if (fileNameMatch?.[1]) {
                    fileName = decodeURIComponent(fileNameMatch[1].replace(/['"]/g, ''));
                } else {
                    const simpleMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
                    if (simpleMatch?.[1]) {
                        fileName = simpleMatch[1].replace(/['"]/g, '');
                    }
                }
            }

            // Create download link
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = downloadUrl;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(downloadUrl);

        } catch (error) {
            let message = intl.formatMessage({ id: "Internship.Documents.Error" });
            
            if (error instanceof HTTPError) {
                try {
                    const data = await error.response.json();
                    if (data.message) {
                        message = data.message;
                    }
                } catch {
                    // Use default error message
                }
            }
            
            toast.error(message);
        } finally {
            setIsDownloading(null);
        }
    };

    return { downloadDocument, isDownloading };
};
