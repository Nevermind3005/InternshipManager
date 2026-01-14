import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authHttpClient } from "../http";
import { API } from "../api";
import type { IUpdatePersonalInformationReq } from "@/models/user/IUpdatePersonalInformationReq";
import type { IUpdateInternshipHandlerPersonalInfoReq } from "@/models/user/IUpdateInternshipHandlerPersonalInfoReq";
import type { IUpdateCompanyRepresentativePersonalInfoReq } from "@/models/user/IUpdateCompanyRepresentativePersonalInfoReq";
import { personalInformationQueryKey } from "./useGetPersonalInformation";
import { useAuthStore } from "@/store/useAuthStore";

type UpdatePersonalInformationPayload = 
    | IUpdatePersonalInformationReq 
    | IUpdateInternshipHandlerPersonalInfoReq 
    | IUpdateCompanyRepresentativePersonalInfoReq;

const updatePersonalInformation = async (req: UpdatePersonalInformationPayload, role: string) => {
    let endpoint: string;
    
    if (role === 'InternshipHandler') {
        endpoint = API.Endpoints.Users.PersonalInformationInternshipHandler();
    } else if (role === 'CompanyRepresentative') {
        endpoint = API.Endpoints.Users.PersonalInformationCompanyRepresentative();
    } else {
        endpoint = API.Endpoints.Users.PersonalInformation();
    }
    
    await authHttpClient.put(endpoint, {
        json: req
    });
};

export const useUpdatePersonalInformation = () => {
    const queryClient = useQueryClient();
    const role = useAuthStore((state) => state.role);

    return useMutation({
        mutationFn: (req: UpdatePersonalInformationPayload) => updatePersonalInformation(req, role),
        onSuccess: () => {
            const { userId } = useAuthStore.getState();
            if (userId) {
                void queryClient.invalidateQueries({ queryKey: personalInformationQueryKey(userId) });
            }
        }
    });
};
