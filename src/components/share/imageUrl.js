export const getImageUrl = (path) => {
  if (!path || typeof path !== "string") {
    return "";
  }

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  } else {
    const baseUrl = "https://ftp.thepigeonhub.com";
    // const baseUrl = "http://50.6.200.33:5001/";
    // const baseUrl = "http://10.10.7.41:5001/";
    return `${baseUrl}/${path}`;
  }
};


// export const getImageUrl = (path) => {
//   if (!path) {
//     return "https://i.ibb.co/fYZx5zCP/Region-Gallery-Viewer.png"; // default image
//   }

//   if (path.startsWith("http://") || path.startsWith("https://")) {
//     return path;
//   } else {
//     const baseUrl = "http://10.10.7.41:5001";
//     // const baseUrl = "https://ftp.thepigeonhub.com";
//     return `${baseUrl}/${path}`;
//   }
// };

export function getVideoAndThumbnail(url) {
  if (!url) return ''; // handle undefined/null cases
  
  // If already has http/https, return as-is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // Otherwise, add https://
  return `https://${url}`;
}
