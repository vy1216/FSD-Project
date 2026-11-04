import { Wishlist } from '../models/Wishlist.js';

export const getWishlist = async (req, res, next) => {
  try {
    let wishlist = await Wishlist.findOne({ userId: req.user._id });
    if (!wishlist) {
      wishlist = await Wishlist.create({ userId: req.user._id, items: [] });
    }
    res.status(200).json({
      success: true,
      data: wishlist
    });
  } catch (error) {
    next(error);
  }
};

export const toggleWishlist = async (req, res, next) => {
  try {
    const { targetType, targetId, title, image, price, category } = req.body;
    let wishlist = await Wishlist.findOne({ userId: req.user._id });

    if (!wishlist) {
      wishlist = new Wishlist({ userId: req.user._id, items: [] });
    }

    const index = wishlist.items.findIndex(
      item => item.targetId.toString() === targetId && item.targetType === targetType
    );

    let isAdded = false;
    if (index > -1) {
      wishlist.items.splice(index, 1);
      isAdded = false;
    } else {
      wishlist.items.push({
        targetType,
        targetId,
        title,
        image: image || '',
        price: price || 0,
        category: category || ''
      });
      isAdded = true;
    }

    await wishlist.save();

    res.status(200).json({
      success: true,
      data: wishlist,
      isAdded
    });
  } catch (error) {
    next(error);
  }
};
