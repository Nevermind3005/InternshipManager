import { useMutation } from "@tanstack/react-query";
import { httpClient } from "../http";
import { API } from "../api";
import type { IUserLoginReq } from "@/models/auth/IUserLoginReq";
import type { ILoginRes } from "@/models/auth/ILoginRes";
import { useAuthStore } from "@/store/useAuthStore";
import type { IJwtPayload } from "@/models/auth/IJwtPayload";
import { jwtDecode } from "jwt-decode";

const login = async (req: IUserLoginReq) => {
    const data = await httpClient.post(API.Endpoints.Auth.Login(), {
        json: req
    }).json<ILoginRes>();

    const { setAccessToken, setRefreshToken, setRole } = useAuthStore.getState();

    const jwtPayload = jwtDecode<IJwtPayload>(data.accessToken);

    setAccessToken(data.accessToken);
    setRefreshToken(data.refreshToken);
    setRole(jwtPayload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]);

    return { redirector: data.redirector };
};

export const useLoginUser = () => {
    return useMutation({
        mutationFn: login
    });
};