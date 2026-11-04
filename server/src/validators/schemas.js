import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  mobile: z.string().optional(),
  interests: z.array(z.string()).optional()
});

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required')
});

export const orderCreateSchema = z.object({
  items: z.array(z.object({
    productId: z.string(),
    name: z.string(),
    price: z.number().positive(),
    qty: z.number().int().positive(),
    image: z.string(),
    size: z.string().optional()
  })).min(1, 'Cart cannot be empty'),
  address: z.object({
    fullName: z.string().min(2),
    street: z.string().min(3),
    city: z.string().min(2),
    state: z.string().min(2),
    pincode: z.string().min(4),
    phone: z.string().min(8)
  }),
  paymentMethod: z.enum(['stripe', 'mock_card', 'upi', 'cod']).default('stripe'),
  couponCode: z.string().optional()
});

export const bookingCreateSchema = z.object({
  type: z.enum(['adventure', 'stay']),
  refId: z.string(),
  title: z.string(),
  location: z.string(),
  image: z.string().optional(),
  dates: z.object({
    start: z.string(),
    end: z.string()
  }),
  guests: z.object({
    adults: z.number().min(1),
    children: z.number().min(0).default(0)
  }),
  roomType: z.string().optional(),
  amount: z.number().positive()
});

export const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().min(3),
  message: z.string().min(10)
});

export const reviewSchema = z.object({
  targetType: z.enum(['adventure', 'stay', 'product']),
  targetId: z.string(),
  rating: z.number().min(1).max(5),
  text: z.string().min(5),
  photos: z.array(z.string()).optional()
});
