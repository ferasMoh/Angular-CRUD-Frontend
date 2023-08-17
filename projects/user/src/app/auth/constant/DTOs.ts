export interface CreateAccount {
    username:string;
    password:string;
    email:string;
    role:string;
}

export interface Login {
    email:string;
    password:string;
    role:string;
}