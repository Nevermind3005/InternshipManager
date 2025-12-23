import type { IApplicationCreateReq } from "@/models/application/IApplicationCreateReq";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authHttpClient } from "../http";
import { API } from "../api";
import type { IApplicationCreateRes } from "@/models/application/IApplicationCreateRes";

export const useCreateApplication = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["createApplication"],
        retry: 1,
        mutationFn: async (req: IApplicationCreateReq) => {
            return await authHttpClient.post(
                API.Endpoints.OAuth.CreateApplication(), 
                { 
                    json: req
                }).json<IApplicationCreateRes>();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['applications'] });
        }
    });
};