/**
 * Storage Module
 * Handles all localStorage operations with error handling
 */

const KEYS = {
    TRANSACTIONS: 'sft_transactions',
    CATEGORIES: 'sft_categories',
    BUDGET: 'sft_budget',
    RATES: 'sft_rates',
    SETTINGS: 'sft_settings'
};

/**
 * Get data from localStorage
 * @param {string} key - Storage key
 * @returns {any|null} Parsed data or null if error/not found
 */
const get = ( key ) =>
{
    try
    {
        const data = window.localStorage.getItem( key );
        return data ? JSON.parse( data ) : null;
    } catch ( error )
    {
        console.error( `Error reading from storage [${ key }]:`, error );
        return null;
    }
};

/**
 * Save data to localStorage
 * @param {string} key - Storage key
 * @param {any} value - Data to store
 * @returns {boolean} Success status
 */
const set = ( key, value ) =>
{
    try
    {
        window.localStorage.setItem( key, JSON.stringify( value ) );
        return true;
    } catch ( error )
    {
        console.error( `Error writing to storage [${ key }]:`, error );
        return false;
    }
};

/**
 * Remove data from localStorage
 * @param {string} key - Storage key
 * @returns {boolean} Success status
 */
const remove = ( key ) =>
{
    try
    {
        window.localStorage.removeItem( key );
        return true;
    } catch ( error )
    {
        console.error( `Error removing from storage [${ key }]:`, error );
        return false;
    }
};

/**
 * Clear all app data from localStorage
 * @returns {boolean} Success status
 */
const clearAll = () =>
{
    try
    {
        Object.values( KEYS ).forEach( key =>
        {
            window.localStorage.removeItem( key );
        } );
        return true;
    } catch ( error )
    {
        console.error( 'Error clearing all storage:', error );
        return false;
    }
};

export { KEYS, get, set, remove, clearAll };