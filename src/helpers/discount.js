export function calculateDiscount(amount, discountPercentage) {
    // Check if amount or discountPercentage are not numbers
    if (isNaN(amount) || isNaN(discountPercentage)) {
        return 'Error: Both amount and discount percentage must be numbers';
    }

    // Check if discountPercentage is out of valid range
    if (discountPercentage < 0 || discountPercentage > 100) {
        return 'Error: Discount percentage must be between 0 and 100';
    }

    // Calculate discount amount
    const discountAmount = (amount * discountPercentage) / 100;

    // Return the discount amount
    return discountAmount;
}

