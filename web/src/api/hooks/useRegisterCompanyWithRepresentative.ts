import { useMutation } from "@tanstack/react-query";
import { httpClient } from "../http";
import { API } from "../api";
import type { IUserRes } from "@/models/user/IUserRes";
import type { ICompanyWithRepresentativeRegisterReq } from "@/models/company/ICompanyWithRepresentativeRegisterReq";

export const useRegisterCompanyWithRepresentative = () => {
    return useMutation({
        mutationFn: async (req: ICompanyWithRepresentativeRegisterReq) => {
            return await httpClient.post(
                API.Endpoints.Auth.RegisterCompany(), 
                { 
                    json: req 
                }).json<IUserRes>();
        }
    });
};
