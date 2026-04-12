import supabase from '../db/connector';

export interface BuildingData {
  name?: string;
  category?: string;
  description?: string;
  lat?: number | string;
  lng?: number | string;
  images?: string;
  nearestNode?: string;
  hours?: string;
  location?: string;
  tags?: string;
  floorinfo?: string | object;
  [key: string]: unknown;
}

export const getBuildingById = async (id: string | number) => {
  const { data, error } = await supabase
    .from('buildings')
    .select('*')
    .eq('id', id);

  if (error) return null;
  return data;
};

export const addBuilding = async (building: BuildingData) => {
  const { data, error } = await supabase
    .from('buildings')
    .insert([building])
    .select();

  if (error) throw error;
  return data;
};

export const updateBuilding = async (id: string | number, building: BuildingData) => {
  const { data, error } = await supabase
    .from('buildings')
    .update(building)
    .eq('id', id)
    .select();

  if (error) throw error;
  return data;
};

export const deleteBuilding = async (id: string | number) => {
  const { data, error } = await supabase
    .from('buildings')
    .delete()
    .eq('id', id)
    .select();

  if (error) throw error;
  return data;
};
