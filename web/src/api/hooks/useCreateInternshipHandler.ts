import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authHttpClient } from "../http";
import { API } from "../api";
import type {IUserRes} from "@/models/user/IUserRes";
import type { ICreateInternshipHandler } from "@/models/auth/ICreateInternshipHandler";
import type { IInternshipHandler } from "@/models/user/IInternshipHandler";

export const useCreateInternshipHandler = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["createInternshipHandler"],
        retry: 1,
        mutationFn: async (req: ICreateInternshipHandler) => {
            return await authHttpClient.post(
                API.Endpoints.Auth.CreateInternshipHandler(), 
                { 
                    json: req 
                }).json<IUserRes>();
        },
        onSuccess: (newHandler) => {
            queryClient.setQueryData<IInternshipHandler[]>(["internshipHandlers"], (old = []) => [
                ...old,
                {
                    id: newHandler.id,
                    email: newHandler.email,
                    firstName: newHandler.firstName,
                    lastName: newHandler.lastName
                }
            ]);
        }
    });
};