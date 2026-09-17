const serverBaseUrl = "https://server.automallbd.com/";
// const serverBaseUrl = "http://localhost:8000/";

/**
 * Returns direct Cloudinary URL if external/https, or prepends serverBaseUrl for legacy local uploads
 * @param {string} photo - Cloudinary URL or legacy local path
 * @returns {string}
 */
export const getImageUrl = (photo) => {
  if (!photo) return "";
  if (typeof photo === "string") {
    if (photo.startsWith("http://") || photo.startsWith("https://")) {
      return photo;
    }
    const cleanPath = photo.replace(/\\/g, "/").replace(/^\/+/, "");
    return `${serverBaseUrl}${cleanPath}`;
  }
  return "";
};

const serverLink = {
  api: serverBaseUrl,
  getImageUrl,
};

export default serverLink.api;
