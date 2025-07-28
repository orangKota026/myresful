export interface AuthAdapter
{
    isAuthenticated: () => string | null;
    logout?: () => void;
}
