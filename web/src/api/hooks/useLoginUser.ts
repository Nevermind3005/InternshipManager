import { useMutation } from "@tanstack/react-query";
import { httpClient } from "../http";
import { API } from "../api";
import type { IUserLoginReq } from "@/models/auth/IUserLoginReq";
import type { ILoginRes } from "@/models/auth/ILoginRes";
import { useAuthStore } from "@/store/useAuthStore";

const login = async (req: IUserLoginReq) => {
    const data = await httpClient.post(API.Endpoints.Auth.Login(), {
        json: req
    }).json<ILoginRes>();

    const { setAccessToken, setRefreshToken } = useAuthStore.getState();

    setAccessToken(data.accessToken);
    setRefreshToken(data.refreshToken);

    return { redirector: data.redirector };
};

export const useLoginUser = () => {
    return useMutation({
        mutationFn: login
    });
};