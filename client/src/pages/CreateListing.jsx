import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
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

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;

    if (id === "sale" || id === "rent") {
      setFormData({ ...formData, type: id });
      return;
    }

    if (id === "parking" || id === "furnished" || id === "offer") {
      setFormData({ ...formData, [id]: checked });
      return;
    }

    setFormData({ ...formData, [id]: value });
  };

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (files.length < 1) {
      setError("You must upload at least one image");
      return;
    }

    if (+formData.regularPrice < +formData.discountPrice) {
      setError("Discount price must be lower than regular price");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formPayload = new FormData();
      Object.keys(formData).forEach((key) => {
        formPayload.append(key, formData[key]);
      });

      files.forEach((file) => formPayload.append("images", file));

      formPayload.append("userRef", currentUser._id);

      const res = await fetch("/api/listing/create-listing", {
        method: "POST",
        body: formPayload,
        credentials: "include",
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok || data.success === false) {
        setError(data.message || "Something went wrong");
        return;
      }

      navigate(`/listing/${data?._id}`);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a Listing
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            id="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="border p-3 rounded-lg"
          />
          <textarea
            id="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            required
            className="border p-3 rounded-lg"
          />
          <input
            type="text"
            id="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            required
            className="border p-3 rounded-lg"
          />

          {/* Type & options */}
          <div className="flex gap-6 flex-wrap">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                id="sale"
                checked={formData.type === "sale"}
                onChange={handleChange}
              />
              Sell
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                id="rent"
                checked={formData.type === "rent"}
                onChange={handleChange}
              />
              Rent
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                id="parking"
                checked={formData.parking}
                onChange={handleChange}
              />
              Parking
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                id="furnished"
                checked={formData.furnished}
                onChange={handleChange}
              />
              Furnished
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                id="offer"
                checked={formData.offer}
                onChange={handleChange}
              />
              Offer
            </label>
          </div>

          {/* Bedrooms/Bathrooms/Prices */}
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bedrooms"
                min="1"
                max="10"
                value={formData.bedrooms}
                onChange={handleChange}
                required
                className="p-3 border rounded-lg"
              />
              <p>Beds</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bathrooms"
                min="1"
                max="10"
                value={formData.bathrooms}
                onChange={handleChange}
                required
                className="p-3 border rounded-lg"
              />
              <p>Baths</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                min="50"
                max="10000000"
                value={formData.regularPrice}
                onChange={handleChange}
                required
                className="p-3 border rounded-lg"
              />
              <p>Regular Price {formData.type === "rent" && "($ / month)"}</p>
            </div>
            {formData.offer && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="discountPrice"
                  min="0"
                  max="10000000"
                  value={formData.discountPrice}
                  onChange={handleChange}
                  required
                  className="p-3 border rounded-lg"
                />
                <p>
                  Discount Price {formData.type === "rent" && "($ / month)"}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Images */}
        <div className="flex flex-col flex-1 gap-4">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="p-3 border rounded w-full"
          />
          {files.length > 0 && (
            <ul>
              {Array.from(files).map((file, idx) => (
                <li key={idx}>{file.name}</li>
              ))}
            </ul>
          )}
          <button
            type="submit"
            disabled={loading}
            className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            {loading ? "Creating..." : "Create Listing"}
          </button>
          {error && <p className="text-red-700">{error}</p>}
        </div>
      </form>
    </main>
  );
}
