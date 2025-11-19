import { useQuery } from "@tanstack/react-query";
import { authHttpClient } from "../http";
import { API } from "../api";
import type { IPersonalInformationRes } from "@/models/user/IPersonalInformationRes";
import { useAuthStore } from "@/store/useAuthStore";

export const personalInformationQueryKey = (userId: string | undefined) => ["personal-information", userId] as const;

const getPersonalInformation = async () => {
    return await authHttpClient.get(API.Endpoints.Users.PersonalInformation()).json<IPersonalInformationRes>();
};

export const useGetPersonalInformation = () => {
    const userId = useAuthStore((state) => state.userId);

    return useQuery({
        queryKey: personalInformationQueryKey(userId || undefined),
        queryFn: getPersonalInformation,
        staleTime: 5 * 60 * 1000,
        enabled: Boolean(userId)
    });
};
