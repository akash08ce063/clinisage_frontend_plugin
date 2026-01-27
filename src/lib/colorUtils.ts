/**
 * Utility function to determine if a color is "light" or "dark"
 * Useful for determining contrast for text or borders against a background.
 */
export const isLightColor = (color: string): boolean => {
    if (!color) return true; // Default to treating undefined/empty as light (white)

    // Handle rgba/rgb
    if (color.startsWith('rgb')) {
        const rgb = color.match(/\d+/g);
        if (rgb && rgb.length >= 3) {
            const r = parseInt(rgb[0], 10);
            const g = parseInt(rgb[1], 10);
            const b = parseInt(rgb[2], 10);
            // Calculate luminance
            // Formula: 0.299*R + 0.587*G + 0.114*B
            const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
            return luma > 128;
        }
    }

    // Handle hex
    let hex = color.replace('#', '');

    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    if (hex.length === 3) {
        hex = hex.split('').map(char => char + char).join('');
    }

    if (hex.length === 6) {
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);

        // Perceived brightness formula
        const luma = 0.299 * r + 0.587 * g + 0.114 * b;
        return luma > 200; // Threshold for "light" background requiring border
    }

    // Fallback for named colors or unknown formats - assume light if it contains "white" or "light"
    // This is a naive heuristic but covers common "white", "ghostwhite", etc.
    if (color.toLowerCase().includes('white') || color.toLowerCase() === '#fff') return true;

    // Default conservative approach: treat as light to enforce borders if unsure? 
    // Or check if it's strictly NOT a dark color? 
    // For this specific use case (determining if we need a refined border), 
    // we want to return TRUE for white-ish backgrounds.

    return color.toLowerCase() === '#ffffff' || color.toLowerCase() === '#fff' || color.toLowerCase() === 'white';
};
