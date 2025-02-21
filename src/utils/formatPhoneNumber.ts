/**
 * Formats a phone number string by:
 * 1. Converting dots to hyphens
 * 2. Formatting extensions with 'Ext -' prefix
 * @param phone
 * @returns
 */
export const formatPhoneNumber = (phone: string): string => {
  // First, handle the extension if present
  const [mainNumber, extension] = phone.split('x').map(part => part.trim());
  
  // Replace dots with hyphens in the main number
  const formattedMainNumber = mainNumber.replace(/\./g, '-');
  
  // If there's an extension, add it with the 'Ext -' prefix
  if (extension) {
    return `${formattedMainNumber} Ext - ${extension}`;
  }
  
  return formattedMainNumber;
}; 