// Define types for the arguments
export interface RegisterUserArgs {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
}

export interface LoginUserArgs {
  email: string;
  password: string;
}

export interface ResetPasswordArgs {
  email: string;
  newPassword: string;
}

export interface SetUserRoleArgs {
  userId: string;
  role: string;
}


// Define GraphQL Context interface
export interface GraphQLContext {
  user?: {
    _id: string;
    email: string;
  };
}