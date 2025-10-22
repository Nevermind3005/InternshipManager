import ky, { HTTPError } from "ky";
import { API, BASE_URL } from "./api";
import { useAuthStore } from "@/store/useAuthStore";
import { jwtDecode } from "jwt-decode";
import type { IJwtPayload } from "@/models/auth/IJwtPayload";
import router from "@/lib/router";

const createKyInstance = () => {
    const customKy = ky.extend({
        prefixUrl: BASE_URL,
    });
    return customKy;
};

/**
 * Creates an instance of ky http client setup to do authentication with server and token refresh.
 */
const createAuthKyInstance = () => {
    const customKy = ky.extend({
        prefixUrl: BASE_URL,
        hooks: {
            beforeRequest: [
                async (request) => {
                    const { accessToken } = useAuthStore.getState();
                    if (accessToken) {
                        request.headers.set("Authorization", `Bearer ${accessToken}`);
                    }
                }
            ],
            beforeRetry: [
                async ({ error, retryCount }) => {
                    if (
                        error instanceof HTTPError &&
                        error.response.status === 401 &&
                        retryCount === 1
                    ) {
                        const { refreshToken, accessToken, setAccessToken, setRefreshToken, clearStore } = useAuthStore.getState();
                        const { setRole } = useAuthStore.getState();


                        if (!refreshToken) {
                            clearStore();

                            router.navigate({ to: '/login' });

                            throw error;
                        }

                        try {
                            const response = await ky.post(`${BASE_URL}/${API.Endpoints.Auth.RefreshToken()}`, {
                                json: { refreshToken, accessToken }
                            }).json<{ accessToken: string, refreshToken: string }>();

                            const jwtPayload = jwtDecode<IJwtPayload>(accessToken);

                            setAccessToken(response.accessToken);
                            setRefreshToken(response.refreshToken);
                            setRole(jwtPayload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]);

                        } catch (refreshError) {
                            clearStore();

                            router.navigate({ to: '/login' });

                            throw refreshError;
                        }
                    }
                }
            ]
        },
        retry: {
            statusCodes: [401],
        }
    });
    return customKy;
};

/**
 * Instance of ky http client with authentication setup
 */
export const authHttpClient = createAuthKyInstance();

export const httpClient = createKyInstance();