import React, { useEffect, useState } from "react";
import axios from "./Axios";
import { getImageUrl } from "./Serverlink";
import EnginOilCard from "./EnginOilCard";

const EngineOil = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch brands from API
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axios.get("/brand/all");
        setBrands(response.data.brands || []);
      } catch (error) {
        console.error("Error fetching brands:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  if (!loading && brands.length === 0) {
    return null;
  }

  return (
    <section className="bg-root py-8 sm:py-12 md:py-16">
      <div className="container mx-auto px-3.5 sm:px-6 lg:px-8">
        <div className="relative border border-[rgba(225,225,225,0.2)] rounded-xl sm:rounded-2xl pt-7 pb-6 px-3 sm:pt-9 sm:pb-8 sm:px-6 md:pt-12 md:pb-10 md:px-8">
          {/* Centered Section Header Badge */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-root px-4 sm:px-6 py-0.5 sm:py-1 whitespace-nowrap z-10">
            <h2 className="text-white text-lg sm:text-xl md:text-2xl font-bold tracking-wide">
              Our Brand
            </h2>
          </div>

          {/* Responsive Brand Grid */}
          <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
            {brands.map((brand) => (
              <EnginOilCard
                key={brand._id}
                link={`/brandshop/${brand._id}`}
                discription={brand.description || "No description available"}
                title={brand.title}
                img={getImageUrl(brand.photo)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EngineOil;
