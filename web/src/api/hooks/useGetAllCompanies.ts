import { authHttpClient } from "../http";
import { API } from "../api";
import { useQuery } from "@tanstack/react-query";
import type { ICompanyRes } from "@/models/company/ICompanyRes";

const getAllCompanies = async (): Promise<ICompanyRes[]> => {
    const res = await authHttpClient
        .get(API.Endpoints.Company.GetAll())
        .json<ICompanyRes[]>();

    return res;
};

export const useGetAllCompanies = () => {
    return useQuery({
        queryKey: ["companies"],
        queryFn: getAllCompanies
    });
};