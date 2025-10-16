// Regex search functionality

export const searchWithRegex = ( text, pattern, caseSensitive = false ) =>
{
    try
    {
        const flags = caseSensitive ? 'g' : 'gi';
        const regex = new RegExp( pattern, flags );
        return { matches: regex.test( text ), error: null };
    } catch ( error )
    {
        return { matches: false, error: 'Invalid regex pattern' };
    }
};

export const highlightMatches = ( text, pattern, caseSensitive = false ) =>
{
    try
    {
        const flags = caseSensitive ? 'g' : 'gi';
        const regex = new RegExp( pattern, flags );
        return text.replace( regex, ( match ) => `<mark>${ match }</mark>` );
    } catch ( error )
    {
        return text;
    }
};

export const filterTransactions = ( transactions, pattern, caseSensitive = false ) =>
{
    if ( !pattern ) return transactions;

    try
    {
        const flags = caseSensitive ? 'g' : 'gi';
        const regex = new RegExp( pattern, flags );

        return transactions.filter( transaction =>
        {
            const searchableText = `${ transaction.description } ${ transaction.category } ${ transaction.amount }`;
            return regex.test( searchableText );
        } );
    } catch ( error )
    {
        return transactions;
    }
};
