import rateLimit from "express-rate-limit";

export const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 min
  max: 3, 
  message: "Too many login attempts.Please try again later."
});
export const forgotLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 3,
  message: "Too many password reset requests.Please try again later."
});
export const resetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 5,
  message: "Too many reset attempts, try again later."
});

export const fetchLimitter = rateLimit({
  windowMs: 60 * 1000, // 1  min
max: 30,
  message: "Too many fetching attempts, try again later."
});


export const updateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 5,
  message: "Too many  update attempts,Please  try again later."
});