import { useState } from "react";
import { useIntl } from "react-intl";
import { toast } from "sonner";
import { HTTPError } from "ky";
import { authHttpClient } from "../http";
import { API } from "../api";

export const useDownloadInternshipDocument = () => {
    const [isDownloading, setIsDownloading] = useState<string | null>(null);
    const intl = useIntl();

    const downloadDocument = async (internshipId: string, documentId: string) => {
        setIsDownloading(documentId);
        
        try {
            const response = await authHttpClient.get(
                API.Endpoints.Internship.DownloadDocument(internshipId, documentId)
            );
            const blob = await response.blob();
            
            // Get filename from Content-Disposition header
            const contentDisposition = response.headers.get("Content-Disposition");
            let fileName = "document";
            
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
