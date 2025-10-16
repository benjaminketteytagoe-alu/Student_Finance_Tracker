// Application state management

import { loadTransactions, saveTransactions, loadSettings, saveSettings } from './storage.js';

class State
{
    constructor()
    {
        this.transactions = loadTransactions();
        this.settings = loadSettings();
        this.currentPage = 'dashboard';
        this.editingId = null;
        this.deleteId = null;
        this.listeners = [];
    }

    subscribe ( listener )
    {
        this.listeners.push( listener );
    }

    notify ()
    {
        this.listeners.forEach( listener => listener() );
    }

    // Transaction operations
    addTransaction ( transaction )
    {
        const newTransaction = {
            ...transaction,
            id: `txn_${ Date.now() }`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        this.transactions.push( newTransaction );
        saveTransactions( this.transactions );
        this.notify();
    }

    updateTransaction ( id, updates )
    {
        const index = this.transactions.findIndex( t => t.id === id );
        if ( index !== -1 )
        {
            this.transactions[ index ] = {
                ...this.transactions[ index ],
                ...updates,
                updatedAt: new Date().toISOString(),
            };
            saveTransactions( this.transactions );
            this.notify();
        }
    }

    deleteTransaction ( id )
    {
        this.transactions = this.transactions.filter( t => t.id !== id );
        saveTransactions( this.transactions );
        this.notify();
    }

    getTransaction ( id )
    {
        return this.transactions.find( t => t.id === id );
    }

    // Settings operations
    updateSettings ( updates )
    {
        this.settings = { ...this.settings, ...updates };
        saveSettings( this.settings );
        this.notify();
    }

    addCategory ( category )
    {
        if ( !this.settings.categories.includes( category ) )
        {
            this.settings.categories.push( category );
            saveSettings( this.settings );
            this.notify();
        }
    }

    removeCategory ( category )
    {
        this.settings.categories = this.settings.categories.filter( c => c !== category );
        saveSettings( this.settings );
        this.notify();
    }

    // Computed values
    getTotalSpent ()
    {
        return this.transactions.reduce( ( sum, t ) => sum + ( Number( t.amount ) || 0 ), 0 );
    }

    getSpentThisMonth ()
    {
        const now = new Date();
        const firstDay = new Date( now.getFullYear(), now.getMonth(), 1 );

        return this.transactions
            .filter( t => new Date( t.date ) >= firstDay )
            .reduce( ( sum, t ) => sum + ( Number( t.amount ) || 0 ), 0 );
    }

    getSpendingByCategory ()
    {
        const spending = {};
        this.transactions.forEach( t =>
        {
            spending[ t.category ] = ( spending[ t.category ] || 0 ) + ( Number( t.amount ) || 0 );
        } );
        return spending;
    }

    getLast7DaysTrend ()
    {
        const days = [];
        const now = new Date();

        for ( let i = 6; i >= 0; i-- )
        {
            const date = new Date( now );
            date.setDate( date.getDate() - i );
            const dateStr = date.toISOString().split( 'T' )[ 0 ];

            const dayTotal = this.transactions
                .filter( t => t.date === dateStr )
                .reduce( ( sum, t ) => sum + ( Number( t.amount ) || 0 ), 0 );

            days.push( { date: dateStr, amount: dayTotal } );
        }

        return days;
    }

    getBudgetStatus ()
    {
        const spent = this.getSpentThisMonth();
        const budget = this.settings.monthlyBudget;
        const remaining = budget - spent;
        const percentage = ( spent / budget ) * 100;

        let status = 'ok';
        let message = `You have $${ remaining.toFixed( 2 ) } remaining this month.`;

        if ( percentage >= 100 )
        {
            status = 'danger';
            message = `You have exceeded your monthly budget by $${ Math.abs( remaining ).toFixed( 2 ) }!`;
        } else if ( percentage >= 80 )
        {
            status = 'warning';
            message = `You're at ${ percentage.toFixed( 0 ) }% of your monthly budget.`;
        }

        return { status, message, percentage, spent, remaining };
    }
}

export const state = new State();
