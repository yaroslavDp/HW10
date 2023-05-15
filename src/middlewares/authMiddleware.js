import User from "../models/user.model.js";

export const protect = async (req,res,next) => {
    const id = '646232ca798d14811fb3d854'; // The user's ID which operates now.
    const user = await User.findById(id);
  if (!user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  req.user = user
  next();
}