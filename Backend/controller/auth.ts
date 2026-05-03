import 'dotenv/config';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { getAdminByEmail, verifyPassword, createAdmin } from '../models/Admin';

export const loginAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    console.log(email,password)
    const admin = await getAdminByEmail(email);
    console.log(admin)
    if (!admin) {
      console.log("first")
      res.status(404).json({ success: false, message: 'Admin not found' });
      return;
    }

    const validPassword = await verifyPassword(password, admin.password);
    if (!validPassword) {
      res.status(401).json({ success: false, message: 'Incorrect password' });
      return;
    }

    const token = jwt.sign(
      { admin_id: admin.admin_id, username: admin.username },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );

    res.json({
      success: true,
      token,
      admin: { admin_id: admin.admin_id, username: admin.username, email: admin.email },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const registerAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      res.status(400).json({ success: false, message: 'Username, email, and password are required' });
      return;
    }

    const existingUser = await getAdminByEmail(email);
    if (existingUser) {
      res.status(409).json({ success: false, message: 'User already taken' });
      return;
    }

    const newAdmin = await createAdmin({ username, email, password });
    const token = jwt.sign(
      { admin_id: (newAdmin as any)[0].admin_id, username: (newAdmin as any)[0].username },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );

    const { password: _, ...adminData } = (newAdmin as any)[0];
    res.status(201).json({ success: true, message: 'Admin registered successfully', token, admin: adminData });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};
