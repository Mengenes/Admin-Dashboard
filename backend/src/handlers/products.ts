import type { Request,Response } from "express";
import { pool } from "../config/pg.js";

export const createProduct = async (req:Request, res:Response) => {
const name = req.body.name.trim()
const price = Number(req.body.price)
const stock = Number(req.body.stock)


if (
    name.trim() === "" ||
    price < 0 ||
    stock < 0
){

return res.status(400).json({message:"Please provide required fields"})

  }



  try {
    const result = await pool.query(
      `
      INSERT INTO products (name,  price, stock)
      VALUES ($1,$2,$3)
      RETURNING *
      `,
      [name,price, stock]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Server error" });
  }
};

export const getProducts = async (req:Request, res:Response) => {
  try {
    const result = await pool.query(`
      SELECT id,
name,
price,
stock,
created_at FROM products
      ORDER BY created_at ASC
    `);

    res.json(result.rows);
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Server error" });
  }
};
export const getProductById = async  (req:Request, res:Response) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT * FROM products
      WHERE id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Server error" });
  }
};
export const updateProduct = async (req:Request, res:Response) => {
  const { id } = req.params;
  const { name,price, stock } = req.body;

if(!name || !price || !stock)
{

return res.status(400).json({message:"Please provide requred fields"})

}


  try {
    const result = await pool.query(
      `
      UPDATE products
      SET name = $1,
          price = $2,
          stock = $3
      WHERE id = $4
      RETURNING *
      `,
      [name,  price, stock, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Server error" });
  }
};
export const deleteProduct = async  (req:Request, res:Response) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
      DELETE FROM products
      WHERE id = $1
      RETURNING id,
name,
price,
stock,
created_at
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.json({
      message: "Product deleted"
    });
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Server error" });
  }
};