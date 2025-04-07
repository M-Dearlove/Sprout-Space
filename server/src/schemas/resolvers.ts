import { User } from '../models/index.js';
import GardenPlan from '../models/GardenPlan.js';
import PlantPlacement from '../models/PlantPlacement.js';
import { signToken, AuthenticationError } from '../utils/auth.js';
import { getPlantCareParagraph } from '../utils/openai.js';
import {
  RegisterUserArgs,
  LoginUserArgs,
  ResetPasswordArgs,
  GraphQLContext
 } from '../interfaces/user-interfaces.js'
 import {
  SaveGardenArgs,
} from '../interfaces/garden-interfaces.js'



const resolvers = {
  Query: {
    // Get authenticated user information
    me: async (_parent: any, _args: any, context: GraphQLContext) => {
      console.log("Resolver Context Object:", context);
      if (context && context.user) {
        return await User.findById(context.user._id);
      }
      throw new AuthenticationError('Could not authenticate user.');
    },

    // Get plant care paragraph
    getPlantCareInfo: async (_parent: any, args: { plantName: string }) => {
      return await getPlantCareParagraph(args.plantName);
    },
  },

  Mutation: {
    // Register a new user
    register: async (_parent: any, { firstname, lastname, email, password }: RegisterUserArgs) => {
      const existingUser = await User.findOne({ email });
      
      if (existingUser) {
        throw new Error('User already exists.');
      }

      const user = await User.create({ firstname, lastname, email, password });
      console.log('User created', user);
      const token = signToken(user.email, user._id);
      console.log('token', token);

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

    //garden planner resolvers
    saveGarden: async (_parent: any, { name, rows, cols, plants }: SaveGardenArgs, context: GraphQLContext) => {
      // Check if user is authenticated
      if (!context.user) {
        throw new Error('You must be logged in to save a garden');
      }
    
      const { user } = context;
    
      try {
        // Validate input
        if (rows <= 0 || cols <= 0) {
          throw new Error('Garden dimensions must be positive numbers');
        }
    
        if (!name || name.trim() === '') {
          throw new Error('Garden name cannot be empty');
        }
    
        const userId = user._id;
      
        // Check if this is an update or a new garden
        let garden = await GardenPlan.findOne({ name, userId });
      
        if (garden) {
          // Update existing garden
          garden.name = name;
          garden.rows = rows;
          garden.cols = cols;
          await garden.save();
        
          // Remove all existing plant placements for this garden
          await PlantPlacement.deleteMany({ gardenId: garden._id });
        } else {
          // Create new garden
          garden = await GardenPlan.create({
            name,
            rows,
            cols,
            userId
          });
        }
    
        // Add all plant placements
        if (plants && plants.length > 0) {
          await PlantPlacement.insertMany(
            plants.map(plant => ({
              ...plant,
              gardenId: garden._id
            }))
          );
        }
    
        return garden;
      } catch (error: any) {
        console.error('Error saving garden:', error);
        throw new Error(`Failed to save garden: ${error.message}`);
      }
    }
  }
};

export default resolvers;
