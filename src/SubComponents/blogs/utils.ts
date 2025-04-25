export const formatTimeAgo = (dateString: string) => {
  if (dateString === "just now") return dateString;

  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));

    if (diffDays > 0) {
      return `${diffDays} days ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hours ago`;
    } else {
      return "today";
    }
  } catch (e) {
    return dateString;
  }
};

export const formatDateDDMMYYYY = (dateString: string) => {
  try {
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return dateString;
    }
    
    // Get day, month and year
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-indexed
    const year = date.getFullYear();
    
    return `${day}-${month}-${year}`;
  } catch (e) {
    // If there's any error parsing the date, return the original string
    return dateString;
  }
};

// Array of light background colors for the blog header
export const lightBackgroundColors = [
  "#FFF8F1", // Light Peach
  "#F0F7FF", // Light Blue
  "#F5F0FF", // Light Lavender
  "#F0FFF4", // Light Mint
  "#E6FFFD", // Light Teal (replacing Pink)
  "#FFFDF0", // Light Yellow
  "#F2F2F2"  // Light Gray
];

// Array of matching badge colors (slightly darker than backgrounds)
export const lightBadgeColors = [
  "#F8DFBA", // Peach
  "#D0E6FF", // Blue
  "#E6D8FF", // Lavender
  "#D1F5D6", // Mint
  "#B8EAE7", // Teal (replacing Pink)
  "#FFEEA8", // Yellow
  "#E0E0E0"  // Gray
];

// Get a random color from an array
export const getRandomColor = (colorArray: string[]) => {
  const randomIndex = Math.floor(Math.random() * colorArray.length);
  return colorArray[randomIndex];
};

// Get a matched pair of background and badge colors with the same index
// Now using deterministic pattern based on slug or ID
export const getMatchedColors = (slug?: string) => {
  // Extract a numeric value from the slug if available
  let colorIndex = 0;
  
  if (slug) {
    // Use the last character of the slug if it exists
    const lastChar = slug.charAt(slug.length - 1);
    // Convert the character to a number (using ASCII code)
    const charCode = lastChar.charCodeAt(0);
    // Use modulo to get an index within our color array range
    colorIndex = charCode % lightBackgroundColors.length;
  } else {
    // If no slug is provided, default to a specific color
    colorIndex = 0;
  }
  
  return {
    background: lightBackgroundColors[colorIndex],
    badge: lightBadgeColors[colorIndex]
  };
};
