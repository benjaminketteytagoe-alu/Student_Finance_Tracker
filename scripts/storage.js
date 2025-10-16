// Storage utilities for localStorage management

const STORAGE_KEYS = {
    TRANSACTIONS: 'finance_tracker_transactions',
    SETTINGS: 'finance_tracker_settings',
    BUDGETS: 'finance_tracker_budgets',
};

const DEFAULT_SETTINGS = {
    baseCurrency: 'USD',
    currencies: {
        USD: 1,
        EUR: 0.92,
        GBP: 0.79,
    },
    categories: [ 'Food', 'Books', 'Transport', 'Entertainment', 'Fees', 'Other' ],
    monthlyBudget: 1000,
};

export const saveTransactions = ( transactions ) =>
{
    try
    {
        localStorage.setItem( STORAGE_KEYS.TRANSACTIONS, JSON.stringify( transactions ) );
    } catch ( error )
    {
        console.error( 'Failed to save transactions:', error );
        throw new Error( 'Failed to save data. Storage may be full.' );
    }
};

export const loadTransactions = () =>
{
    try
    {
        const data = localStorage.getItem( STORAGE_KEYS.TRANSACTIONS );
        return data ? JSON.parse( data ) : [];
    } catch ( error )
    {
        console.error( 'Failed to load transactions:', error );
        return [];
    }
};

export const saveSettings = ( settings ) =>
{
    try
    {
        localStorage.setItem( STORAGE_KEYS.SETTINGS, JSON.stringify( settings ) );
    } catch ( error )
    {
        console.error( 'Failed to save settings:', error );
        throw new Error( 'Failed to save settings.' );
    }
};

export const loadSettings = () =>
{
    try
    {
        const data = localStorage.getItem( STORAGE_KEYS.SETTINGS );
        return data ? { ...DEFAULT_SETTINGS, ...JSON.parse( data ) } : DEFAULT_SETTINGS;
    } catch ( error )
    {
        console.error( 'Failed to load settings:', error );
        return DEFAULT_SETTINGS;
    }
};

export const exportData = () =>
{
    const data = {
        transactions: loadTransactions(),
        settings: loadSettings(),
        exportedAt: new Date().toISOString(),
    };
    return JSON.stringify( data, null, 2 );
};

export const importData = ( jsonString ) =>
{
    try
    {
        const data = JSON.parse( jsonString );

        // Validate structure
        if ( !data.transactions || !Array.isArray( data.transactions ) )
        {
            return { success: false, message: 'Invalid data format: transactions must be an array' };
        }

        // Validate each transaction
        for ( const transaction of data.transactions )
        {
            if ( !transaction.id || !transaction.description || typeof transaction.amount !== 'number' )
            {
                return { success: false, message: 'Invalid transaction format' };
            }
        }

        // Import data
        saveTransactions( data.transactions );
        if ( data.settings ) saveSettings( data.settings );

        return { success: true, message: 'Data imported successfully' };
    } catch ( error )
    {
        return { success: false, message: 'Invalid JSON format' };
    }
};
