// Regex validation patterns and functions

export const VALIDATION_PATTERNS = {
    // Description: no leading/trailing spaces, collapse doubles
    description: /^\S(?:.*\S)?$/,

    // Amount: positive number with up to 2 decimal places
    amount: /^(0|[1-9]\d*)(\.\d{1,2})?$/,

    // Date: YYYY-MM-DD format
    date: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,

    // Category: letters, spaces, hyphens only
    category: /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/,

    // Advanced: Duplicate words detection (back-reference)
    duplicateWords: /\b(\w+)\s+\1\b/i,

    // Advanced: Currency amount with cents
    hasCents: /\.\d{2}\b/,

    // Advanced: Beverage keywords (lookahead)
    beverage: /\b(coffee|tea|juice|soda|water)\b/i,
};

export const validateDescription = ( description ) =>
{
    if ( !description.trim() )
    {
        return { isValid: false, message: 'Description is required' };
    }

    if ( !VALIDATION_PATTERNS.description.test( description ) )
    {
        return {
            isValid: false,
            message: 'Description cannot have leading/trailing spaces or multiple consecutive spaces'
        };
    }

    // Check for duplicate words
    if ( VALIDATION_PATTERNS.duplicateWords.test( description ) )
    {
        return {
            isValid: false,
            message: 'Description contains duplicate consecutive words',
        };
    }

    if ( description.length > 100 )
    {
        return { isValid: false, message: 'Description must be less than 100 characters' };
    }

    return { isValid: true, message: '' };
};

export const validateAmount = ( amount ) =>
{
    if ( !amount.trim() )
    {
        return { isValid: false, message: 'Amount is required' };
    }

    if ( !VALIDATION_PATTERNS.amount.test( amount ) )
    {
        return {
            isValid: false,
            message: 'Amount must be a positive number with up to 2 decimal places'
        };
    }

    const numAmount = parseFloat( amount );
    if ( numAmount <= 0 )
    {
        return { isValid: false, message: 'Amount must be greater than 0' };
    }

    if ( numAmount > 1000000 )
    {
        return { isValid: false, message: 'Amount is too large' };
    }

    return { isValid: true, message: '' };
};

export const validateDate = ( date ) =>
{
    if ( !date.trim() )
    {
        return { isValid: false, message: 'Date is required' };
    }

    if ( !VALIDATION_PATTERNS.date.test( date ) )
    {
        return { isValid: false, message: 'Date must be in YYYY-MM-DD format' };
    }

    const dateObj = new Date( date );
    if ( isNaN( dateObj.getTime() ) )
    {
        return { isValid: false, message: 'Invalid date' };
    }

    // Check if date is not in the future
    const today = new Date();
    today.setHours( 23, 59, 59, 999 );
    if ( dateObj > today )
    {
        return { isValid: false, message: 'Date cannot be in the future' };
    }

    return { isValid: true, message: '' };
};

export const validateCategory = ( category ) =>
{
    if ( !category.trim() )
    {
        return { isValid: false, message: 'Category is required' };
    }

    if ( !VALIDATION_PATTERNS.category.test( category ) )
    {
        return {
            isValid: false,
            message: 'Category can only contain letters, spaces, and hyphens'
        };
    }

    if ( category.length > 30 )
    {
        return { isValid: false, message: 'Category must be less than 30 characters' };
    }

    return { isValid: true, message: '' };
};
