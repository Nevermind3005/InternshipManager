import type { IStudentRegisterReq } from "@/models/user/student/IStudentRegisterReq";
import { useMutation } from "@tanstack/react-query";
import { httpClient } from "../http";
import { API } from "../api";
import type {IUserRes} from "@/models/user/IUserRes.ts";

export const useRegisterStudent = () => {
    return useMutation({
        mutationFn: async (req: IStudentRegisterReq) => {
            return await httpClient.post(
                API.Endpoints.Auth.RegisterStudent(), 
                { 
                    json: req 
                }).json<IUserRes>();
        }
    });
};