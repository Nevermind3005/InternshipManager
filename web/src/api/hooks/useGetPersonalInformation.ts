import { useQuery } from "@tanstack/react-query";
import { authHttpClient } from "../http";
import { API } from "../api";
import type { IPersonalInformationRes } from "@/models/user/IPersonalInformationRes";

const queryKey = ["personal-information"] as const;

const getPersonalInformation = async () => {
    return await authHttpClient.get(API.Endpoints.Users.PersonalInformation()).json<IPersonalInformationRes>();
};

export const useGetPersonalInformation = () => {
    return useQuery({
        queryKey,
        queryFn: getPersonalInformation,
        staleTime: 5 * 60 * 1000
    });
};

export { queryKey as personalInformationQueryKey };
