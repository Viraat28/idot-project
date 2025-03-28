const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const { getUserRole } = require("../controllers/user.controller.js");
const User = db.user;
const Role = db.role;

// verifyToken = (req, res, next) => {
//   let token = req.session.token;
//   //console.log("Token sent:",token);
//   if (!token) {
//     return res.status(403).send({ message: "No token provided!" });
//   }

//   jwt.verify(token, config.secret, (err, decoded) => {
//     if (err) {
//       return res.status(401).send({ message: "Unauthorized!" });
//     }
//     req.userId = decoded.id;
//     next();
//   });
// };
verifyToken = (req, res, next) => {
  // Extract the token from the Authorization header
  const authHeader = req.headers.authorization;
  console.log("Received Authorization Header:", authHeader);
  if (!authHeader) {
    return res.status(403).send({ message: "No token provided!" });
  }

  const token = authHeader.split(' ')[1]; // Assuming the header is "Bearer token"
  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    req.userId = decoded.id;
    next();
  });
};

//new one added
// getUserRole = async (req, res) => {
//   try {
//     const user = await User.findById(req.userId).populate("roles", "-__v");
//     if (!user) {
//       return res.status(404).send({ message: "User not found." });
//     }

//     const roles = user.roles.map(role => role.name); // Extract roles
//     return res.status(200).json({ roles }); // Send roles in response
//   } catch (err) {
//     return res.status(500).send({ message: "Error fetching user role." });
//   }
// };

isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).exec();
    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    const roles = await Role.find({
      _id: { $in: user.roles },
    });

    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "admin") {
        next();
        return;
      }
    }

    res.status(403).send({ message: "Require Admin Role!" });
  } catch (err) {
    res.status(500).send({ message: err });
  }
};

isGeneralUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).exec();
    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    const roles = await Role.find({
      _id: { $in: user.roles },
    });

    for (let i = 0; i < roles.length; i++) {
      if (["admin","user"].indexOf(roles[i].name) !== -1) {
        next();
        return;
      }
    }

    res.status(403).send({ message: "Require User Role!" });
  } catch (err) {
    res.status(500).send({ message: err });
  }
};


const authJwt = {
  verifyToken,
  isAdmin,
  isGeneralUser,
  // getUserRole,
};
module.exports = authJwt;
