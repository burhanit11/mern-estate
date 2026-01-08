import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";

export default function UpdateListing() {
  const navigate = useNavigate();
  const params = useParams();

  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageUploadError, setImageUploadError] = useState("");

  // Fetch listing on mount
  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await fetch(`/api/listing/getOne/${params.listingId}`, {
          credentials: "include",
        });
        const data = await res.json();
        if (!res.ok) return setError(data.message || "Failed to fetch listing");

        // Set formData and convert types
        setFormData({
          ...data,
          bedrooms: +data.bedrooms,
          bathrooms: +data.bathrooms,
          regularPrice: +data.regularPrice,
          discountPrice: +data.discountPrice,
          offer: !!data.offer,
          parking: !!data.parking,
          furnished: !!data.furnished,
          imageUrls: data.imageUrls || [],
        });
      } catch (err) {
        setError(err.message);
      }
    };

    fetchListing();
  }, [params.listingId]);

  // Handle field changes
  const handleChange = (e) => {
    const { id, value, checked, type } = e.target;

    if (id === "sale" || id === "rent") {
      setFormData({ ...formData, type: id });
      return;
    }

    if (id === "parking" || id === "furnished" || id === "offer") {
      setFormData({ ...formData, [id]: checked });
      return;
    }

    if (type === "number") {
      setFormData({ ...formData, [id]: +value });
      return;
    }

    setFormData({ ...formData, [id]: value });
  };

  // Remove image
  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length + files.length < 1)
        return setError("You must have at least one image");
      if (+formData.discountPrice > +formData.regularPrice)
        return setError("Discount price must be lower than regular price");

      setLoading(true);
      setError(false);

      const newData = new FormData();

      // Append fields
      for (const key in formData) {
        if (key !== "imageUrls") newData.append(key, formData[key]);
      }

      // Append new files
      for (let i = 0; i < files.length; i++) {
        newData.append("images", files[i]);
      }

      const res = await fetch(`/api/listing/update/${params.listingId}`, {
        method: "POST",
        body: newData,
        credentials: "include",
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) return setError(data.message || "Failed to update listing");

      navigate(`/listing/${data._id}`);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Update Listing
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        {/* Left side inputs */}
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            id="name"
            placeholder="Name"
            required
            maxLength={62}
            minLength={10}
            value={formData.name}
            onChange={handleChange}
            className="border p-3 rounded-lg"
          />

          <textarea
            id="description"
            placeholder="Description"
            required
            value={formData.description}
            onChange={handleChange}
            className="border p-3 rounded-lg"
          />

          <input
            type="text"
            id="address"
            placeholder="Address"
            required
            value={formData.address}
            onChange={handleChange}
            className="border p-3 rounded-lg"
          />

          {/* Type & checkboxes */}
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2 items-center">
              <input
                type="checkbox"
                id="sale"
                checked={formData.type === "sale"}
                onChange={handleChange}
                className="w-5"
              />
              <span>Sell</span>
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="checkbox"
                id="rent"
                checked={formData.type === "rent"}
                onChange={handleChange}
                className="w-5"
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="checkbox"
                id="parking"
                checked={formData.parking}
                onChange={handleChange}
                className="w-5"
              />
              <span>Parking</span>
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="checkbox"
                id="furnished"
                checked={formData.furnished}
                onChange={handleChange}
                className="w-5"
              />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="checkbox"
                id="offer"
                checked={formData.offer}
                onChange={handleChange}
                className="w-5"
              />
              <span>Offer</span>
            </div>
          </div>

          {/* Numeric inputs */}
          <div className="flex flex-wrap gap-6 mt-2">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bedrooms"
                min="1"
                max="10"
                value={formData.bedrooms}
                onChange={handleChange}
                className="p-3 border rounded-lg"
              />
              <span>Beds</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bathrooms"
                min="1"
                max="10"
                value={formData.bathrooms}
                onChange={handleChange}
                className="p-3 border rounded-lg"
              />
              <span>Baths</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                min="50"
                value={formData.regularPrice}
                onChange={handleChange}
                className="p-3 border rounded-lg"
              />
              <span>
                Regular Price {formData.type === "rent" && "($/month)"}
              </span>
            </div>
            {formData.offer && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="discountPrice"
                  min="0"
                  value={formData.discountPrice}
                  onChange={handleChange}
                  className="p-3 border rounded-lg"
                />
                <span>
                  Discount Price {formData.type === "rent" && "($/month)"}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right side images */}
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images: <span className="text-gray-600 font-normal">Max 6</span>
          </p>

          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setFiles(e.target.files)}
            className="p-3 border rounded-lg"
          />

          {files.length > 0 && (
            <p className="text-sm text-gray-500">
              {files.length} file(s) selected
            </p>
          )}

          {/* Existing images */}
          {formData.imageUrls.map((url, i) => (
            <div
              key={i}
              className="flex items-center justify-between border p-2 rounded"
            >
              <img
                src={url}
                alt="listing"
                className="w-20 h-20 object-contain rounded"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(i)}
                className="p-2 text-red-600 border rounded hover:opacity-75"
              >
                Delete
              </button>
            </div>
          ))}

          {imageUploadError && (
            <p className="text-red-700 text-sm">{imageUploadError}</p>
          )}

          <button
            type="submit"
            disabled={loading || uploading}
            className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-70"
          >
            {loading ? "Updating..." : "Update Listing"}
          </button>

          {error && <p className="text-red-700 text-sm mt-2">{error}</p>}
        </div>
      </form>
    </main>
  );
}
