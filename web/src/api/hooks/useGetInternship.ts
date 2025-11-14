import { useQuery } from "@tanstack/react-query";
import { authHttpClient } from "../http";
import { API } from "../api";
import type { IInternshipRes } from "@/models/internship/IInternshipRes";

const getInternship = async (id: string): Promise<IInternshipRes> => {
    return await authHttpClient
        .get(API.Endpoints.Internship.GetById(id))
        .json<IInternshipRes>();
};

export const useGetInternship = (id: string) => {
    return useQuery({
        queryKey: ["internship", id],
        queryFn: () => getInternship(id),
        enabled: Boolean(id)
    });
};

