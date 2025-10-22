import { useMutation } from "@tanstack/react-query";
import { authHttpClient } from "../http";
import { API } from "../api";
import type { ILoginRes } from "@/models/auth/ILoginRes";
import { useAuthStore } from "@/store/useAuthStore";
import type { IChangeDefaultPasswordReq } from "@/models/auth/IChangeDefaultPasswordReq";

const changeDefaultPassword = async (req: IChangeDefaultPasswordReq) => {
    const data = await authHttpClient.post(API.Endpoints.Auth.ChangeDefaultPassword(), {
        json: req
    }).json<ILoginRes>();

    const { setAccessToken, setRefreshToken } = useAuthStore.getState();

    setAccessToken(data.accessToken);
    setRefreshToken(data.refreshToken);

    return { redirector: data.redirector };
};

export const useChanageDefaultPassword = () => {
    return useMutation({
        mutationFn: changeDefaultPassword
    });
};