import { useQuery } from "@tanstack/react-query";
import { httpClient } from "../http";
import { API } from "../api";
import type { IInternshipRes } from "@/models/internship/IInternshipRes";

const viewInternship = async (id: string, token: string): Promise<IInternshipRes> => {
    return await httpClient
        .get(API.Endpoints.Internship.ViewById(id, token))
        .json<IInternshipRes>();
};

export const useViewInternship = (id: string, token?: string) => {
    return useQuery({
        queryKey: ["internship-view", id, token],
        queryFn: () => viewInternship(id, token || ''),
        enabled: Boolean(id) && Boolean(token)
    });
};

