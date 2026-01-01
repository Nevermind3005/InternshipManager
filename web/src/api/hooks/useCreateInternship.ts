import { useMutation } from "@tanstack/react-query";
import { authHttpClient } from "../http";
import { API } from "../api";
import type { IInternshipReq } from "@/models/internship/IInternshipReq";
import type { IInternshipRes } from "@/models/internship/IInternshipRes";

export const useCreateInternship = () => {
    return useMutation({
        mutationFn: async (req: IInternshipReq) => {
            return await authHttpClient.post(
                API.Endpoints.Internship.Create(), 
                { 
                    json: req
                }).json<IInternshipRes>();
        }
    });
};