import { createClient } from "@supabase/supabase-js";

import { config as dotenvConfig } from "dotenv";
dotenvConfig();

const supabaeUrl = process.env.SUPABASE_URL;
const supabaseRoleKey = process.env.SUPABASE_ROLE_KEY;

const supabase = createClient(supabaeUrl, supabaseRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export const create = async (username, userFullName, corbadoUserID) => {
  console.log("Creating new user with email: ", username);
  const { data, error } = await supabase.auth.admin.createUser({
    email: username,
    user_metadata: { name: userFullName, corbadoId: corbadoUserID },
    email_confirm: true,
  });
  if (error) {
    console.log("Error from create user:");
    console.log(error.message);
    return null;
  } else {
    console.log("Succes from create user:");
    console.log(data);
    return data;
  }
};

export const findByEmail = async (email) => {
  const { data, error } = await supabase.rpc("get_user_id_by_email", {
    email: email,
  });
  if (error) {
    console.log("Error from get_user_id_by_email:");
    console.log(error.message);
    return null;
  } else {
    console.log("Succes from get_user_id_by_email:");
    console.log(data);
    if (data.length == 0) {
      // No user found
      return null;
    } else {
      const sub = data[0];
      return sub;
    }
  }
};

export const findById = async (id) => {
  console.log("Getting user by id: ", id);
  const { data, error } = await supabase.auth.admin.getUserById(id);
  if (error) {
    console.log("Error from getUserById:");
    console.log(error.message);
    return null;
  } else {
    console.log("Succes from getUserById:");
    console.log(data);
    if (data.user == null) {
      // No user found
      return null;
    } else {
      return data.user;
    }
  }
};
