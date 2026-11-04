import { ContactMessage } from '../models/ContactMessage.js';
import { contactSchema } from '../validators/schemas.js';

export const submitContact = async (req, res, next) => {
  try {
    const validated = contactSchema.parse(req.body);

    const message = await ContactMessage.create({
      name: validated.name,
      email: validated.email,
      phone: validated.phone || '',
      subject: validated.subject,
      message: validated.message,
      status: 'New'
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for reaching out. A Wildtrail expedition expert will contact you shortly.',
      data: message
    });
  } catch (error) {
    next(error);
  }
};

export const getContactMessages = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await ContactMessage.countDocuments();
    const messages = await ContactMessage.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: messages,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

export const updateMessageStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const message = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Message not found.' }
      });
    }

    res.status(200).json({
      success: true,
      data: message
    });
  } catch (error) {
    next(error);
  }
};
