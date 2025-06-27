export const loadGoogleMapsScript = () => {
  if (window.google?.maps) return;

  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${
    import.meta.env.VITE_GOOGLE_API_KEY
  }&libraries=places&loading=async`;
  script.async = true;
  script.defer = true;
  script.onload = () => {
    window.isGoogleMapsLoaded = true;
  };

  document.head.appendChild(script);
};
