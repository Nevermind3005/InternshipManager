import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authHttpClient } from "../http";
import { API } from "../api";
import type { IUserRes } from "@/models/user/IUserRes";
import type { IRepresentativeRegisterReq } from "@/models/user/representative/IRepresentativeRegister";

export const useRegisterRepresentative = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["registerRepresentative"],
        retry: 1,
        mutationFn: async (req: IRepresentativeRegisterReq) => {
            return await authHttpClient.post(
                API.Endpoints.Auth.RegisterRepresentative(), 
                { 
                    json: req 
                }).json<IUserRes>();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['representatives'] });
        }
    });
};