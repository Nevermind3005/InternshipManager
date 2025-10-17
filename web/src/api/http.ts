import ky from "ky";
import { BASE_URL } from "./api";

const createKyInstance = () => {
    const customKy = ky.extend({
        prefixUrl: BASE_URL,
    });
    return customKy;
};

export const httpClient = createKyInstance();