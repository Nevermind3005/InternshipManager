import { useMutation } from "@tanstack/react-query";
import { httpClient } from "../http";
import { API } from "../api";

export interface IForgotPasswordReq {
    email: string;
}

interface IForgotPasswordRes {
    message: string;
}

const forgotPassword = async (req: IForgotPasswordReq) => {
    const data = await httpClient.post(API.Endpoints.Auth.ForgotPassword(), {
        json: req
    }).json<IForgotPasswordRes>();
    
    return data;
};

export const useForgotPassword = () => {
    return useMutation({
        mutationFn: forgotPassword
    });
};
