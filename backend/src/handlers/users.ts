import { pool } from "../config/pg.js";
import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import type { DbUser } from "./auth.js";

export default interface DBuser {

  email: string;
  username: string;
  role: "admin" | "user" |"manager";
}

export const usersHandler = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      "SELECT id,email,username,role,created_at FROM users"
    );

    const users: DBuser[] = result.rows;

    return res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};



export const updateUser = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { username, email, currentPassword, newPassword } = req.body;

  if (!req.user) return res.status(401).json({ message: "Unauthorized" })
  try {
    const userResult = await pool.query(
      "SELECT email,password FROM users WHERE id=$1",
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = userResult.rows[0] as DbUser;

    const isValid = await bcrypt.compare(currentPassword, user.password);

    if (!isValid) {
      return res.status(401).json({
        message: "Incorrect password",
      });
    }

    if (username) {
      if (username.length < 3 || username.length > 20) {
        return res.status(400).json({
          message: "Username must be between 3 and 20 characters",
        });
      }

      const existingUser = await pool.query(
        "SELECT id FROM users WHERE username=$1 AND id != $2",
        [username, userId]
      );

      if (existingUser.rows.length > 0) {
        return res.status(400).json({
          message: "Username already taken",
        });
      }

      await pool.query(
        "UPDATE users SET username=$1 WHERE id=$2",
        [username, userId]
      );
    }

    if (email) {
      const existingEmail = await pool.query(
        "SELECT id FROM users WHERE email=$1 AND id != $2",
        [email, userId]
      );

      if (existingEmail.rows.length > 0) {
        return res.status(400).json({
          message: "Email already in use",
        });
      }

      await pool.query("UPDATE users SET email=$1 WHERE id=$2", [
        email,
        userId,
      ]);
    }

    if (newPassword) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await pool.query("UPDATE users SET password=$1 WHERE id=$2", [
        hashedPassword,
        userId,
      ]);
    }

    return res.json({
      success: true,
      message: "Profile updated",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const deleteAccount = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { currentPassword } = req.body;
if (!req.user) return res.status(401)
  try {
    const userResult = await pool.query(
      "SELECT password FROM users WHERE id=$1",
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = userResult.rows[0] as DbUser;

    const valid = await bcrypt.compare(currentPassword, user.password);

    if (!valid) {
      return res.status(401).json({
        message: "Incorrect password",
      });
    }

    await pool.query("DELETE FROM users WHERE id=$1", [userId]);

    return res.json({
      success: true,
      message: "Account deleted",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const  updateUserRole= async (req:Request, res:Response) => {
  const { id } = req.params;
  const { role } = req.body;
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  try {
    const result=await pool.query(

'UPDATE users SET role =$1 WHERE id=$2',
[role,id])

if(result.rowCount === 0){

return res.status(404).json({message:"User not found"})

}
return res.json({ message: "User Role Changed" });
  } catch (error) {
        console.error(error);
    res.status(500).json({ message: "Server error" });
  }





}
export const deleteUserId = async (req: Request, res: Response) => {
  const { id } = req.params;
if (!req.user) {
  return res.status(401).json({ message: "Unauthorized" })
}
  try {
    const result = await pool.query(
      'DELETE FROM users WHERE id = $1',
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ message: "User deleted" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};