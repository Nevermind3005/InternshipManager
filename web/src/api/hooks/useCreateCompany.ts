import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authHttpClient } from "../http";
import { API } from "../api";
import type { ICompanyRes } from "@/models/company/ICompanyRes";
import type { ICompanyReq } from "@/models/company/ICompanyReq";

export const useCreateCompany = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["createCompany"],
        retry: 1,
        mutationFn: async (req: ICompanyReq) => {
            return await authHttpClient.post(
                API.Endpoints.Company.Create(), 
                { 
                    json: req 
                }).json<ICompanyRes>();
        },
        onSuccess: (newCompany) => {
            queryClient.setQueryData<ICompanyRes[]>(["companies"], (old = []) => [
                ...old,
                newCompany,
            ]);
        }
    });
};