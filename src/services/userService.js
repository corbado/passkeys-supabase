import { createClient } from "@supabase/supabase-js";

import { config as dotenvConfig } from "dotenv";
dotenvConfig();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseRoleKey = process.env.SUPABASE_API_KEY_SERVICE_ROLE;

const supabase = createClient(supabaseUrl, supabaseRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export const create = async (username, userFullName) => {
  const { data, error } = await supabase.auth.admin.createUser({
    email: username,
    user_metadata: { name: userFullName, isCorbadoUser: true },
    email_confirm: true,
  });
  if (error) {
    console.log("Error from create user: ", error.message);
    return null;
  }
  console.log(data);
  return data;
};

export const findByEmail = async (email) => {
  var { data, error } = await supabase.rpc("get_user_id_by_email", {
    email: email,
  });
  if (error) {
    console.log("Error from get_user_id_by_email: ", error.message);
    return null;
  }
  console.log(data);
  if (data.length == 0) {
    // No user found
    return null;
  }
  const id = data[0].id;
  var { data, error } = await supabase.auth.admin.getUserById(id);
  if (error) {
    console.log("Error from getUserById: ", error.message);
    return null;
  }
  console.log(data);
  if (data.user == null) {
    // No user found
    return null;
  }
  return data.user;
};

export const verifyPassword = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });
  if (error) {
    console.log("Error from verifyPassword: ", error.message);
    return null;
  }
  console.log(data);
  return data;
};
