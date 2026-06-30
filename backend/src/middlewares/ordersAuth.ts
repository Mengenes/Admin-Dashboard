import type { Request, Response, NextFunction } from "express"

export const ordersAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return res.status(401).json({
      message: "Not authenticated",
    })
  }

  if (
    req.user.role !== "admin" &&
    req.user.role !== "manager"
  ) {
    return res.status(403).json({
      message: "Only Managers and Admins can access",
    })
  }

  next()
}