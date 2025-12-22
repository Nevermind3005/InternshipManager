import type { IApplicationCreateReq } from "@/models/application/IApplicationCreateReq";
import { useMutation } from "@tanstack/react-query";
import { authHttpClient } from "../http";
import { API } from "../api";
import type { IApplicationCreateRes } from "@/models/application/IApplicationCreateRes";

export const useCreateApplication = () => {
    return useMutation({
        mutationFn: async (req: IApplicationCreateReq) => {
            return await authHttpClient.post(
                API.Endpoints.OAuth.CreateApplication(), 
                { 
                    json: req
                }).json<IApplicationCreateRes>();
        }
    });
};