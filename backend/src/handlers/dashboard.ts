import type  DBuser  from "./users";
import type { Request,Response } from "express";
import { pool } from "../config/pg";


export const getTotalCountDatas = async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(`
  SELECT
    (SELECT COUNT(*) FROM users) AS "totalUsers",
    (SELECT COUNT(*) FROM products) AS "totalProducts",
    (SELECT COUNT(*) FROM orders) AS "totalOrders",
    (SELECT COALESCE(SUM(total), 0) FROM orders) AS "totalRevenue",

    (
      SELECT COUNT(*)
      FROM users
      WHERE created_at >= NOW() - INTERVAL '7 days'
    ) AS "this_week_users",

    (
      SELECT COUNT(*)
      FROM users
      WHERE created_at >= NOW() - INTERVAL '14 days'
      AND created_at < NOW() - INTERVAL '7 days'
    ) AS "last_week_users",

    (
  SELECT COALESCE(SUM(total), 0)
  FROM orders
  WHERE created_at >= NOW() - INTERVAL '7 days'
) AS "this_week_revenue",

(
  SELECT COALESCE(SUM(total), 0)
  FROM orders
  WHERE created_at >= NOW() - INTERVAL '14 days'
  AND created_at < NOW() - INTERVAL '7 days'
) AS "last_week_revenue"
    `)
const stats = result.rows[0];

const thisWeek = Number(stats.this_week_users ?? 0);
const lastWeek = Number(stats.last_week_users ?? 0);

const diff = thisWeek - lastWeek;

let userGrowth;

if (lastWeek === 0) {
  userGrowth = {
    percent: thisWeek > 0 ? 100 : 0,
    diff,
    trend: thisWeek > 0 ? "up" : "flat",
    label: thisWeek > 0 ? `${thisWeek} new users this week` : "No users yet",
  };
} else {
  const percent = (diff / lastWeek) * 100;

  userGrowth = {
    percent: Math.round(percent * 10) / 10,
    diff,
    trend: percent >= 0 ? "up" : "down",
  };
}

stats.userGrowth = userGrowth;

  const thisRevenue = Number(stats.this_week_revenue ?? 0);
    const lastRevenue = Number(stats.last_week_revenue ?? 0);

    const revenueDiff = thisRevenue - lastRevenue;

    let revenueGrowth;

    if (lastRevenue === 0) {
      revenueGrowth = {
        percent: thisRevenue > 0 ? 100 : 0,
        diff: revenueDiff,
        trend: thisRevenue > 0 ? "up" : "flat",
      };
    } else {
      const percent = (revenueDiff / lastRevenue) * 100;

      revenueGrowth = {
        percent: Math.round(percent * 10) / 10,
        diff: revenueDiff,
        trend: percent >= 0 ? "up" : "down",
      };
    }

    stats.revenueGrowth = revenueGrowth;


    res.json(stats);

  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: "Failed to fetch dashboard stats",
    })
  }
}




export const getUserRolesTotal=async  (_req:Request, res:Response) => {
  try {
    const result = await pool.query(`
      SELECT role, COUNT(*)::int as count
      FROM users
      GROUP BY role
      ORDER BY count DESC
    `)

    res.json(result.rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server Error" })
  }
}


export const getTopCustomers = async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT
        u.username,
        COUNT(o.id)::int AS orders
      FROM users u
      JOIN orders o
        ON o.user_id = u.id
      GROUP BY u.id, u.username
      ORDER BY orders DESC
      LIMIT 4
    `)

    res.json(result.rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

export const getTopSellingProducts = async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT
        p.name,
        SUM(oi.quantity)::int AS sold
      FROM order_items oi
      JOIN products p
        ON p.id = oi.product_id
      GROUP BY p.id, p.name
      ORDER BY sold DESC
      LIMIT 4
    `)

    res.json(result.rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}