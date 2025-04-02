import { User } from '../models/index.js';
import { signToken, AuthenticationError } from '../utils/auth.js';

// Define types for the arguments
interface RegisterUserArgs {
    email: string;
    password: string;
}

interface LoginUserArgs {
  email: string;
  password: string;
}

interface ResetPasswordArgs {
  email: string;
  newPassword: string;
}

// Define GraphQL Context interface
interface GraphQLContext {
  user?: {
    _id: string;
    email: string;
  };
}

const resolvers = {
  Query: {
    // Get authenticated user information
    me: async (_parent: any, _args: any, context: GraphQLContext) => {
      if (context.user) {
        return User.findById(context.user._id);
      }
      throw new AuthenticationError('Could not authenticate user.');
    },
  },

  Mutation: {
    // Register a new user
    register: async (_parent: any, { email, password }: RegisterUserArgs) => {
      const existingUser = await User.findOne({ email });
      console.log('Existing User:', existingUser)
      if (existingUser) {
        throw new Error('User already exists.');
      }

      const user = await User.create({ email, password });
      console.log('User created', user)
      const token = signToken( user.email, user._id);
      console.log('token', token)

      return { token, user };
    },

    // Login an existing user
    login: async (_parent: any, { email, password }: LoginUserArgs) => {
      const user = await User.findOne({ email });

      if (!user || !(await user.isCorrectPassword(password))) {
        throw new AuthenticationError('Invalid credentials.');
      }

      const token = signToken(user.email, user._id);
      return { token, user };
    },

    resetPassword: async (_parent: any, { email, newPassword }: ResetPasswordArgs) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new Error("User not found.");
      }

      user.password = newPassword;
      await user.save();

      return true;
    },
   
  },
};


export default resolvers;
