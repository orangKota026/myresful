import { AuthAdapter } from "../types/auth";

export const AdapterAuth: AuthAdapter = {
    isAuthenticated: () => '',
    logout: () =>
    {
        console.warn('[myresful] logout not implemented');
    }
}