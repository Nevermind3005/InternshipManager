import { useMutation } from "@tanstack/react-query";
import { authHttpClient } from "../http";
import { API } from "../api";
import type { IChangePasswordReq } from "@/models/auth/IChangePasswordReq";

const changePassword = async (req: IChangePasswordReq) => {
    await authHttpClient.post(API.Endpoints.Users.ChangePassword(), {
        json: req
    });
};

export const useChangePassword = () => {
    return useMutation({
        mutationFn: changePassword
    });
};
