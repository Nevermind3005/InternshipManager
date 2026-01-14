import { useQuery } from "@tanstack/react-query";
import { authHttpClient } from "../http";
import { API } from "../api";
import type { IInternshipDocumentsStatus } from "@/models/internship/IInternshipDocument";

export const useGetInternshipDocuments = (internshipId: string) => {
    return useQuery({
        queryKey: ['internship-documents', internshipId],
        queryFn: async () => {
            const response = await authHttpClient.get(API.Endpoints.Internship.GetDocuments(internshipId));
            return response.json<IInternshipDocumentsStatus>();
        },
        enabled: !!internshipId
    });
};
