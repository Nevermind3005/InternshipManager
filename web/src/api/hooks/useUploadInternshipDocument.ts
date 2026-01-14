import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authHttpClient } from "../http";
import { API } from "../api";
import type { IInternshipDocument, DocumentSlot } from "@/models/internship/IInternshipDocument";

interface UploadDocumentParams {
    internshipId: string;
    slot: DocumentSlot;
    file: File;
}

export const useUploadInternshipDocument = (options?: {
    onSuccess?: (data: IInternshipDocument) => void;
    onError?: (error: Error) => void;
}) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ internshipId, slot, file }: UploadDocumentParams) => {
            const formData = new FormData();
            formData.append('file', file);

            const response = await authHttpClient.post(
                API.Endpoints.Internship.UploadDocument(internshipId, slot),
                {
                    body: formData,
                    // Don't set Content-Type - let browser set it with boundary
                }
            );
            return response.json<IInternshipDocument>();
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['internship-documents', variables.internshipId] });
            options?.onSuccess?.(data);
        },
        onError: options?.onError
    });
};
