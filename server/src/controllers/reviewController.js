import { Review } from '../models/Review.js';
import { reviewSchema } from '../validators/schemas.js';

export const getReviews = async (req, res, next) => {
  try {
    const { targetType, targetId } = req.query;
    const query = {};
    if (targetType) query.targetType = targetType;
    if (targetId) query.targetId = targetId;

    const reviews = await Review.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: reviews
    });
  } catch (error) {
    next(error);
  }
};

export const addReview = async (req, res, next) => {
  try {
    const validated = reviewSchema.parse(req.body);

    const review = await Review.create({
      userId: req.user._id,
      userName: req.user.name,
      userAvatar: req.user.avatar,
      targetType: validated.targetType,
      targetId: validated.targetId,
      rating: validated.rating,
      text: validated.text,
      photos: validated.photos || []
    });

    res.status(201).json({
      success: true,
      data: review
    });
  } catch (error) {
    next(error);
  }
};
