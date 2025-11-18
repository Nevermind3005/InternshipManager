import { useMutation, useQueryClient } from "@tanstack/react-query";
import { httpClient } from "../http";
import { API } from "../api";
import type { IInternshipRes } from "@/models/internship/IInternshipRes";

const approveInternship = async ({ id, token }: { id: string, token: string }): Promise<IInternshipRes> => {
    return await httpClient
        .post(API.Endpoints.Internship.Approve(id, token))
        .json<IInternshipRes>();
};

export const useApproveInternship = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: approveInternship,
        onSuccess: (data) => {
            // Invalidate the view query
            void queryClient.invalidateQueries({ queryKey: ["internship-view", data.id] });
            // Invalidate all internship list queries (they have queryKey: ["internships", params])
            void queryClient.invalidateQueries({ predicate: (query) => query.queryKey[0] === "internships" });
        }
    });
};

