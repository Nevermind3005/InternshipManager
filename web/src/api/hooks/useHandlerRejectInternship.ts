import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";
import { authHttpClient } from "../http";
import { API } from "../api";
import type { IInternshipRes } from "@/models/internship/IInternshipRes";

const handlerRejectInternship = async (id: string): Promise<IInternshipRes> => {
    return await authHttpClient
        .post(API.Endpoints.Internship.HandlerReject(id))
        .json<IInternshipRes>();
};

export const useHandlerRejectInternship = (
    options?: UseMutationOptions<IInternshipRes, Error, string>
) => {
    const queryClient = useQueryClient();
    const { onSuccess, onError, ...restOptions } = options ?? {};
    return useMutation<IInternshipRes, Error, string>({
        ...restOptions,
        mutationFn: (id: string) => handlerRejectInternship(id),
        onSuccess: async (data, variables, context) => {
            await queryClient.invalidateQueries({ queryKey: ["internship", data.id] });
            await queryClient.invalidateQueries({ predicate: (query) => query.queryKey[0] === "internships" });
            await onSuccess?.(data, variables, context);
        },
        onError: async (error, variables, context) => {
            await onError?.(error, variables, context);
        }
    });
};
