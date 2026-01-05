import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authHttpClient } from "../http";
import { API } from "../api";

export const useDeleteApplication = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["deleteApplication"],
        retry: 1,
        mutationFn: async (id: string) => {
            return await authHttpClient.delete(
                API.Endpoints.OAuth.DeleteApplication(id));
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['applications'] });
        }
    });
};