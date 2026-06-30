import jwt from "jsonwebtoken"
import type { Request, Response, NextFunction } from "express"
type AuthUser = {
  id: string
  role: "user" | "admin" | "manager"
}
export const routeAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.accessToken




  if (!token) {
    return res.status(401).json({ message: "No token" })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string)
    req.user = decoded as AuthUser
    next()
  } catch {
    return res.status(401).json({ message: "Invalid token" })
  }
}