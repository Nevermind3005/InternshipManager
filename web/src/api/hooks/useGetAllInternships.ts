import { authHttpClient } from "../http";
import { API } from "../api";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { IPagedInternshipRes } from "@/models/paged/IPagedInternshipRes";

const getAllInternships = async (params: {
  filter?: Record<string, string>;
  page?: number;
  pageSize?: number;
}): Promise<IPagedInternshipRes> => {
    const searchParams = new URLSearchParams();

    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 25;

    const skip = (page - 1) * pageSize;
    const limit = pageSize;

    searchParams.set("skip", skip.toString());
    searchParams.set("limit", limit.toString());

    if (params.filter) {
        for (const [key, value] of Object.entries(params.filter)) {
            if (value) searchParams.set(key, value);
        }
    }

    const res = await authHttpClient
        .get(`${API.Endpoints.Internship.GetAll()}?${searchParams.toString()}`)
        .json<IPagedInternshipRes>();

    return res;
};

export const useGetAllInternships = (params: {
  filter?: Record<string, string>;
  page?: number;
  pageSize?: number;
}) => {
    return useQuery({
        queryKey: ["internships", params],
        queryFn: () => getAllInternships(params),
        placeholderData: keepPreviousData
    });
};
