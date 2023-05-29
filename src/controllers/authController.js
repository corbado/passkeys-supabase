const UserService = require("../services/userService");
const jwt = require("jsonwebtoken");
const Corbado = require("corbado");
const { createClient } = require("@supabase/supabase-js");
const corbado = new Corbado(process.env.PROJECT_ID, process.env.API_SECRET);

exports.home = function (req, res) {
  console.log("Home called");
  res.redirect("/login");
};

exports.login = function (req, res) {
  console.log("Login called");
  res.render("pages/login");
};

exports.profile = async function (req, res) {
  const token = req.cookies.jwt;

  let userId;
  await jwt.verify(token, process.env.JWT_SECRET_KEY, function (err, decoded) {
    if (err) {
      // Handle invalid token error
      console.error(err);
      return res.redirect("/logout");
    } else {
      userId = decoded.userId;
    }
  });

  UserService.findById(userId).then((user) => {
    if (!user) {
      res.redirect("/logout");
    } else {
      res.render("pages/profile", {
        username: user.email,
        userFullName: user.name,
      });
    }
  });
};

exports.logout = function (req, res) {
  res.clearCookie("jwt", { path: "/" });
  res.redirect("/");
};

exports.authRedirect = async function (req, res) {
  console.log("Auth redirect called");
  const sessionToken = req.query.corbadoSessionToken;
  const clientInfo = corbado.utils.getClientInfo(req);

  console.log("Session token: " + sessionToken);
  console.log("Client info: " + clientInfo);

  corbado.sessionService
    .verify(sessionToken, clientInfo)
    .then((response) => {
      console.log("Response: " + response);
      const userData = JSON.parse(response.data.userData);

      const { username, userFullName } = userData;

      console.log("User data:");
      console.log(userData);

      console.log("Supabase url: " + process.env.SUPABASE_URL);
      console.log("Supabase key: " + process.env.SUPABASE_ROLE_KEY);
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

      supabase
        .rpc("get_user_id_by_email", {
          email: username,
        })
        .then(({ data, error }) => {
          if (error) {
            console.log("Error from get_user_id_by_email:");
            console.log(error.message);
            res.status(500).send("Server Error - " + error.message);
          } else {
            console.log("Succes from get_user_id_by_email:");
            console.log(data);
            if (data.length != 1) {
              console.log("Data length is not 1");
              res.status(500).send("Server Error - " + error.message);
            } else {
              const sub = data[0].id;
              console.log("Creating new client with user id: " + sub);
              const payload = {
                sub,
                sub: sub,
                exp: Math.floor(Date.now() / 1000) + 60 * 60,
              };
              const token = jwt.sign(payload, process.env.SUPABASE_JWT_SECRET);

              console.log("JWT SECRET: " + process.env.SUPABASE_JWT_SECRET);
              const options = {};
              options.global = {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              };

              console.log(
                "Creating new client with supabase url: " +
                  process.env.SUPABASE_URL +
                  " and supabase key: " +
                  process.env.SUPABASE_KEY
              );

              const supabase2 = createClient(
                process.env.SUPABASE_URL,
                process.env.SUPABASE_KEY,
                options
              );
              supabase2
                .from("todos")
                .select()
                .then(({ data: todos, error }) => {
                  if (error) {
                    console.log("Error from todo");
                    console.log(error.message);
                    res.status(500).send("Server Error - " + error.message);
                  } else {
                    console.log("Ready");
                    console.log(data);
                    console.log(todos);
                    res.status(200).send("Todo Success! data: " + data);
                  }
                })
                .catch((err) => {
                  console.log("Major error from select todo: " + err);
                  res.status(500).send("Server Error - " + err);
                });
            }
          }
        })
        .catch((err) => {
          console.log("Major error from get_user_id_by_email: " + err);
          res.status(500).send("Server Error - " + err);
        });

      /*
      supabase.auth.admin
        .createUser({
          email: username,
          name: userFullName,
          password: "passwordPE43#s",
          email_confirm: true,
        })
        .then(({ data, error }) => {
          console.log("Sign up response:");

          if (error) {
            console.log(error.message);
            res.status(500).send("Server Error - " + error.message);
          } else if (data.user?.identities?.length === 0) {
            console.log("User already registered");
            res.status(200).send("User already registered");
          } else {
            console.log("Success! Please check your inbox.");
            console.log(data);
            res
              .status(200)
              .send("Success! Please check your inbox. data: " + data);
          }
        })
        .catch((err) => {
          console.error(err);
          res.status(500).send("Server Error");
        });
        */

      //    const { error } = await supabase.auth.signIn({ email });
      //    const { data: profile } = await supabase
      //        .from("profiles")
      //        .select("id, username, avatar_url, website");

      /*
      UserService.findByEmail(username)
        .then((user) => {
          if (!user) {
            UserService.create(userFullName, username)
              .then((user) => {
                const token = jwt.sign(
                  { userId: user.id },
                  process.env.JWT_SECRET_KEY,
                  { expiresIn: process.env.JWT_EXPIRATION_TIME }
                );

                res.cookie("jwt", token, { httpOnly: true, maxAge: 3600000 });

                res.redirect("/profile");
              })
              .catch((err) => {
                console.error(err);
                res.status(500).send("Server Error");
              });
          } else {
            const token = jwt.sign(
              { userId: user.id },
              process.env.JWT_SECRET_KEY,
              { expiresIn: process.env.JWT_EXPIRATION_TIME }
            );

            res.cookie("jwt", token, { httpOnly: true, maxAge: 3600000 });

            res.redirect("/profile");
          }
        })
        .catch((err) => {
          console.error(err);
          res.status(500).send("Server Error");
        });
    })
    */
    })
    .catch((err) => {
      console.log("ERROR MAJOR");
      console.error(err);
      res.status(500).send("Server Error");
    });
};
