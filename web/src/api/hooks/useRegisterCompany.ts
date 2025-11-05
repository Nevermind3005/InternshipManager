import type { ICompanyRegisterReq } from "@/models/user/ICompanyRegisterReq";
import { useMutation } from "@tanstack/react-query";
import { httpClient } from "../http";
import { API } from "../api";
import type { IUserRes } from "@/models/user/IUserRes";

export const useRegisterCompany = () => {
    return useMutation({
        mutationFn: async (req: ICompanyRegisterReq) => {
            return await httpClient.post(
                API.Endpoints.Auth.RegisterCompany(), 
                { 
                    json: req 
                }).json<IUserRes>();
        }
    });
};