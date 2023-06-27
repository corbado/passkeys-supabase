import db from "../../models/index.js";
import bcrypt from "bcryptjs";

const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

exports.create = async (username, userFullName, corbadoUserID) => {
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

exports.findByEmail = async (email) => {
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

exports.findById = async (id) => {
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
