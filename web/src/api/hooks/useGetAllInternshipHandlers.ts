import { authHttpClient } from "../http";
import { API } from "../api";
import { useQuery } from "@tanstack/react-query";
import type { IInternshipHandler } from "@/models/user/IInternshipHandler";

const getAllInternshipHandlers = async (): Promise<IInternshipHandler[]> => {
    const res = await authHttpClient
        .get(API.Endpoints.Users.GetAllInternshipHandlers())
        .json<IInternshipHandler[]>();

    return res;
};

export const useGetAllInternshipHandlers = () => {
    return useQuery({
        queryKey: ["internshipHandlers"],
        queryFn: getAllInternshipHandlers
    });
};
