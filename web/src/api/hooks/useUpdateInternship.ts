import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authHttpClient } from "../http";
import { API } from "../api";
import type { IInternshipReq } from "@/models/internship/IInternshipReq";
import type { IInternshipRes } from "@/models/internship/IInternshipRes";

const updateInternship = async (id: string, req: IInternshipReq): Promise<IInternshipRes> => {
    return await authHttpClient
        .put(API.Endpoints.Internship.Update(id), {
            json: req
        })
        .json<IInternshipRes>();
};

export const useUpdateInternship = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: IInternshipReq }) => updateInternship(id, data),
        onSuccess: (_, variables) => {
            void queryClient.invalidateQueries({ queryKey: ["internship", variables.id] });
            void queryClient.invalidateQueries({ queryKey: ["internships"] });
        }
    });
};

