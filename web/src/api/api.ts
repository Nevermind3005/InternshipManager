export const BASE_URL = import.meta.env.VITE_API_BASE;

export const API = {
    Endpoints: {
        Auth: {
            Login: () => 'Auth/login',
            RegisterStudent: () => 'Auth/register/student',
            RefreshToken: () => 'Auth/refreshToken',
            ChangeDefaultPassword: () => 'Auth/changeDefaultPassword',
            CreateInternshipHandler: () => 'Auth/register/internshipHandler'
        },
        Internship: {
            Create: () => 'Internship',
            GetById: (id: string) => `Internship/${id}`
        }
    }
};