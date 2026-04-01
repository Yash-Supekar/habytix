const User = require("../models/user.model");

// REGISTER
exports.register = async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;

    if (await User.existsByEmail(email)) {
      return res.status(400).json({ message: "Email already exists" });
    }

    if (!["TENANT", "MANAGER", "STAFF"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.create({ fullName, email, password, role });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findByEmail(email);
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    delete user.password;
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ROLES
exports.getStaff = async (req, res) => {
  res.json(await User.findByRole("STAFF"));
};

exports.getTenants = async (req, res) => {
  res.json(await User.findByRole("TENANT"));
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


