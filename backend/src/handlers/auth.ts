import type { CookieOptions, Request, Response } from "express";
import { pool } from "../config/pg.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Resend } from "resend";
import crypto from "crypto"
export interface DbUser {
  id: string;
  email: string;
  username: string;
  password: string;
  role: "user" | "admin" | "manager";
}

const isProd = process.env.NODE_ENV === "production";



export const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProd, // only HTTPS in prod
  sameSite: isProd ? "none" : "lax", 
  path: "/",
};

const tokenSecret = process.env.JWT_SECRET as string;

export const generateAccessToken = (id: string, role: string) => {
  return jwt.sign({ id, role }, tokenSecret, { expiresIn: "30m" });
};

export const generateRefreshToken = (id: string, role: string) => {
  return jwt.sign({ id, role }, tokenSecret, { expiresIn: "30d" });
};

export const createUser = async (req: Request, res: Response) => {
  const {password } = req.body;
const username = req.body.username.trim()
const email = req.body.email.trim()



  if (!email || !username || !password) {
    return res.status(400).json({ message: "Please Provide Required fields" });
  }

  if (password.length < 6 || password.length > 20) {
    return res.status(400).json({ message: "Invalid password" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  try {
    const emailExists = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (emailExists.rows.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const role = "user";

    const newUser = await pool.query(
      `INSERT INTO users (email, username, password, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email, username, role`,
      [email, username, hashedPassword, role]
    );

    const user = newUser.rows[0];

    const accessToken = generateAccessToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id, user.role);

    res.cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 30 * 60 * 1000,
    });
res.cookie("refreshToken", refreshToken, {
  ...cookieOptions,
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
});

    return res.status(201).json({ user });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
export const loginUser = async (req: Request, res: Response) => {
const { email, password } = req.body;

if (!email || !password) {
  return res.status(400).json({ message: "Please Provide Required fields" });




}
try{

const userResult = await pool.query("SELECT id,email,username,role,password FROM users WHERE email = $1", [email]);


if (userResult.rows.length === 0) {
  return res.status(400).json({ message: "Invalid email or password" });}


const user= userResult.rows[0] as DbUser ;

const ismatched = await bcrypt.compare(password, user.password);

if (!ismatched) {
  return res.status(400).json({ message: "Invalid email or password" });}

  const accessToken = generateAccessToken(user.id, user.role);
  const refreshToken = generateRefreshToken(user.id, user.role);

  res.cookie("accessToken", accessToken, {
    ...cookieOptions,
    maxAge:60  * 60 * 1000,
  });// 1 hour expiration

  res.cookie("refreshToken", refreshToken,{...cookieOptions, maxAge: 30 * 24 * 60 * 60 * 1000});// Set refresh token with 30 days expiration
return res.status(200).json({message:"Login successful",user:{id:user.id,username:user.username,role:user.role}});
}catch(error){
  console.error("Error logging in user:", error);
  return res.status(500).json({ message: "Internal Server Error" });}

}

export const tokenUser = async (req: Request, res: Response) => {

 const token = req.cookies?.refreshToken;
if (!token) {
    return res.status(401).json({ message: "No refresh token" });
  }

  try {
    const decoded = jwt.verify(token, tokenSecret) as { id: string; role: string };

    const userResult = await pool.query("SELECT username,role FROM users WHERE id=$1", [decoded.id]);

   if (userResult.rows.length === 0) {
  return res.status(401).json({ message: "User not found" });
}
   
   
    const user = userResult.rows[0];

    const newAccessToken = jwt.sign({ id: decoded.id, role:user.role }, tokenSecret, {
      expiresIn: "30m",
    });

    res.cookie("accessToken", newAccessToken, {
      ...cookieOptions,
      maxAge: 60 * 60 * 1000,
    });

    return res.json({
  message: "Token refreshed",
  user: {
    username: user.username,
    role: user.role,
  },
});
  } catch (err) {
    return res.status(401).json({ message: "Invalid refresh token" });
  }



};


export const logoutUser = (req: Request, res: Response) => {
  try {
      res.clearCookie("refreshToken", cookieOptions);
  res.clearCookie("accessToken", cookieOptions);
  return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log(error,"Clearing Cookie Failed")
  }
  
  

};
const resendApi=process.env.RESEND_API_KEY as string
const resend = new Resend(resendApi);

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Please enter your email" });
  }

  const userResult = await pool.query("SELECT id FROM users WHERE email=$1", [email]);

  if (userResult.rows.length === 0) {
    return res.status(200).json({
      message: "If an account with that email exists, we've sent a password reset link.",
    });
  }

  const user = userResult.rows[0];

  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
  const expire = new Date(Date.now() + 15 * 60 * 1000);

  await pool.query(
    `INSERT INTO password_resets (user_id, token, expires_at)
     VALUES ($1, $2, $3)
     ON CONFLICT (user_id)
     DO UPDATE SET token = EXCLUDED.token, expires_at = EXCLUDED.expires_at, updated_at = NOW()`,
    [user.id, hashedToken, expire]
  );

  const clientUrl = process.env.CLIENT_URL;
  const resetLink = `${clientUrl}/reset-password/${rawToken}`;

  await resend.emails.send({
    from: "Orders Admin Dashboard App <onboarding@resend.dev>",
    to: email,
    subject: "Reset Your Password Link - Valid for 15 minutes",
    html: `
      <h2>Password Reset</h2>
      <p>Click the link below to reset your password:</p>
      <a href="${resetLink}">Reset Password</a>
      <p>This link expires in 15 minutes.</p>
    `,
  });

  return res.status(200).json({
    message: "If an account with that email exists, we've sent a password reset link.",
  });
};

export const resetPassword = async (req: Request, res: Response) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ message: "Password required" });
  }

  if (!token || Array.isArray(token)) {
    return res.status(400).json({ message: "Invalid token" });
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const result = await pool.query(
    `SELECT user_id FROM password_resets WHERE token = $1 AND expires_at > NOW()`,
    [hashedToken]
  );

  if (result.rows.length === 0) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  const userId = result.rows[0].user_id;
  const hashedPassword = await bcrypt.hash(password, 10);

  await pool.query("UPDATE users SET password = $1 WHERE id = $2", [hashedPassword, userId]);
  await pool.query("DELETE FROM password_resets WHERE user_id = $1", [userId]);

  return res.json({ message: "Password reset successful" });
};
export const userProfileHandler = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const result = await pool.query(
      "SELECT email,username,role FROM users WHERE id=$1",
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};