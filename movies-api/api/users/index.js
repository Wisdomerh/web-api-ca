import express from 'express';
import User from './userModel';
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Input validation middleware
const validateUserInput = (req, res, next) => {
  if (!req.body.username || !req.body.password) {
    return res.status(400).json({ 
      success: false, 
      msg: 'Username and password are required.' 
    });
  }
  next();
};

// Get all users - Consider adding pagination for large datasets
router.get('/', asyncHandler(async (req, res) => {
  const users = await User.find().select('-password'); // Exclude password from response
  res.status(200).json(users);
}));

// Register/Create/Authenticate User
router.post('/', 
  validateUserInput,
  asyncHandler(async (req, res) => {
    try {
      if (req.query.action === 'register') {
        await registerUser(req, res);
      } else {
        await authenticateUser(req, res);
      }
    } catch (error) {
      console.error('User operation failed:', error);
      res.status(500).json({ 
        success: false, 
        msg: 'Internal server error.' 
      });
    }
  })
);

// Update a user
router.put('/:id', asyncHandler(async (req, res) => {
  if (req.body._id) delete req.body._id;
  if (req.body.password) delete req.body.password; // Prevent password updates through this route
  
  const result = await User.updateOne(
    { _id: req.params.id },
    { $set: req.body }, // Use $set operator for safe updates
    { runValidators: true } // Run mongoose validators
  );
  
  if (result.matchedCount) {
    res.status(200).json({ 
      success: true,
      msg: 'User Updated Successfully' 
    });
  } else {
    res.status(404).json({ 
      success: false,
      msg: 'User not found' 
    });
  }
}));

async function registerUser(req, res) {
  // Check if user already exists
  const existingUser = await User.findOne({ username: req.body.username });
  if (existingUser) {
    return res.status(409).json({ 
      success: false, 
      msg: 'Username already exists.' 
    });
  }

  const user = await User.create(req.body);
  res.status(201).json({ 
    success: true, 
    msg: 'User successfully created.',
    userId: user._id 
  });
}

async function authenticateUser(req, res) {
  const user = await User.findOne({ username: req.body.username });
  if (!user) {
    return res.status(401).json({ 
      success: false, 
      msg: 'Authentication failed. User not found.' 
    });
  }

  const isMatch = await user.comparePassword(req.body.password);
  if (isMatch) {
    const token = jwt.sign(
      { 
        userId: user._id,
        username: user.username 
      }, 
      process.env.SECRET,
      { expiresIn: '24h' }
    );
    
    res.status(200).json({ 
      success: true, 
      token: `Bearer ${token}` 
    });
  } else {
    res.status(401).json({ 
      success: false, 
      msg: 'Authentication failed. Wrong password.' 
    });
  }
}

export default router;