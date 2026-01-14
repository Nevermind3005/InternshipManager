import { httpClient } from "../http";
import { API } from "../api";
import { useQuery } from "@tanstack/react-query";
import type { ICompanyRes } from "@/models/company/ICompanyRes";

const getAllCompaniesPublic = async (): Promise<ICompanyRes[]> => {
    const res = await httpClient
        .get(API.Endpoints.Company.GetAllPublic())
        .json<ICompanyRes[]>();

    return res;
};

export const useGetAllCompaniesPublic = () => {
    return useQuery({
        queryKey: ["companies-public"],
        queryFn: getAllCompaniesPublic
    });
};
