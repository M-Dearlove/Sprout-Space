import express from 'express';
import Garden from '../models/garden.js';

const router = express.Router();

// Middleware to parse JSON bodies
router.use(express.json());
// Middleware to parse URL-encoded bodies
router.use(express.urlencoded({ extended: true }));
// Route to get all gardens
router.get('/', async (_req, res) => {
  try {
    const gardens = await Garden.find();
    res.json(gardens);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
}
);
// Route to create a new garden
router.post('/', async (req, res) => {
  const garden = new Garden({
    name: req.body.name,
    plants: req.body.plants,
  });

  try {
    const newGarden = await garden.save();
    res.status(201).json(newGarden);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
}
);
// Route to get a specific garden by ID
router.get('/:id', async (req, res) => {
  try {
    const garden = await Garden.findById(req.params.id);
    if (!garden) {
      return res.status(404).json({ message: 'Garden not found' });
    }
    return res.json(garden);
  } catch (error) {
    return res.status(500).json({ message: (error as Error).message });
  }
});
// Route to update a specific garden by ID
router.put('/:id', async (req, res) => {
    try {  
        const garden = await Garden.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (!garden) return res.status(404).json({ message: 'Garden not found' });
        return res.json(garden);
        }
    catch (error) {
        return res.status(500).json({ message: (error as Error).message });
        }
    }
);
// Route to saved garden
router.post('/save', async (req, res) => {
    const { name, plants } = req.body;
    const garden = new Garden({
        name,
        plants,
    });
    try {
        const savedGarden = await garden.save();
        res.status(201).json(savedGarden);
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
}
);
// Route to delete a specific garden by ID
router.delete('/:id', async (req, res) => { 
    try {
        const garden = await Garden.findByIdAndDelete(req.params.id);
        if (!garden) return res.status(404).json({ message: 'Garden not found' });
        return res.json({ message: 'Garden deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
});
// Export the router
export default router;

