import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authHttpClient } from "../http";
import { API } from "../api";

interface DeleteDocumentParams {
    internshipId: string;
    documentId: string;
}

export const useDeleteInternshipDocument = (options?: {
    onSuccess?: () => void;
    onError?: (error: Error) => void;
}) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ internshipId, documentId }: DeleteDocumentParams) => {
            await authHttpClient.delete(API.Endpoints.Internship.DeleteDocument(internshipId, documentId));
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['internship-documents', variables.internshipId] });
            options?.onSuccess?.();
        },
        onError: options?.onError
    });
};
