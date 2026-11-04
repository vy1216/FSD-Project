import { Coupon } from '../models/Coupon.js';

export const validateCoupon = async (req, res, next) => {
  try {
    const { code, orderAmount } = req.body;
    if (!code) {
      return res.status(400).json({
        success: false,
        error: { code: 'NO_CODE', message: 'Coupon code required.' }
      });
    }

    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
      active: true,
      expiry: { $gt: new Date() }
    });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        error: { code: 'INVALID_COUPON', message: 'Coupon code is invalid or has expired.' }
      });
    }

    if (orderAmount && orderAmount < coupon.minOrder) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MIN_ORDER_NOT_MET',
          message: `This coupon requires a minimum order value of ₹${coupon.minOrder}.`
        }
      });
    }

    const discountAmount = orderAmount
      ? Math.min((orderAmount * coupon.discountPct) / 100, coupon.maxDiscount)
      : 0;

    res.status(200).json({
      success: true,
      data: {
        code: coupon.code,
        discountPct: coupon.discountPct,
        discountAmount,
        maxDiscount: coupon.maxDiscount,
        minOrder: coupon.minOrder
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getAllCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: coupons
    });
  } catch (error) {
    next(error);
  }
};

export const createCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json({
      success: true,
      data: coupon
    });
  } catch (error) {
    next(error);
  }
};
