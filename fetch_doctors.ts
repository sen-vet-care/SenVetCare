import { supabase } from './src/services/supabase';

async function fetchDoctors() {
  const { data, error } = await supabase.from('doctors').select('*');
  if (error) console.error(error);
  else console.log(JSON.stringify(data, null, 2));
}

fetchDoctors();
