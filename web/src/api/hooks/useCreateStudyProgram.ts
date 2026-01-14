import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authHttpClient } from "../http";
import { API } from "../api";
import type { IStudyProgramRes } from "@/models/studyProgram/IStudyProgramRes";
import type { IStudyProgramReq } from "@/models/studyProgram/IStudyProgramReq";

export const useCreateStudyProgram = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["createStudyProgram"],
        retry: 1,
        mutationFn: async (req: IStudyProgramReq) => {
            return await authHttpClient.post(
                API.Endpoints.StudyProgram.Create(), 
                { 
                    json: req 
                }).json<IStudyProgramRes>();
        },
        onSuccess: (newStudyProgram) => {
            queryClient.setQueryData<IStudyProgramRes[]>(["studyPrograms"], (old = []) => [
                ...old,
                newStudyProgram,
            ]);
        }
    });
};
