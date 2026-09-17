// Bangladesh 64 Districts categorized by 8 administrative divisions
export const BANGLADESH_DISTRICTS_BY_DIVISION = {
  "Dhaka Division": [
    "Dhaka",
    "Faridpur",
    "Gazipur",
    "Gopalganj",
    "Kishoreganj",
    "Madaripur",
    "Manikganj",
    "Munshiganj",
    "Narayanganj",
    "Narsingdi",
    "Rajbari",
    "Shariatpur",
    "Tangail",
  ],
  "Chattogram Division": [
    "Bandarban",
    "Brahmanbaria",
    "Chandpur",
    "Chattogram",
    "Cox's Bazar",
    "Cumilla",
    "Feni",
    "Khagrachhari",
    "Lakshmipur",
    "Noakhali",
    "Rangamati",
  ],
  "Rajshahi Division": [
    "Bogura",
    "Chapainawabganj",
    "Joypurhat",
    "Naogaon",
    "Natore",
    "Pabna",
    "Rajshahi",
    "Sirajganj",
  ],
  "Khulna Division": [
    "Bagerhat",
    "Chuadanga",
    "Jashore",
    "Jhenaidah",
    "Khulna",
    "Kushtia",
    "Magura",
    "Meherpur",
    "Narail",
    "Satkhira",
  ],
  "Barishal Division": [
    "Barguna",
    "Barishal",
    "Bhola",
    "Jhalokathi",
    "Patuakhali",
    "Pirojpur",
  ],
  "Sylhet Division": ["Habiganj", "Moulvibazar", "Sunamganj", "Sylhet"],
  "Rangpur Division": [
    "Dinajpur",
    "Gaibandha",
    "Kurigram",
    "Lalmonirhat",
    "Nilphamari",
    "Panchagarh",
    "Rangpur",
    "Thakurgaon",
  ],
  "Mymensingh Division": ["Jamalpur", "Mymensingh", "Netrokona", "Sherpur"],
};

// Flat list of all 64 unique districts sorted alphabetically
export const BANGLADESH_DISTRICTS = Object.values(
  BANGLADESH_DISTRICTS_BY_DIVISION,
)
  .flat()
  .sort((a, b) => a.localeCompare(b));

/**
 * Calculates shipping method and charge based on selected district
 * @param {string} district
 * @returns {{ shippingMethod: string, shippingCharge: number, isDhaka: boolean }}
 */
export const calculateShipping = (district) => {
  if (!district || !district.trim()) {
    return {
      shippingMethod: "Please select district",
      shippingCharge: 0,
      isDhaka: false,
    };
  }

  const normalized = district.trim().toLowerCase();
  const isDhaka = normalized === "dhaka";

  return {
    shippingMethod: isDhaka ? "Inside Dhaka" : "Outside Dhaka",
    shippingCharge: isDhaka ? 70 : 130,
    isDhaka,
  };
};
