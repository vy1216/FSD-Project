import mongoose from 'mongoose';
import { Booking } from '../models/Booking.js';
import { Adventure } from '../models/Adventure.js';

let memoryBookings = [];

export const createBooking = async (req, res) => {
  try {
    const { bookingType, itemTitle, destination, startDate, guests, totalPrice } = req.body;

    if (!bookingType || !itemTitle || !startDate || !totalPrice) {
      return res.status(400).json({ message: 'Missing required booking details' });
    }

    const numGuests = Number(guests) || 1;

    // Check if this is an adventure booking and enforce person limit & enable status
    if (bookingType === 'Adventure') {
      if (mongoose.connection.readyState === 1) {
        const adv = await Adventure.findOne({ title: itemTitle });
        if (adv) {
          if (adv.isBookingEnabled === false) {
            return res.status(400).json({ message: 'Bookings for this sport/expedition are currently disabled by the administrator.' });
          }
          if (adv.personLimit && numGuests > adv.personLimit) {
            return res.status(400).json({ message: `Number of guests exceeds the person limit of ${adv.personLimit} for this adventure.` });
          }
        }
      }
    }

    const bookingData = {
      user: req.user._id,
      bookingType,
      itemTitle,
      destination: destination || '',
      startDate,
      guests: numGuests,
      totalPrice: Number(totalPrice),
      status: 'Confirmed'
    };

    if (mongoose.connection.readyState === 1) {
      const booking = await Booking.create(bookingData);
      return res.status(201).json({ message: 'Booking confirmed', booking });
    }

    // In-memory fallback for demo mode
    const booking = {
      _id: `bkg_${Date.now()}`,
      ...bookingData,
      createdAt: new Date().toISOString()
    };
    memoryBookings.unshift(booking);
    res.status(201).json({ message: 'Booking confirmed', booking });
  } catch (error) {
    res.status(500).json({ message: 'Error creating booking', error: error.message });
  }
};

export const getMyBookings = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const bookings = await Booking.find({ user: req.user._id }).sort({ createdAt: -1 });
      return res.json(bookings);
    }
    const userBookings = memoryBookings.filter(
      (b) => String(b.user) === String(req.user._id) || req.user._id === 'demo_user'
    );
    res.json(userBookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching your bookings' });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const bookings = await Booking.find().populate('user', 'name email mobile').sort({ createdAt: -1 });
      return res.json(bookings);
    }
    res.json(memoryBookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching all bookings' });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const booking = await Booking.findById(req.params.id);
      if (booking) {
        booking.status = 'Cancelled';
        await booking.save();
        return res.json({ message: 'Booking cancelled successfully', booking });
      }
    }

    const booking = memoryBookings.find((b) => b._id === req.params.id);
    if (booking) {
      booking.status = 'Cancelled';
      return res.json({ message: 'Booking cancelled successfully', booking });
    }

    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling booking' });
  }
};
