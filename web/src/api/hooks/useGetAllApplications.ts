import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { authHttpClient } from "../http";
import { API } from "../api";
import type { IPagedApplicationsRes } from "@/models/paged/IPagedApplicationsRes";

const getAllApplications = async (params: {
  filter?: Record<string, string>;
  page?: number;
  pageSize?: number;
}): Promise<IPagedApplicationsRes> => {
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
        .get(`${API.Endpoints.OAuth.GetAllApplications()}?${searchParams.toString()}`)
        .json<IPagedApplicationsRes>();

    return res;
};

export const useGetAllApplications = (params: {
  filter?: Record<string, string>;
  page?: number;
  pageSize?: number;
}) => {
    return useQuery({
        queryKey: ["applications", params],
        queryFn: () => getAllApplications(params),
        placeholderData: keepPreviousData
    });
};
