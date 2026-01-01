import { useMutation } from "@tanstack/react-query";
import { authHttpClient } from "../http";
import { API } from "../api";
import type { ILoginRes } from "@/models/auth/ILoginRes";
import { useAuthStore } from "@/store/useAuthStore";
import type { IChangeDefaultPasswordReq } from "@/models/auth/IChangeDefaultPasswordReq";
import type { IJwtPayload } from "@/models/auth/IJwtPayload";
import { jwtDecode } from "jwt-decode";

const changeDefaultPassword = async (req: IChangeDefaultPasswordReq) => {
    const data = await authHttpClient.post(API.Endpoints.Auth.ChangeDefaultPassword(), {
        json: req
    }).json<ILoginRes>();

    const { setAccessToken, setRefreshToken, setRole, setUserId } = useAuthStore.getState();

    const jwtPayload = jwtDecode<IJwtPayload>(data.accessToken);

    setAccessToken(data.accessToken);
    setRefreshToken(data.refreshToken);
    setRole(jwtPayload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]);
    setUserId(jwtPayload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]);

    return { redirector: data.redirector };
};

export const useChanageDefaultPassword = () => {
    return useMutation({
        mutationFn: changeDefaultPassword
    });
};