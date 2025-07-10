const pixelId = "983994076719229"; // Replace with your Facebook Pixel ID

// Initialize Facebook Pixel
export const initFacebookPixel = () => {
  if (!window.fbq) return;
  window.fbq("init", pixelId);
  window.fbq("track", "PageView");
};

// Track Custom Events
export const trackEvent = (eventName, eventData = {}) => {
  if (!window.fbq) return;
  window.fbq("track", eventName, eventData);
};
