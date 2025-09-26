export const getImageUrl = (path) => {
  if (!path || typeof path !== "string") {
    return "";
  }

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  } else {
    // const baseUrl = "http://10.10.7.41:5001";
    // const baseUrl = "http://50.6.200.33:5001/";
    const baseUrl = "http://206.162.244.155:5001/";
    return `${baseUrl}/${path}`;
  }
};


export function getVideoAndThumbnail(url) {
  if (!url) return ''; // handle undefined/null cases
  
  // If already has http/https, return as-is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // Otherwise, add https://
  return `https://${url}`;
}
