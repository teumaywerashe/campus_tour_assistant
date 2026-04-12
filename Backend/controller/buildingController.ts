import { Request, Response } from 'express';
import { getBuildingById, addBuilding, updateBuilding, deleteBuilding } from '../models/Building';
import supabase from '../db/connector';
import path from 'path';
import fs from 'fs';

export const getBuildings = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search, category } = req.query;

    let query = supabase.from('buildings').select('*');

    if (search) {
      query = query.ilike('name', `%${search}%`);
    }
    if (category) {
      query = query.eq('category', category as string);
    }

    const { data, error } = await query.order('name', { ascending: true });
    if (error) throw error;

    res.json({ success: true, buildings: data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch buildings' });
  }
};

export const getBuilding = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const building = await getBuildingById(id);

    if (!building) {
      res.status(404).json({ success: false, message: 'Building not found' });
      return;
    }

    res.json({ success: true, building });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch building' });
  }
};

export const createBuilding = async (req: Request, res: Response): Promise<void> => {
  try {
    const buildingData = { ...req.body };
    if (req.file) {
      buildingData.images = req.file.filename;
    }

    const newBuilding = await addBuilding(buildingData);
    res.status(201).json({ success: true, newBuilding });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to create building' });
  }
};

export const editBuilding = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const buildingData = { ...req.body };
    if (req.file) {
      buildingData.images = req.file.filename;
    }

    const updatedBuilding = await updateBuilding(id, buildingData);
    res.json({ success: true, updatedBuilding });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to update building' });
  }
};

export const removeBuilding = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const deletedBuilding = await deleteBuilding(id);

    if (deletedBuilding && (deletedBuilding as any)[0]?.image) {
      const filePath = path.join(__dirname, '../uploads/buildings', (deletedBuilding as any)[0].image);
      fs.unlink(filePath, (err) => {
        if (err) console.error('Failed to delete image file:', err);
      });
    }

    res.json({ success: true, message: 'Building deleted', deletedBuilding });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to delete building' });
  }
};
