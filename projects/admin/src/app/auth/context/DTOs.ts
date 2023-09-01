/* Interface for login Form */

export interface Login {
  email: 'string';
  password: 'string';
  role: 'string';
}


/* Interface for login Respnse */

export interface LoginResponse {
  token: 'string';
  userID: 'string';
}
