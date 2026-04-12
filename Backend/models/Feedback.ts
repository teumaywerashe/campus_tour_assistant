import supabase from '../db/connector';

interface FeedbackInput {
  email?: string;
  subject?: string;
  comment: string;
}

export const addFeedback = async ({ email, subject, comment }: FeedbackInput) => {
  const { data, error } = await supabase
    .from('feedback')
    .insert([{ email, subject, comment }])
    .select();

  if (error) throw error;
  return data;
};

export const getAllFeedback = async () => {
  const { data, error } = await supabase
    .from('feedback')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const getFeedbackById = async (id: string | number) => {
  const { data, error } = await supabase
    .from('feedback')
    .select('*')
    .eq('id', id);

  if (error) return null;
  return data;
};

export const deleteFeedback = async (id: string | number) => {
  const { data, error } = await supabase
    .from('feedback')
    .delete()
    .eq('id', id)
    .select();

  if (error) throw error;
  return data;
};
