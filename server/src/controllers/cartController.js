import { Cart } from '../models/Cart.js';
import { Product } from '../models/Product.js';

export const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ userId: req.user._id }).populate({
      path: 'items.productId',
      select: 'name slug price mrp stock images category brand isEssentialChecklist'
    });

    if (!cart) {
      cart = await Cart.create({ userId: req.user._id, items: [] });
    }

    // Filter out deleted products if any
    cart.items = cart.items.filter(item => item.productId != null);

    res.status(200).json({
      success: true,
      data: cart
    });
  } catch (error) {
    next(error);
  }
};

export const updateCart = async (req, res, next) => {
  try {
    const { items } = req.body; // array of { productId, qty, size, color }

    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      cart = new Cart({ userId: req.user._id, items: [] });
    }

    cart.items = items || [];
    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate({
      path: 'items.productId',
      select: 'name slug price mrp stock images category brand'
    });

    res.status(200).json({
      success: true,
      data: populatedCart
    });
  } catch (error) {
    next(error);
  }
};

export const mergeGuestCart = async (req, res, next) => {
  try {
    const { guestItems = [] } = req.body; // [{ productId, qty, size, color }]

    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      cart = new Cart({ userId: req.user._id, items: [] });
    }

    guestItems.forEach(guestItem => {
      const existing = cart.items.find(
        i => i.productId.toString() === guestItem.productId.toString() && i.size === (guestItem.size || 'Standard')
      );
      if (existing) {
        existing.qty += guestItem.qty || 1;
      } else {
        cart.items.push({
          productId: guestItem.productId,
          qty: guestItem.qty || 1,
          size: guestItem.size || 'Standard',
          color: guestItem.color || 'Default'
        });
      }
    });

    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate({
      path: 'items.productId',
      select: 'name slug price mrp stock images category brand'
    });

    res.status(200).json({
      success: true,
      data: populatedCart
    });
  } catch (error) {
    next(error);
  }
};
