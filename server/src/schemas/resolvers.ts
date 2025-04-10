import { User } from '../models/index.js';
import GardenPlan from '../models/GardenPlan.js';
import Plant from '../models/Plant.js';
import PlantPlacement from '../models/PlantPlacement.js';
import { signToken, AuthenticationError } from '../utils/auth.js';
import { getPlantCareParagraph, getPlantPestInformation } from '../utils/openai.js';
import {
  RegisterUserArgs,
  LoginUserArgs,
  ResetPasswordArgs,
  GraphQLContext,
  SetUserRoleArgs
} from '../interfaces/user-interfaces.js'
import {
  SaveGardenArgs,
} from '../interfaces/garden-interfaces.js'

import { IResolvers } from '@graphql-tools/utils';

const resolvers: IResolvers = {
  User: {
    createdAt: (parent: any) => {
      return new Date(parent.createdAt).toISOString();
    },
  },
  Query: {
    // Get authenticated user information
    me: async (_parent: any, _args: any, context: GraphQLContext) => {
      if (context && context.user) {
        return await User.findById(context.user._id);
      }
      throw new AuthenticationError('Could not authenticate user.');
    },
    // Get all users (admin only)
    users: async (_parent: any, _args: any, context: GraphQLContext) => {
      if (!context.user) {
        throw new AuthenticationError('You must be logged in to view users');
      }
      
      const user = await User.findById(context.user._id);
      
      if (!user || user.role !== 'admin') {
        throw new AuthenticationError('You must be an admin to view all users');
      }
      
      return await User.find({});
    },
    userGardens: async (_, __, { user }) => {
      if (!user) throw new AuthenticationError("Not logged in");
      
      // Get all garden plans for this user
      const gardenPlans = await GardenPlan.find({ userId: user._id });
      
      // For each garden plan, fetch the plant placements
      const gardensWithPlants = await Promise.all(gardenPlans.map(async (garden) => {
        // Get all plant placements for this garden
        const plantPlacements = await PlantPlacement.find({ gardenId: garden._id });
        
        // Convert to the format expected by the frontend
        const plants = plantPlacements.map(placement => ({
          row: placement.row,
          col: placement.col,
          plantId: placement.plantId,
          plantName: placement.plantName,
          color: placement.color,
          image: placement.image
        }));
        
        return {
          id: garden._id,
          name: garden.name,
          rows: garden.rows,
          cols: garden.cols,
          plants
        };
      }));
      
      return gardensWithPlants;
    },
    garden: async (_parent: any, { id }: { id: string }, context: GraphQLContext) => {
      if (!context.user) {
        throw new AuthenticationError('You must be logged in to view a garden');
      }
      const garden = await GardenPlan.findById(id);
      if (!garden || garden.userId.toString() !== context.user._id.toString()) {
        throw new Error('Garden not found or access denied');
      }

      const plantPlacements = await PlantPlacement.find({ gardenId: garden._id });

      // Map plant placements using the stored values
      const enhancedPlants = plantPlacements.map(plant => {
        return {
          id: plant._id,
          plantId: plant.plantId,
          row: plant.row,
          col: plant.col,
          plantName: plant.plantName,
          color: plant.color,
          spacing: plant.spacing,
          plantsPerSquareFoot: plant.plantsPerSquareFoot,
          sunlight: plant.sunlight,
          water: plant.water,
          image: plant.image
        };
      });

      return {
        id: garden._id,
        name: garden.name,
        rows: garden.rows,
        cols: garden.cols,
        userId: garden.userId,
        plants: enhancedPlants,
      };
    },
    // Get plant care paragraph
    getPlantCareInfo: async (_parent: any, args: { plantName: string }) => {
      return await getPlantCareParagraph(args.plantName);
    },
    // New resolver for plant pest information using OpenAI
    getPlantPests: async (_parent: any, args: { plantName: string }) => {
      return await getPlantPestInformation(args.plantName);
    },

   // Plant queries
   plants: async () => {
     try {
       return await Plant.find({});
     } catch (error) {
       console.error('Error fetching plants:', error);
       throw new Error('Failed to fetch plants');
     }
   },

   plant: async (_parent: any, { _id }: { _id: string }) => {
     try {
       return await Plant.findById(_id);
     } catch (error) {
       console.error(`Error fetching plant with ID ${_id}:`, error);
       throw new Error('Failed to fetch plant');
     }
   },

   plantByName: async (_parent: any, { plantName }: { plantName: string }) => {
     try {
      // Case-insensitive search for plant by name
       return await Plant.findOne({ 
         plantName: { $regex: new RegExp('^' + plantName + '$', 'i') } 
       });
     } catch (error) {
       console.error(`Error fetching plant with name ${plantName}:`, error);
       throw new Error('Failed to fetch plant by name');
     }
   },

   searchPlantsByType: async (_parent: any, { plantType }: { plantType: string }) => {
     try {
       // Case-insensitive search for plants by type
       return await Plant.find({ 
         plantType: { $regex: new RegExp(plantType, 'i') } 
       });
     } catch (error) {
       console.error(`Error searching plants by type ${plantType}:`, error);
       throw new Error('Failed to search plants by type');
     }
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
        console.log('User created', user)
        const token = signToken(user.email, user._id);
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

      deleteUser: async (_parent: any, { userId }: { userId: string }, context: GraphQLContext) => {
        // Check if current user is admin
        if (!context.user) {
          throw new AuthenticationError('You must be logged in to perform this action');
        }
        
        const currentUser = await User.findById(context.user._id);
        if (!currentUser || currentUser.role !== 'admin') {
          throw new AuthenticationError('You must be an admin to delete users');
        }
        
        // Prevent admins from deleting themselves
        if (userId === context.user._id.toString()) {
          throw new Error('You cannot delete your own account');
        }
        
        // Delete the user
        const deletedUser = await User.findByIdAndDelete(userId);
        
        if (!deletedUser) {
          throw new Error('User not found');
        }
        
        // Optional: Delete associated data (gardens, plant placements, etc.)
        // This depends on your application's requirements
        await GardenPlan.deleteMany({ userId });
        const gardenIds = await GardenPlan.find({ userId }).distinct('_id');
        await PlantPlacement.deleteMany({ gardenId: { $in: gardenIds } });
        
        return deletedUser;
      },

      //update user
      updateUser: async (
        _parent: any, 
        { userId, userData }: { userId: string; userData: { firstname?: string; lastname?: string; email?: string; role?: string } }, 
        context: GraphQLContext
      ) => {
        // Check if current user is logged in
        if (!context.user) {
          throw new AuthenticationError('You must be logged in to perform this action');
        }
      
        // Check if current user is an admin
        const currentUser = await User.findById(context.user._id);
        if (!currentUser || currentUser.role !== 'admin') {
          throw new AuthenticationError('You must be an admin to update users');
        }
      
        // Find the user to update
        const userToUpdate = await User.findById(userId);
        if (!userToUpdate) {
          throw new Error('User not found');
        }
      
        // Validate email is unique
        if (userData.email && userData.email !== userToUpdate.email) {
          const existingUser = await User.findOne({ email: userData.email });
          if (existingUser) {
            throw new Error('A user with this email already exists');
          }
        }
      
      // Update the user
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: userData },
        { new: true, runValidators: true }
      );
      
      return updatedUser;
    },


      //rest password
      resetPassword: async (_parent: any, { email, newPassword }: ResetPasswordArgs) => {
        const user = await User.findOne({ email });

        if (!user) {
          throw new Error("User not found.");
        }

        user.password = newPassword;
        await user.save();

        return true;
      },

      //set user role - admin or user
      setUserRole: async (_parent: any, { userId, role }: SetUserRoleArgs, context: GraphQLContext) => {
        // Check if current user is admin
        if (!context.user) {
          throw new AuthenticationError('You must be logged in to perform this action');
        }
        
        const currentUser = await User.findById(context.user._id);
        if (!currentUser || currentUser.role !== 'admin') {
          throw new AuthenticationError('You must be an admin to set user roles');
        }
        
        // Update the user's role
        const updatedUser = await User.findByIdAndUpdate(
          userId,
          { role },
          { new: true }
        );
        
        if (!updatedUser) {
          throw new Error('User not found');
        }
        
        return updatedUser;
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
      },

      deleteGarden: async (_parent: any, { id }: { id: string }, context: GraphQLContext) => {
        // Check if user is authenticated
        if (!context.user) {
          throw new AuthenticationError('You must be logged in to delete a garden');
        }
      
        try {
          // Find the garden
          const garden = await GardenPlan.findById(id);
          
          // Check if garden exists and belongs to the user
          if (!garden) {
            throw new Error('Garden not found');
          }
          
          if (garden.userId.toString() !== context.user._id.toString()) {
            throw new AuthenticationError('You do not have permission to delete this garden');
          }
      
          // Delete all plant placements associated with this garden
          await PlantPlacement.deleteMany({ gardenId: id });
          
          // Delete the garden
          await GardenPlan.findByIdAndDelete(id);
          
          return { id };
        } catch (error: any) {
          console.error('Error deleting garden:', error);
          throw new Error(`Failed to delete garden: ${error.message}`);
        }
      }
    }
  };

  export default resolvers;