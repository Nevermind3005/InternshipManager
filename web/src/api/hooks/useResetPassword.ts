import { useMutation } from "@tanstack/react-query";
import { httpClient } from "../http";
import { API } from "../api";

export interface IResetPasswordReq {
    token: string;
    newPassword: string;
}

interface IResetPasswordRes {
    message: string;
}

const resetPassword = async (req: IResetPasswordReq) => {
    const data = await httpClient.post(API.Endpoints.Auth.ResetPassword(), {
        json: req
    }).json<IResetPasswordRes>();
    
    return data;
};

export const useResetPassword = () => {
    return useMutation({
        mutationFn: resetPassword
    });
};
