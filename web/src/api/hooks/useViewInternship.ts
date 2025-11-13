import { useQuery } from "@tanstack/react-query";
import { httpClient } from "../http";
import { API } from "../api";
import type { IInternshipRes } from "@/models/internship/IInternshipRes";

const viewInternship = async (id: string): Promise<IInternshipRes> => {
    return await httpClient
        .get(API.Endpoints.Internship.ViewById(id))
        .json<IInternshipRes>();
};

export const useViewInternship = (id: string) => {
    return useQuery({
        queryKey: ["internship-view", id],
        queryFn: () => viewInternship(id),
        enabled: Boolean(id)
    });
};

