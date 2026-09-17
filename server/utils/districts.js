// Bangladesh 64 Districts categorized by 8 administrative divisions
const BANGLADESH_DISTRICTS_BY_DIVISION = {
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

const BANGLADESH_DISTRICTS = Object.values(BANGLADESH_DISTRICTS_BY_DIVISION)
  .flat()
  .sort((a, b) => a.localeCompare(b));

/**
 * Validates district and calculates shipping charge and method on server
 * @param {string} district
 * @returns {{ isValid: boolean, district: string, shippingMethod: string, shippingCharge: number }}
 */
function calculateShipping(district) {
  if (!district || typeof district !== "string") {
    return {
      isValid: false,
      district: "",
      shippingMethod: "",
      shippingCharge: 0,
    };
  }

  const trimmed = district.trim();
  const matched = BANGLADESH_DISTRICTS.find(
    (d) => d.toLowerCase() === trimmed.toLowerCase(),
  );

  if (!matched) {
    return {
      isValid: false,
      district: trimmed,
      shippingMethod: "",
      shippingCharge: 0,
    };
  }

  const isDhaka = matched.toLowerCase() === "dhaka";

  return {
    isValid: true,
    district: matched,
    shippingMethod: isDhaka ? "Inside Dhaka" : "Outside Dhaka",
    shippingCharge: isDhaka ? 70 : 130,
  };
}

module.exports = {
  BANGLADESH_DISTRICTS_BY_DIVISION,
  BANGLADESH_DISTRICTS,
  calculateShipping,
};
