import Listing from "../models/listing.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { errorHandler } from "../utils/error.js";

// Creating listing
export const createListing = async (req, res, next) => {
  try {
    const {
      name,
      description,
      address,
      type,
      bedrooms,
      bathrooms,
      regularPrice,
      discountPrice,
      offer,
      parking,
      furnished,
      userRef,
    } = req.body;

    const imageUrls = await Promise.all(
      req.files.map(async (file) => {
        const uploaded = await uploadOnCloudinary(file.path);
        return uploaded.url;
      })
    );

    const newListing = new Listing({
      name,
      description,
      address,
      type,
      bedrooms,
      bathrooms,
      regularPrice,
      discountPrice,
      offer: offer === "true",
      parking: parking === "true",
      furnished: furnished === "true",
      userRef,
      imageUrls,
    });

    await newListing.save();

    res.status(201).json({
      success: true,
      data: "Listing Create Successfully.",
      _id: newListing._id,
    });
  } catch (err) {
    next(err);
  }
};

export const updateListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return next(errorHandler(404, "Listing not found!"));

    // Only owner can update
    if (listing.userRef.toString() !== req.user._id) {
      return next(errorHandler(403, "You can only update your own listings!"));
    }

    const imageUrls = await Promise.all(
      req.files.map(async (file) => {
        const uploaded = await uploadOnCloudinary(file.path);
        return uploaded.url;
      })
    );

    // Update listing with body + new images
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      { ...req.body, imageUrls },
      { new: true }
    );

    res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
};

// get listing by id
export const getOneListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return next(errorHandler(404, "Listing not found!"));
    }

    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

// get listing byr userRef
export const getListing = async (req, res, next) => {
  if (req.user._id !== req.params.id) {
    return next(errorHandler(402, "You can view only your own listings"));
  }

  try {
    const listings = await Listing.find({ userRef: req.params.id });

    if (listings.length === 0) {
      return next(errorHandler(404, "No listings found"));
    }

    res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(errorHandler(404, "Listing not found!"));
  }

  if (req.user._id !== listing.userRef) {
    return next(errorHandler(401, "You can only delete your own listings!"));
  }

  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json("Listing has been deleted!");
  } catch (error) {
    next(error);
  }
};

//  get All Listing
export const getAllListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const startIndex = parseInt(req.query.startIndex) || 0;
    let offer = req.query.offer;

    if (offer === undefined || offer === "false") {
      offer = { $in: [false, true] };
    }

    let furnished = req.query.furnished;

    if (furnished === undefined || furnished === "false") {
      furnished = { $in: [false, true] };
    }

    let parking = req.query.parking;

    if (parking === undefined || parking === "false") {
      parking = { $in: [false, true] };
    }

    let type = req.query.type;

    if (type === undefined || type === "all") {
      type = { $in: ["sale", "rent"] };
    }

    const searchTerm = req.query.searchTerm || "";

    const sort = req.query.sort || "createdAt";

    const order = req.query.order || "desc";

    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: "i" },
      offer,
      furnished,
      parking,
      type,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};
