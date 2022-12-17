export interface Person {
    id?: string;
    type: string;
    first_name: string;
    last_name: string;
    email: string;
    street_address: string;
    city: string;
    state_abbreviation: string;
    zip_code: number;
    pass_hash?: string;
    is_active: boolean;
    createdAt: string;
    updatedAt: string;
    credentials?: [];
}
