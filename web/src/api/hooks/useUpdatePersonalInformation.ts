import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authHttpClient } from "../http";
import { API } from "../api";
import type { IUpdatePersonalInformationReq } from "@/models/user/IUpdatePersonalInformationReq";
import { personalInformationQueryKey } from "./useGetPersonalInformation";
import { useAuthStore } from "@/store/useAuthStore";

const updatePersonalInformation = async (req: IUpdatePersonalInformationReq) => {
    await authHttpClient.put(API.Endpoints.Users.PersonalInformation(), {
        json: req
    });
};

export const useUpdatePersonalInformation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updatePersonalInformation,
        onSuccess: () => {
            const { userId } = useAuthStore.getState();
            if (userId) {
                void queryClient.invalidateQueries({ queryKey: personalInformationQueryKey(userId) });
            }
        }
    });
};
