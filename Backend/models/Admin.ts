import supabase from '../db/connector';
import bcrypt from 'bcrypt';

interface AdminInput {
  username: string;
  email: string;
  password: string;
}

export const createAdmin = async ({ username, email, password }: AdminInput) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const { data, error } = await supabase
    .from('admins')
    .insert([{ username, email, password: hashedPassword }])
    .select();

  if (error) throw error;
  return data;
};

export const getAdminByEmail = async (email: string) => {
  const { data, error } = await supabase
    .from('admins')
    .select('*')
    .eq('email', email)
    .single();

  // PGRST116 = no rows found — that's a valid "not found", not a real error
  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error; // surface real errors (RLS, wrong table, network, etc.)
  }
  return data;
};

export const verifyPassword = async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};
