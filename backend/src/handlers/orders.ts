

export type OrderItemInput = {
  productId: number;
  quantity: number;

};





import { pool } from "../config/pg.js"
import type { Request,Response } from "express";
export const createOrder = async (
    req: Request,
    res: Response
) => {

const { userId, items } = req.body;

const client = await pool.connect();

try{

await client.query("BEGIN");

if(!userId || !Array.isArray(items)){

await client.query("ROLLBACK");

return res.status(400).json({
message:"Invalid order data"
});

}

let total=0;

for(const item of items){

const result = await client.query(

`
SELECT
id,
price,
stock,
name
FROM products
WHERE id=$1
FOR UPDATE
`,
[item.productId]

);

if(result.rows.length===0){

throw new Error("Product not found");

}

const product=result.rows[0];

if(product.stock<item.quantity){

throw new Error(
`${product.name} has only ${product.stock} left`
);

}

total+=Number(product.price)*item.quantity;

await client.query(

`
UPDATE products
SET stock=stock-$1
WHERE id=$2
`,
[item.quantity,item.productId]

);

}

const orderResult=await client.query(

`
INSERT INTO orders(user_id,total)

VALUES($1,$2)

RETURNING id
`,
[userId,total]

);

const orderId=orderResult.rows[0].id;

for(const item of items){

const result=await client.query(

`
SELECT price
FROM products
WHERE id=$1
`,
[item.productId]

);

await client.query(

`
INSERT INTO order_items
(order_id,product_id,quantity,price)

VALUES($1,$2,$3,$4)
`,
[
orderId,
item.productId,
item.quantity,
result.rows[0].price
]

);

}

await client.query("COMMIT");

res.status(201).json({

message:"Order created",

orderId,

total

});

}
catch(err){

await client.query("ROLLBACK");

console.log(err);

res.status(400).json({

message:
err instanceof Error
? err.message
: "Order failed"

});

}
finally{

client.release();

}

}

export const getOrders = async (req:Request, res:Response) => {
  try {
    const result = await pool.query(`
  SELECT
    o.id AS order_id,
    o.user_id,
    o.status,
    o.total,
    o.created_at,

    json_agg(
      json_build_object(
        'product', p.name,
        'quantity', oi.quantity,
        'price', oi.price
      )
    ) AS items

  FROM orders o
  JOIN order_items oi ON oi.order_id = o.id
  JOIN products p ON p.id = oi.product_id

  GROUP BY o.id, o.user_id, o.status, o.total, o.created_at
  ORDER BY o.created_at DESC
`)

    res.json(result.rows);
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Server error" });
  }
};

export const getOrderById = async (req:Request, res:Response) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT
        o.id AS order_id,
        o.status,
        o.total,

        json_agg(
          json_build_object(
            'product', p.name,
            'quantity', oi.quantity,
            'price', oi.price
          )
        ) AS items

      FROM orders o
      JOIN order_items oi ON oi.order_id = o.id
      JOIN products p ON p.id = oi.product_id

      WHERE o.id = $1
      GROUP BY o.id
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Server error" });
  }
};


export const updateOrderStatus = async  (req:Request, res:Response) => {
  const { id } = req.params;
  const { status } = req.body;

if(!status){

  return res.status(400).json({message:"Please provide required fields"})
}


  try {
    await pool.query(
      `UPDATE orders
       SET status = $1
       WHERE id = $2`,
      [status, id]
    );

    res.json({ message: "Order updated" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteOrder = async  (req:Request, res:Response) => {
  const { id } = req.params;

  try {
    await pool.query(`DELETE FROM order_items WHERE order_id = $1`, [id]);
    await pool.query(`DELETE FROM orders WHERE id = $1`, [id]);

    res.json({ message: "Order deleted" });
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Server error" });
  }
};