import { useMutation } from "@tanstack/react-query";
import { authHttpClient } from "../http";
import { API } from "../api";
import type {IUserRes} from "@/models/user/IUserRes";
import type { ICreateInternshipHandler } from "@/models/auth/ICreateInternshipHandler";

export const useCreateInternshipHandler = () => {
    return useMutation({
        mutationFn: async (req: ICreateInternshipHandler) => {
            return await authHttpClient.post(
                API.Endpoints.Auth.CreateInternshipHandler(), 
                { 
                    json: req 
                }).json<IUserRes>();
        }
    });
};