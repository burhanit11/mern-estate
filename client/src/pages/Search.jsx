import { useEffect, useState } from "react";
import ListingItem from "../components/ListingItem";
import { useNavigate, useLocation } from "react-router";

export default function Search() {
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebardata, setSidebardata] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "createdAt",
    order: "desc",
  });

  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);

    setSidebardata({
      searchTerm: urlParams.get("searchTerm") || "",
      type: urlParams.get("type") || "all",
      parking: urlParams.get("parking") === "true",
      furnished: urlParams.get("furnished") === "true",
      offer: urlParams.get("offer") === "true",
      sort: urlParams.get("sort") || "createdAt",
      order: urlParams.get("order") || "desc",
    });

    const fetchListings = async () => {
      try {
        setLoading(true);
        setShowMore(false);

        const res = await fetch(
          `/api/listing/get-all-listing?${urlParams.toString()}`
        );

        const data = await res.json();

        // backend returns ARRAY
        setListings(Array.isArray(data) ? data : []);
        setShowMore(Array.isArray(data) && data.length >= 9);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchListings();
  }, [location.search]);

  const handleChange = (e) => {
    const { id, value, checked } = e.target;

    if (id === "all" || id === "rent" || id === "sale") {
      setSidebardata({ ...sidebardata, type: id });
      return;
    }

    if (id === "searchTerm") {
      setSidebardata({ ...sidebardata, searchTerm: value });
      return;
    }

    if (id === "parking" || id === "furnished" || id === "offer") {
      setSidebardata({ ...sidebardata, [id]: checked });
      return;
    }

    if (id === "sort_order") {
      const [sort, order] = value.split("_");
      setSidebardata({ ...sidebardata, sort, order });
    }
  };

  // ================= SUBMIT SEARCH =================
  const handleSubmit = (e) => {
    e.preventDefault();

    const params = new URLSearchParams();
    params.set("searchTerm", sidebardata.searchTerm);
    params.set("type", sidebardata.type);
    params.set("parking", sidebardata.parking);
    params.set("furnished", sidebardata.furnished);
    params.set("offer", sidebardata.offer);
    params.set("sort", sidebardata.sort);
    params.set("order", sidebardata.order);

    navigate(`/search?${params.toString()}`);
  };

  // ================= PAGINATION =================
  const onShowMoreClick = async () => {
    const startIndex = listings.length;
    const params = new URLSearchParams(location.search);
    params.set("startIndex", startIndex);

    const res = await fetch(
      `/api/listing/get-all-listing?${params.toString()}`
    );
    const data = await res.json();

    setListings((prev) => [...prev, ...data]);
    if (data.length < 5) setShowMore(false);
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b md:border-r md:min-h-screen">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          {/* Search */}
          <div className="flex items-center gap-2">
            <label className="font-semibold whitespace-nowrap">
              Search Term:
            </label>
            <input
              type="text"
              id="searchTerm"
              placeholder="Search..."
              className="border rounded-lg p-3 w-full"
              value={sidebardata.searchTerm}
              onChange={handleChange}
            />
          </div>

          {/* Type */}
          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Type:</label>

            {["all", "rent", "sale"].map((t) => (
              <label key={t} className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  id={t}
                  className="w-5"
                  checked={sidebardata.type === t}
                  onChange={handleChange}
                />
                <span>{t === "all" ? "Rent & Sale" : t}</span>
              </label>
            ))}

            <label className="flex gap-2 items-center">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                checked={sidebardata.offer}
                onChange={handleChange}
              />
              <span>Offer</span>
            </label>
          </div>

          {/* Amenities */}
          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Amenities:</label>

            {["parking", "furnished"].map((a) => (
              <label key={a} className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  id={a}
                  className="w-5"
                  checked={sidebardata[a]}
                  onChange={handleChange}
                />
                <span>{a}</span>
              </label>
            ))}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <label className="font-semibold">Sort:</label>
            <select
              id="sort_order"
              className="border rounded-lg p-3"
              onChange={handleChange}
              value={`${sidebardata.sort}_${sidebardata.order}`}
            >
              <option value="regularPrice_desc">Price high to low</option>
              <option value="regularPrice_asc">Price low to high</option>
              <option value="createdAt_desc">Latest</option>
              <option value="createdAt_asc">Oldest</option>
            </select>
          </div>

          <button className="bg-slate-700 text-white p-3 rounded-lg uppercase">
            Search
          </button>
        </form>
      </div>

      {/* ================= RESULTS ================= */}
      <div className="flex-1">
        <h1 className="text-3xl font-semibold border-b p-3 text-slate-700 mt-5">
          Listing results:
        </h1>

        <div className="p-7 flex flex-wrap gap-4">
          {loading && <p className="text-xl w-full text-center">Loading...</p>}

          {!loading && listings.length === 0 && (
            <p className="text-xl text-slate-700">No listing found!</p>
          )}

          {!loading &&
            listings.map(
              (listing) =>
                listing?._id && (
                  <ListingItem key={listing._id} listing={listing} />
                )
            )}

          {showMore && (
            <button
              onClick={onShowMoreClick}
              className="text-green-700 hover:underline p-7 w-full"
            >
              Show more
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
