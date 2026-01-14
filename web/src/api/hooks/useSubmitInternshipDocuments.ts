import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authHttpClient } from "../http";
import { API } from "../api";

export const useSubmitInternshipDocuments = (options?: {
    onSuccess?: () => void;
    onError?: (error: Error) => void;
}) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (internshipId: string) => {
            await authHttpClient.post(API.Endpoints.Internship.SubmitDocuments(internshipId));
        },
        onSuccess: (_, internshipId) => {
            queryClient.invalidateQueries({ queryKey: ['internship-documents', internshipId] });
            options?.onSuccess?.();
        },
        onError: options?.onError
    });
};
