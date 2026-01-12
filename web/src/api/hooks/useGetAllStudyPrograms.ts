import { authHttpClient } from "../http";
import { API } from "../api";
import { useQuery } from "@tanstack/react-query";
import type { IStudyProgramRes } from "@/models/studyProgram/IStudyProgramRes";

const getAllStudyPrograms = async (): Promise<IStudyProgramRes[]> => {
    const res = await authHttpClient
        .get(API.Endpoints.StudyProgram.GetAll())
        .json<IStudyProgramRes[]>();

    return res;
};

export const useGetAllStudyPrograms = () => {
    return useQuery({
        queryKey: ["studyPrograms"],
        queryFn: getAllStudyPrograms
    });
};
