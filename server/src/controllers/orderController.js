import mongoose from 'mongoose';
import { Order } from '../models/Order.js';

let memoryOrders = [];

export const createOrder = async (req, res) => {
  try {
    const { items, totalAmount, shippingAddress, paymentMethod } = req.body;

    if (!items || items.length === 0 || !totalAmount || !shippingAddress) {
      return res.status(400).json({ message: 'Missing order items, total amount, or shipping address' });
    }

    const orderData = {
      user: req.user._id,
      items,
      totalAmount: Number(totalAmount),
      shippingAddress,
      paymentMethod: paymentMethod || 'COD',
      status: 'Placed'
    };

    if (mongoose.connection.readyState === 1) {
      const order = await Order.create(orderData);
      return res.status(201).json({ message: 'Order placed successfully', order });
    }

    // In-memory fallback for demo mode
    const order = {
      _id: `ord_${Date.now()}`,
      ...orderData,
      createdAt: new Date().toISOString()
    };
    memoryOrders.unshift(order);
    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (error) {
    res.status(500).json({ message: 'Error placing order', error: error.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
      return res.json(orders);
    }
    const userOrders = memoryOrders.filter(
      (o) => String(o.user) === String(req.user._id) || req.user._id === 'demo_user'
    );
    res.json(userOrders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders' });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const orders = await Order.find().populate('user', 'name email mobile').sort({ createdAt: -1 });
      return res.json(orders);
    }
    res.json(memoryOrders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching all orders' });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (mongoose.connection.readyState === 1) {
      const order = await Order.findById(req.params.id);
      if (order) {
        order.status = status || order.status;
        await order.save();
        return res.json({ message: 'Order status updated', order });
      }
    }

    const order = memoryOrders.find((o) => o._id === req.params.id);
    if (order) {
      order.status = status || order.status;
      return res.json({ message: 'Order status updated', order });
    }

    res.json({ message: 'Order status updated' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating order status' });
  }
};
