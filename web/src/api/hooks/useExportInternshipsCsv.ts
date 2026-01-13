import { useState } from "react";
import { useIntl } from "react-intl";
import { toast } from "sonner";
import { HTTPError } from "ky";
import { authHttpClient } from "../http";
import { API } from "../api";

export const useExportInternshipsCsv = () => {
    const [isExporting, setIsExporting] = useState(false);
    const intl = useIntl();

    const exportCsv = async (filter: Record<string, string>) => {
        setIsExporting(true);
        
        try {
            const searchParams = new URLSearchParams();
            
            for (const [key, value] of Object.entries(filter)) {
                if (value) searchParams.set(key, value);
            }

            const queryString = searchParams.toString();
            const url = queryString 
                ? `${API.Endpoints.Internship.ExportCsv()}?${queryString}`
                : API.Endpoints.Internship.ExportCsv();

            const response = await authHttpClient.get(url);
            const blob = await response.blob();
            
            // Get filename from Content-Disposition header or use default
            const contentDisposition = response.headers.get("Content-Disposition");
            let fileName = `internships_export_${new Date().toISOString().split('T')[0]}.csv`;
            
            if (contentDisposition) {
                const fileNameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
                if (fileNameMatch?.[1]) {
                    fileName = fileNameMatch[1].replace(/['"]/g, '');
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

            toast.success(intl.formatMessage({ id: "Export.Success" }));
        } catch (error) {
            let message = intl.formatMessage({ id: "Export.Error" });
            
            if (error instanceof HTTPError) {
                try {
                    const data = await error.response.json();
                    message = intl.formatMessage({ id: data.title });
                } catch {
                    // Use default error message
                }
            }
            
            toast.error(message);
        } finally {
            setIsExporting(false);
        }
    };

    return { exportCsv, isExporting };
};
