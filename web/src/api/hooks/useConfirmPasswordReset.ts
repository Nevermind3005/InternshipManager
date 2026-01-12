import { useMutation } from "@tanstack/react-query";
import { httpClient } from "../http";
import { API } from "../api";

export interface IConfirmPasswordResetReq {
    token: string;
    newPassword: string;
}

interface IConfirmPasswordResetRes {
    message: string;
}

const confirmPasswordReset = async (req: IConfirmPasswordResetReq) => {
    const data = await httpClient.post(API.Endpoints.Auth.ConfirmPasswordReset(), {
        json: req
    }).json<IConfirmPasswordResetRes>();
    
    return data;
};

export const useConfirmPasswordReset = () => {
    return useMutation({
        mutationFn: confirmPasswordReset
    });
};
