export interface User {
    id: number;
    role_id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    delete_flg: number;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
};
