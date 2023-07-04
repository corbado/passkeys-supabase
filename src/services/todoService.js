import jwt from "jsonwebtoken";
import { createClient } from "@supabase/supabase-js";

const getSupabaseClient = (userID) => {
  const payload = {
    userID,
    sub: userID,
    exp: Math.floor(Date.now() / 1000) + 60 * 60,
  };
  const token = jwt.sign(payload, process.env.SUPABASE_JWT_SECRET);

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_API_KEY,
    {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    }
  );
  return supabase;
};

export const findByUserID = async (userID) => {
  const { data, error } = await getSupabaseClient(userID)
    .from("todos2")
    .select();

  //   .eq("user_id", userID);
  if (error) {
    console.log("Error from todo");
    console.log(error.message);
    return [];
  } else {
    console.log("Ready");
    console.log(data);
    return data;
  }
};
