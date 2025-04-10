//..client/src/util/plantData.ts
import pumpkin from '../assets/images/pumpkin.png';
import carrot from '../assets/images/carrot.png';
import cucumber from '../assets/images/cucumber.png';
import tomato from '../assets/images/tomato.png';
import zucchini from '../assets/images/zucchini.png';
import basil from '../assets/images/basil.png';
import lettuce from '../assets/images/lettuce.png';
import sunflower from '../assets/images/sunflower.png';     
import pepper from '../assets/images/pepper.png';
import broccoli from '../assets/images/broccoli.png';
import cauliflower from '../assets/images/cauliflower.png';
import onion from '../assets/images/onion.png';
import garlic from '../assets/images/garlic.png';
import potato from '../assets/images/potatoes.png';
import sweetPotato from '../assets/images/sweet-potato.png';
import peas from '../assets/images/peas.png';
import asparagus from '../assets/images/asparagus.png';
import beet from '../assets/images/beet.png';
import bellPepper from '../assets/images/bell-pepper.png';
import celery from '../assets/images/celery.png';
import cabbage from '../assets/images/cabbage.png';
import eggplant from '../assets/images/eggplant.png';
import kale from '../assets/images/kale.png';
import spinach from '../assets/images/spinach.png';
import strawberry from '../assets/images/strawberry.png';
import blueberry from '../assets/images/blueberry.png';
import raspberry from '../assets/images/raspberry.png';
import watermelon from '../assets/images/watermelon.png';
import cantaloupe from '../assets/images/cantaloupe.png';
import radish from '../assets/images/radish.png';
import beans from '../assets/images/red-beans.png';
import okra from '../assets/images/okra.png';
import brussels from '../assets/images/brussels-sprouts.png';
import artichoke from '../assets/images/artichoke.png';
import turnip from '../assets/images/turnip.png';
import squash from '../assets/images/squash.png';
import mint from '../assets/images/mint.png';
import rosemary from '../assets/images/rosemary.png';
import thyme from '../assets/images/thyme.png';
import tomatoCherry from '../assets/images/cherry-tomato.png';
import corn from '../assets/images/corn.png';

export interface Plant {
    id: string;
    name: string;
    color: string;
    width: number;
    height: number;
    spacing: number;
    sunlight: string;
    water: string;
    plantsPerSquareFoot: number;
    image: string;
  }

  interface PlotSize {
    id: string;
    name: string;
    rows: number;
    cols: number;
  }
  

// Removed unused PerenualPlant interface
  
  export const plotSizes: PlotSize[] = [
    { id: 'small', name: 'Small (6 x 6)', rows: 6, cols: 6 },
    { id: 'medium', name: 'Medium (10 x 10)', rows: 10, cols: 10 },
    { id: 'large', name: 'Large (12 x 12)', rows: 12, cols: 12 },
    { id: 'xl', name: 'Extra Large (15 x 15)', rows: 15, cols: 15 },
    { id: 'custom1', name: 'Rectangular (8 x 12)', rows: 8, cols: 12 },
    { id: 'custom2', name: 'Rectangular (12 x 8)', rows: 12, cols: 8 },
  ];
  
  const defaultPlantTypes: Plant[] = [
    {
      id: 'tomato',
      name: 'Tomato',
      color: '#e77c7c',
      width: 1,
      height: 1,
      spacing: 18,
      sunlight: 'Full sun',
      water: 'Regular',
      plantsPerSquareFoot: 0.25,
      image: tomato,
    },
    {
      id: 'carrot',
      name: 'Carrot',
      color: '#e9a978',
      width: 1,
      height: 1,
      spacing: 3,
      sunlight: 'Full sun',
      water: 'Moderate',
      plantsPerSquareFoot: 16,
      image: carrot,
    },
    {
      id: 'lettuce',
      name: 'Lettuce',
      color: '#8dd8b9',
      width: 1,
      height: 1,
      spacing: 6,
      sunlight: 'Partial shade',
      water: 'Regular',
      plantsPerSquareFoot: 4,
      image: lettuce,
    },
    {
      id: 'cucumber',
      name: 'Cucumber',
      color: '#78c2a4',
      width: 1,
      height: 1,
      spacing: 12,
      sunlight: 'Full sun',
      water: 'Regular',
      plantsPerSquareFoot: 1,
      image: cucumber,
    },
    {
      id: 'zucchini',
      name: 'Zucchini',
      color: '#7fb3da',
      width: 2,
      height: 2,
      spacing: 18,
      sunlight: 'Full sun',
      water: 'Regular',
      plantsPerSquareFoot: 0.25,
      image: zucchini,
    },
    {
      id: 'sunflower',
      name: 'Sunflower',
      color: '#ecd279',
      width: 1,
      height: 1,
      spacing: 12,
      sunlight: 'Full sun',
      water: 'Moderate',
      plantsPerSquareFoot: 1,
      image: sunflower,
    },
    {
      id: 'basil',
      name: 'Basil',
      color: '#97c283',
      width: 1,
      height: 1,
      spacing: 4,
      sunlight: 'Partial shade',
      water: 'Moderate',
      plantsPerSquareFoot: 9,
      image: basil,
    },
    {
      id: 'pepper',
      name: 'Pepper',
      color: '#e28b89',
      width: 1,
      height: 1,
      spacing: 12,
      sunlight: 'Full sun',
      water: 'Moderate',
      plantsPerSquareFoot: 1,
      image: pepper,
    },
    {
      id: 'broccoli',
      name: 'Broccoli',
      color: '#89bb9e',
      width: 1,
      height: 1,
      spacing: 18,
      sunlight: 'Full sun',
      water: 'Regular',
      plantsPerSquareFoot: 0.25,
      image: broccoli,
    },
    {
      id: 'cauliflower',
      name: 'Cauliflower',
      color: '#e0e0e0',
      width: 1,
      height: 1,
      spacing: 18,
      sunlight: 'Full sun',
      water: 'Regular',
      plantsPerSquareFoot: 0.25,
      image: cauliflower,
    },
    {
      id: 'onion',
      name: 'Onion',
      color: '#b8c4d0',
      width: 1,
      height: 1,
      spacing: 4,
      sunlight: 'Full sun',
      water: 'Moderate',
      plantsPerSquareFoot: 9,
      image: onion,
    },
    {
      id: 'garlic',
      name: 'Garlic',
      color: '#d5d8dd',
      width: 1,
      height: 1,
      spacing: 4,
      sunlight: 'Full sun',
      water: 'Low',
      plantsPerSquareFoot: 9,
      image: garlic,
    },
    {
      id: 'potato',
      name: 'Potato',
      color: '#c4b396',
      width: 1,
      height: 1,
      spacing: 12,
      sunlight: 'Full sun',
      water: 'Moderate',
      plantsPerSquareFoot: 1,
      image: potato,
    },
    {
      id: 'sweetPotato',
      name: 'Sweet Potato',
      color: '#d49c82',
      width: 1,
      height: 1,
      spacing: 12,
      sunlight: 'Full sun',
      water: 'Moderate',
      plantsPerSquareFoot: 1,
      image: sweetPotato,
    },
    {
      id: 'pumpkin',
      name: 'Pumpkin',
      color: '#e2a173',
      width: 3,
      height: 3,
      spacing: 36,
      sunlight: 'Full sun',
      water: 'Regular',
      plantsPerSquareFoot: 0.25,
      image: pumpkin,
    },
    {
      id: 'corn',
      name: 'Corn',
      color: '#e6d7a1',
      width: 1,
      height: 1,
      spacing: 12,
      sunlight: 'Full sun',
      water: 'Regular',
      plantsPerSquareFoot: 1,
      image: corn,
    },
    {
      id: 'asparagus',
      name: 'Asparagus',
      color: '#8dbd8a',
      width: 1,
      height: 1,
      spacing: 12,
      sunlight: 'Full sun',
      water: 'Moderate',
      plantsPerSquareFoot: 1,
      image: asparagus,
    },
    {
      id: 'beet',
      name: 'Beet',
      color: '#8a284c',
      width: 1,
      height: 1,
      spacing: 4,
      sunlight: 'Full sun',
      water: 'Moderate',
      plantsPerSquareFoot: 9,
      image: beet,
    },
    {
      id: 'bellPepper',
      name: 'Bell Pepper',
      color: '#c82333',
      width: 1,
      height: 1,
      spacing: 12,
      sunlight: 'Full sun',
      water: 'Moderate',
      plantsPerSquareFoot: 1,
      image: bellPepper,
    },
    {
      id: 'celery',
      name: 'Celery',
      color: '#a5cd9f',
      width: 1,
      height: 1,
      spacing: 6,
      sunlight: 'Partial shade',
      water: 'Regular',
      plantsPerSquareFoot: 4,
      image: celery,
    },
    {
      id: 'cabbage',
      name: 'Cabbage',
      color: '#adcfa8',
      width: 1,
      height: 1,
      spacing: 12,
      sunlight: 'Full sun',
      water: 'Regular',
      plantsPerSquareFoot: 1,
      image: cabbage,
    },
    {
      id: 'eggplant',
      name: 'Eggplant',
      color: '#614051',
      width: 1,
      height: 1,
      spacing: 18,
      sunlight: 'Full sun',
      water: 'Regular',
      plantsPerSquareFoot: 0.25,
      image: eggplant,
    },
    {
      id: 'kale',
      name: 'Kale',
      color: '#3a5f0b',
      width: 1,
      height: 1,
      spacing: 12,
      sunlight: 'Full sun',
      water: 'Regular',
      plantsPerSquareFoot: 1,
      image: kale,
    },
    {
      id: 'spinach',
      name: 'Spinach',
      color: '#304d3a',
      width: 1,
      height: 1,
      spacing: 3,
      sunlight: 'Partial shade',
      water: 'Regular',
      plantsPerSquareFoot: 16,
      image: spinach,
    },
    {
      id: 'strawberry',
      name: 'Strawberry',
      color: '#e63946',
      width: 1,
      height: 1,
      spacing: 6,
      sunlight: 'Full sun',
      water: 'Regular',
      plantsPerSquareFoot: 4,
      image: strawberry,
    },
    {
      id: 'blueberry',
      name: 'Blueberry',
      color: '#457b9d',
      width: 1,
      height: 1,
      spacing: 18,
      sunlight: 'Full sun',
      water: 'Regular',
      plantsPerSquareFoot: 0.25,
      image: blueberry,
    },
    {
      id: 'raspberry',
      name: 'Raspberry',
      color: '#d00000',
      width: 1,
      height: 1,
      spacing: 18,
      sunlight: 'Full sun',
      water: 'Regular',
      plantsPerSquareFoot: 0.25,
      image: raspberry,
    },
    {
      id: 'watermelon',
      name: 'Watermelon',
      color: '#6a994e',
      width: 2,
      height: 2,
      spacing: 36,
      sunlight: 'Full sun',
      water: 'Regular',
      plantsPerSquareFoot: 0.25,
      image: watermelon,
    },
    {
      id: 'cantaloupe',
      name: 'Cantaloupe',
      color: '#dda15e',
      width: 2,
      height: 2,
      spacing: 36,
      sunlight: 'Full sun',
      water: 'Regular',
      plantsPerSquareFoot: 0.25,
      image: cantaloupe,
    },
    {
      id: 'radish',
      name: 'Radish',
      color: '#e5383b',
      width: 1,
      height: 1,
      spacing: 3,
      sunlight: 'Full sun',
      water: 'Regular',
      plantsPerSquareFoot: 16,
      image: radish,
    },
    {
      id: 'peas',
      name: 'Peas',
      color: '#90be6d',
      width: 1,
      height: 1,
      spacing: 4,
      sunlight: 'Full sun',
      water: 'Moderate',
      plantsPerSquareFoot: 9,
      image: peas,
    },
    {
      id: 'beans',
      name: 'Beans',
      color: '#43aa8b',
      width: 1,
      height: 1,
      spacing: 4,
      sunlight: 'Full sun',
      water: 'Moderate',
      plantsPerSquareFoot: 9,
      image: beans,
    },
    {
      id: 'okra',
      name: 'Okra',
      color: '#588157',
      width: 1,
      height: 1,
      spacing: 12,
      sunlight: 'Full sun',
      water: 'Regular',
      plantsPerSquareFoot: 1,
      image: okra,
    },
    {
      id: 'brussels',
      name: 'Brussels Sprouts',
      color: '#a7c957',
      width: 1,
      height: 1,
      spacing: 18,
      sunlight: 'Full sun',
      water: 'Regular',
      plantsPerSquareFoot: 0.25,
      image: brussels,
    },
    {
      id: 'artichoke',
      name: 'Artichoke',
      color: '#606c38',
      width: 2,
      height: 2,
      spacing: 36,
      sunlight: 'Full sun',
      water: 'Regular',
      plantsPerSquareFoot: 0.25,
      image: artichoke,
    },
    {
      id: 'turnip',
      name: 'Turnip',
      color: '#ccd5ae',
      width: 1,
      height: 1,
      spacing: 4,
      sunlight: 'Full sun',
      water: 'Regular',
      plantsPerSquareFoot: 9,
      image: turnip,
    },
    {
      id: 'squash',
      name: 'Squash',
      color: '#ffc300',
      width: 2,
      height: 2,
      spacing: 24,
      sunlight: 'Full sun',
      water: 'Regular',
      plantsPerSquareFoot: 0.25,
      image: squash,
    },
    {
      id: 'mint',
      name: 'Mint',
      color: '#2a9d8f',
      width: 1,
      height: 1,
      spacing: 4,
      sunlight: 'Partial shade',
      water: 'Regular',
      plantsPerSquareFoot: 9,
      image: mint,
    },
    {
      id: 'rosemary',
      name: 'Rosemary',
      color: '#386641',
      width: 1,
      height: 1,
      spacing: 12,
      sunlight: 'Full sun',
      water: 'Low',
      plantsPerSquareFoot: 1,
      image: rosemary,
    },
    {
      id: 'thyme',
      name: 'Thyme',
      color: '#606c38',
      width: 1,
      height: 1,
      spacing: 6,
      sunlight: 'Full sun',
      water: 'Low',
      plantsPerSquareFoot: 4,
      image: thyme,
    },
    {
      id: 'tomato-cherry',
      name: 'Cherry Tomato',
      color: '#e63946',
      width: 1,
      height: 1,
      spacing: 12,
      sunlight: 'Full sun',
      water: 'Regular',
      plantsPerSquareFoot: 1,
      image: tomatoCherry,
    },
  ];
  
  export default defaultPlantTypes;