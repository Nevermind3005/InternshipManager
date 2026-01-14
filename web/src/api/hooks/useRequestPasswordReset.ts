import { useMutation } from "@tanstack/react-query";
import { httpClient } from "../http";
import { API } from "../api";

export interface IRequestPasswordResetReq {
    email: string;
}

interface IRequestPasswordResetRes {
    message: string;
}

const requestPasswordReset = async (req: IRequestPasswordResetReq) => {
    const data = await httpClient.post(API.Endpoints.Auth.RequestPasswordReset(), {
        json: req
    }).json<IRequestPasswordResetRes>();
    
    return data;
};

export const useRequestPasswordReset = () => {
    return useMutation({
        mutationFn: requestPasswordReset
    });
};
