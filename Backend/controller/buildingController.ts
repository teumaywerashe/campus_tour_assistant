import { Request, Response } from 'express';
import { getBuildingById, addBuilding, updateBuilding, deleteBuilding } from '../models/Building';
import { cloudinary } from '../middlewares/upload';
import supabase from '../db/connector';

export const getBuildings = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search, category } = req.query;

    let query = supabase.from('buildings').select('*');

    if (search) query = query.ilike('name', `%${search}%`);
    if (category) query = query.eq('category', category as string);

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
    const building = await getBuildingById(req.params.id as string);
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
      // multer-storage-cloudinary attaches the secure URL to req.file.path
      buildingData.images = (req.file as Express.Multer.File & { path: string }).path;
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
      // Delete old image from Cloudinary if it exists
      const existing = await getBuildingById(id);
      const oldUrl = existing?.[0]?.images as string | undefined;
      if (oldUrl) {
        const publicId = extractPublicId(oldUrl);
        if (publicId) await cloudinary.uploader.destroy(publicId);
      }
      buildingData.images = (req.file as Express.Multer.File & { path: string }).path;
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

    // Delete image from Cloudinary before removing the record
    const existing = await getBuildingById(id);
    const imageUrl = existing?.[0]?.images as string | undefined;
    if (imageUrl) {
      const publicId = extractPublicId(imageUrl);
      if (publicId) await cloudinary.uploader.destroy(publicId);
    }

    const deletedBuilding = await deleteBuilding(id);
    res.json({ success: true, message: 'Building deleted', deletedBuilding });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to delete building' });
  }
};

/** Extract Cloudinary public_id from a secure URL */
function extractPublicId(url: string): string | null {
  try {
    // e.g. https://res.cloudinary.com/<cloud>/image/upload/v123/campus-buildings/abc.jpg
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-z]+$/i);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}
