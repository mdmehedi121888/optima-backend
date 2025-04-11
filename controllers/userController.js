const User = require("../models/user");

const getUsers = async (req, res) => {
  try {
    const users = await User.getAll();
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const createUser = async (req, res) => {
  try {
    await User.create(req.body);
    res.json({ success: true, message: "User added successfully" });
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateUser = async (req, res) => {
  try {
    const result = await User.update(req.params.id, req.body);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found or inactive" });
    }
    res.json({ success: true, message: "User updated successfully" });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const result = await User.delete(req.params.id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found or inactive" });
    }
    res.json({ success: true, message: "User Deleted Successfully" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { getUsers, createUser, updateUser, deleteUser };
