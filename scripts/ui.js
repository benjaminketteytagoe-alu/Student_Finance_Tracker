/*UI Module Handles all user interface rendering and interactions*/

import * as State from './state.js';
import * as Validators from './validators.js';
import * as Search from './search.js';

// UI State
let currentSort = { field: 'date', direction: 'desc' };
let deleteCallback = null;

/**
 * Initialize UI event listeners
 */
const init = () =>
{
    setupTabs();
    setupForm();
    setupTable();
    setupSettings();
    setupModals();
    updateCategories();
};

/**
 * Setup tab navigation
 */
const setupTabs = () =>
{
    const tabs = document.querySelectorAll( '.nav-tabs button' );

    tabs.forEach( tab =>
    {
        tab.addEventListener( 'click', () =>
        {
            // Update tab states
            tabs.forEach( t =>
            {
                t.classList.remove( 'active' );
                t.setAttribute( 'aria-selected', 'false' );
            } );
            tab.classList.add( 'active' );
            tab.setAttribute( 'aria-selected', 'true' );

            // Update section visibility
            const sections = document.querySelectorAll( 'main section' );
            sections.forEach( s => s.classList.remove( 'active' ) );

            const targetId = tab.id.replace( 'tab-', '' );
            const targetSection = document.getElementById( targetId );
            if ( targetSection )
            {
                targetSection.classList.add( 'active' );
            }
        } );

        // Keyboard navigation
        tab.addEventListener( 'keydown', ( e ) =>
        {
            let newIndex;
            const currentIndex = Array.from( tabs ).indexOf( tab );

            if ( e.key === 'ArrowLeft' )
            {
                newIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
                tabs[ newIndex ].focus();
                tabs[ newIndex ].click();
            } else if ( e.key === 'ArrowRight' )
            {
                newIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
                tabs[ newIndex ].focus();
                tabs[ newIndex ].click();
            }
        } );
    } );
};

/**
 * Setup transaction form
 */
const setupForm = () =>
{
    const form = document.getElementById( 'transaction-form' );
    const dateInput = document.getElementById( 'date' );

    // Set default date to today
    dateInput.value = new Date().toISOString().split( 'T' )[ 0 ];

    form.addEventListener( 'submit', ( e ) =>
    {
        e.preventDefault();

        const description = document.getElementById( 'description' ).value;
        const amount = document.getElementById( 'amount' ).value;
        const category = document.getElementById( 'category' ).value;
        const date = document.getElementById( 'date' ).value;
        const editId = document.getElementById( 'edit-id' ).value;

        let isValid = true;

        // Validate all fields
        [ 'description', 'amount', 'category', 'date' ].forEach( field =>
        {
            const value = document.getElementById( field ).value;
            const validation = Validators.validate( field, value );
            const errorEl = document.getElementById( `error-${ field }` );

            if ( !validation.valid )
            {
                errorEl.textContent = validation.message;
                errorEl.classList.add( 'show' );
                isValid = false;
            } else
            {
                errorEl.classList.remove( 'show' );
            }
        } );

        if ( isValid )
        {
            const data = { description, amount, category, date };

            if ( editId )
            {
                State.updateTransaction( editId, data );
                showStatus( 'Transaction updated successfully' );
                cancelEdit();
            } else
            {
                State.addTransaction( data );
                showStatus( 'Transaction added successfully' );
                form.reset();
                dateInput.value = new Date().toISOString().split( 'T' )[ 0 ];
            }
        }
    } );

    // Real-time validation
    [ 'description', 'amount', 'category', 'date' ].forEach( field =>
    {
        const input = document.getElementById( field );
        input.addEventListener( 'blur', () =>
        {
            const validation = Validators.validate( field, input.value );
            const errorEl = document.getElementById( `error-${ field }` );

            if ( !validation.valid && input.value )
            {
                errorEl.textContent = validation.message;
                errorEl.classList.add( 'show' );
            } else
            {
                errorEl.classList.remove( 'show' );
            }
        } );
    } );

    document.getElementById( 'cancel-edit' ).addEventListener( 'click', cancelEdit );
};

/**
 * Cancel edit mode and reset form
 */
const cancelEdit = () =>
{
    const form = document.getElementById( 'transaction-form' );
    form.reset();
    document.getElementById( 'edit-id' ).value = '';
    document.getElementById( 'form-title' ).textContent = 'Add Transaction';
    document.getElementById( 'cancel-edit' ).style.display = 'none';
    document.getElementById( 'date' ).value = new Date().toISOString().split( 'T' )[ 0 ];

    // Clear all error messages
    document.querySelectorAll( '.error-message' ).forEach( el =>
    {
        el.classList.remove( 'show' );
    } );
};

/**
 * Setup table sorting and search
 */
const setupTable = () =>
{
    const searchInput = document.getElementById( 'search-input' );
    const caseCheckbox = document.getElementById( 'case-insensitive' );

    searchInput.addEventListener( 'input', renderTransactions );
    caseCheckbox.addEventListener( 'change', renderTransactions );

    // Setup sortable columns
    document.querySelectorAll( 'th[data-sort]' ).forEach( th =>
    {
        th.addEventListener( 'click', () =>
        {
            const field = th.dataset.sort;

            if ( currentSort.field === field )
            {
                currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
            } else
            {
                currentSort.field = field;
                currentSort.direction = 'asc';
            }

            // Update visual indicators
            document.querySelectorAll( 'th[data-sort]' ).forEach( t =>
            {
                t.classList.remove( 'sort-asc', 'sort-desc' );
            } );
            th.classList.add( `sort-${ currentSort.direction }` );

            renderTransactions();
        } );

        // Keyboard support
        th.setAttribute( 'tabindex', '0' );
        th.addEventListener( 'keydown', ( e ) =>
        {
            if ( e.key === 'Enter' || e.key === ' ' )
            {
                e.preventDefault();
                th.click();
            }
        } );
    } );
};

/**
 * Setup settings page
 */
const setupSettings = () =>
{
    // Budget form
    document.getElementById( 'budget-form' ).addEventListener( 'submit', ( e ) =>
    {
        e.preventDefault();
        const budgetValue = document.getElementById( 'monthly-budget' ).value;
        const validation = Validators.validateBudget( budgetValue );

        if ( validation.valid )
        {
            State.setBudget( budgetValue );
            showStatus( 'Budget saved successfully' );
        } else
        {
            showStatus( validation.message );
        }
    } );

    // Exchange rates
    document.getElementById( 'save-rates' ).addEventListener( 'click', () =>
    {
        const rates = {
            EUR: parseFloat( document.getElementById( 'rate-eur' ).value ),
            GBP: parseFloat( document.getElementById( 'rate-gbp' ).value )
        };
        State.setRates( rates );
        showStatus( 'Exchange rates saved' );
    } );

    // Base currency
    document.getElementById( 'base-currency' ).addEventListener( 'change', ( e ) =>
    {
        State.setBaseCurrency( e.target.value );
        showStatus( 'Base currency updated' );
    } );

    // Add category
    document.getElementById( 'add-category' ).addEventListener( 'click', () =>
    {
        const input = document.getElementById( 'new-category' );
        const value = input.value.trim();
        const validation = Validators.validate( 'category', value );
        const errorEl = document.getElementById( 'error-new-category' );

        if ( !validation.valid )
        {
            errorEl.textContent = validation.message;
            errorEl.classList.add( 'show' );
        } else
        {
            if ( State.addCategory( value ) )
            {
                input.value = '';
                errorEl.classList.remove( 'show' );
                updateCategories();
                showStatus( 'Category added successfully' );
            } else
            {
                errorEl.textContent = 'Category already exists';
                errorEl.classList.add( 'show' );
            }
        }
    } );

    // Data management
    document.getElementById( 'export-json' ).addEventListener( 'click', exportJSON );
    document.getElementById( 'import-json' ).addEventListener( 'click', () =>
    {
        document.getElementById( 'file-input' ).click();
    } );
    document.getElementById( 'file-input' ).addEventListener( 'change', importJSON );
    document.getElementById( 'clear-data' ).addEventListener( 'click', () =>
    {
        if ( confirm( 'Are you sure you want to delete all transactions? This cannot be undone.' ) )
        {
            State.clearAll();
            showStatus( 'All data cleared' );
        }
    } );
};

/**
 * Setup modal dialogs
 */
const setupModals = () =>
{
    const modal = document.getElementById( 'delete-modal' );

    document.getElementById( 'cancel-delete' ).addEventListener( 'click', () =>
    {
        modal.classList.remove( 'show' );
    } );

    document.getElementById( 'confirm-delete' ).addEventListener( 'click', () =>
    {
        if ( deleteCallback )
        {
            deleteCallback();
        }
        modal.classList.remove( 'show' );
    } );

    // Close modal on escape key
    document.addEventListener( 'keydown', ( e ) =>
    {
        if ( e.key === 'Escape' && modal.classList.contains( 'show' ) )
        {
            modal.classList.remove( 'show' );
        }
    } );

    // Close modal on backdrop click
    modal.addEventListener( 'click', ( e ) =>
    {
        if ( e.target === modal )
        {
            modal.classList.remove( 'show' );
        }
    } );
};

/**
 * Show delete confirmation modal
 */
const showDeleteModal = ( callback ) =>
{
    deleteCallback = callback;
    document.getElementById( 'delete-modal' ).classList.add( 'show' );
    document.getElementById( 'confirm-delete' ).focus();
};

/**
 * Show status message
 */
const showStatus = ( message ) =>
{
    const statusEl = document.getElementById( 'status-message' );
    statusEl.textContent = message;
    statusEl.classList.add( 'show' );

    setTimeout( () =>
    {
        statusEl.classList.remove( 'show' );
    }, 3000 );
};

/**
 * Update categories in form and settings
 */
const updateCategories = () =>
{
    const categories = State.getCategories();
    const select = document.getElementById( 'category' );
    const listEl = document.getElementById( 'categories-list' );

    // Update form dropdown
    select.innerHTML = '<option value="">Select category</option>';
    categories.forEach( cat =>
    {
        const option = document.createElement( 'option' );
        option.value = cat;
        option.textContent = cat;
        select.appendChild( option );
    } );

    // Update settings list
    listEl.innerHTML = categories.map( cat => `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem; border-bottom: 1px solid var(--border);">
            <span class="category-badge" style="background: hsl(${ hashCode( cat ) % 360 }, 70%, 85%);">${ cat }</span>
            ${ cat !== 'Other' ? `<button class="icon-btn delete" data-category="${ cat }" aria-label="Delete ${ cat } category">✕</button>` : '' }
        </div>
    `).join( '' );

    // Add delete handlers
    listEl.querySelectorAll( '.icon-btn.delete' ).forEach( btn =>
    {
        btn.addEventListener( 'click', () =>
        {
            const categoryName = btn.dataset.category;
            if ( confirm( `Delete category "${ categoryName }"? Transactions in this category will be moved to "Other".` ) )
            {
                State.deleteCategory( categoryName );
                updateCategories();
                showStatus( `Category "${ categoryName }" deleted` );
            }
        } );
    } );
};

/**
 * Render transactions table
 */
const renderTransactions = () =>
{
    const tbody = document.getElementById( 'transactions-body' );
    const searchInput = document.getElementById( 'search-input' ).value;
    const caseInsensitive = document.getElementById( 'case-insensitive' ).checked;

    let transactions = State.getTransactions();

    // Apply search filter
    transactions = Search.searchTransactions( transactions, searchInput, caseInsensitive );

    // Apply sorting
    transactions = sortTransactions( transactions );

    if ( transactions.length === 0 )
    {
        tbody.innerHTML = '<tr><td colspan="5" class="empty-state">No transactions found</td></tr>';
        return;
    }

    tbody.innerHTML = transactions.map( t => `
        <tr>
            <td>${ t.date }</td>
            <td>${ Search.highlightMatches( t.description, searchInput, caseInsensitive ) }</td>
            <td>
                <span class="category-badge" style="background: hsl(${ hashCode( t.category ) % 360 }, 70%, 85%);">
                    ${ Search.highlightMatches( t.category, searchInput, caseInsensitive ) }
                </span>
            </td>
            <td>${ t.amount.toFixed( 2 ) }</td>
            <td class="actions">
                <button class="icon-btn" data-id="${ t.id }" data-action="edit" aria-label="Edit transaction">✏️</button>
                <button class="icon-btn delete" data-id="${ t.id }" data-action="delete" aria-label="Delete transaction">🗑️</button>
            </td>
        </tr>
    `).join( '' );

    // Add event listeners to action buttons
    tbody.querySelectorAll( '.icon-btn' ).forEach( btn =>
    {
        btn.addEventListener( 'click', () =>
        {
            const id = btn.dataset.id;
            const action = btn.dataset.action;

            if ( action === 'edit' )
            {
                editTransaction( id );
            } else if ( action === 'delete' )
            {
                showDeleteModal( () =>
                {
                    State.deleteTransaction( id );
                    showStatus( 'Transaction deleted' );
                } );
            }
        } );
    } );
};

/**
 * Sort transactions
 */
const sortTransactions = ( transactions ) =>
{
    return [ ...transactions ].sort( ( a, b ) =>
    {
        let aVal = a[ currentSort.field ];
        let bVal = b[ currentSort.field ];

        if ( currentSort.field === 'amount' )
        {
            aVal = parseFloat( aVal );
            bVal = parseFloat( bVal );
        } else if ( currentSort.field === 'description' || currentSort.field === 'category' )
        {
            aVal = aVal.toLowerCase();
            bVal = bVal.toLowerCase();
        }

        if ( aVal < bVal ) return currentSort.direction === 'asc' ? -1 : 1;
        if ( aVal > bVal ) return currentSort.direction === 'asc' ? 1 : -1;
        return 0;
    } );
};

/**
 * Edit transaction
 */
const editTransaction = ( id ) =>
{
    const transaction = State.getTransactionById( id );

    if ( transaction )
    {
        document.getElementById( 'edit-id' ).value = transaction.id;
        document.getElementById( 'description' ).value = transaction.description;
        document.getElementById( 'amount' ).value = transaction.amount;
        document.getElementById( 'category' ).value = transaction.category;
        document.getElementById( 'date' ).value = transaction.date;
        document.getElementById( 'form-title' ).textContent = 'Edit Transaction';
        document.getElementById( 'cancel-edit' ).style.display = 'inline-flex';

        // Switch to add transaction tab
        document.getElementById( 'tab-add' ).click();

        // Focus on description field
        document.getElementById( 'description' ).focus();
    }
};

/**
 * Render dashboard
 */
const renderDashboard = () =>
{
    const stats = State.getStats();
    const budget = State.getBudget();
    const transactions = State.getTransactions();

    // Update stat cards
    document.getElementById( 'stat-total' ).textContent = stats.total;
    document.getElementById( 'stat-spent' ).textContent = `${ stats.spent.toFixed( 2 ) }`;
    document.getElementById( 'stat-top-category' ).textContent =
        stats.topCategory ? stats.topCategory.name : '—';
    document.getElementById( 'stat-week' ).textContent = `${ stats.weekSpent.toFixed( 2 ) }`;

    // Update budget overview
    const budgetOverview = document.getElementById( 'budget-overview' );
    const remaining = stats.remaining;
    const percentage = Math.min( stats.percentageUsed, 100 );

    let statusClass = '';
    let statusText = '';
    let liveRegion = 'polite';

    if ( stats.spent > budget )
    {
        statusClass = 'danger';
        statusText = `Over budget by ${ Math.abs( remaining ).toFixed( 2 ) }`;
        liveRegion = 'assertive';
    } else if ( percentage >= 80 )
    {
        statusClass = 'warning';
        statusText = `${ remaining.toFixed( 2 ) } remaining`;
    } else
    {
        statusClass = '';
        statusText = `${ remaining.toFixed( 2 ) } remaining`;
    }

    budgetOverview.setAttribute( 'aria-live', liveRegion );
    budgetOverview.innerHTML = `
        <p style="margin-bottom: 0.5rem;">
            Monthly Budget: ${ budget.toFixed( 2 ) } | Spent: ${ stats.spent.toFixed( 2 ) }
        </p>
        <div class="progress-bar">
            <div class="progress-fill ${ statusClass }" style="width: ${ percentage }%;">
                ${ percentage.toFixed( 0 ) }%
            </div>
        </div>
        <p style="margin-top: 0.5rem; font-weight: 500;">${ statusText }</p>
    `;

    // Update recent transactions
    const recentEl = document.getElementById( 'recent-transactions' );
    const recent = transactions.slice( -5 ).reverse();

    if ( recent.length === 0 )
    {
        recentEl.innerHTML = '<p class="empty-state">No transactions yet. Add your first transaction to get started!</p>';
    } else
    {
        recentEl.innerHTML = recent.map( t => `
            <div style="display: flex; justify-content: space-between; padding: 0.75rem; border-bottom: 1px solid var(--border);">
                <div>
                    <strong>${ t.description }</strong>
                    <div style="font-size: 0.875rem; color: var(--text-secondary);">
                        ${ t.date } • ${ t.category }
                    </div>
                </div>
                <div style="font-weight: 600; color: var(--primary);">
                    ${ t.amount.toFixed( 2 ) }
                </div>
            </div>
        `).join( '' );
    }

    // Update settings values
    document.getElementById( 'monthly-budget' ).value = budget;

    const rates = State.getRates();
    document.getElementById( 'rate-eur' ).value = rates.EUR;
    document.getElementById( 'rate-gbp' ).value = rates.GBP;
    document.getElementById( 'base-currency' ).value = State.getBaseCurrency();
};

/**
 * Export data as JSON
 */
const exportJSON = () =>
{
    const transactions = State.getTransactions();
    const dataStr = JSON.stringify( transactions, null, 2 );
    const blob = new Blob( [ dataStr ], { type: 'application/json' } );
    const url = URL.createObjectURL( blob );
    const a = document.createElement( 'a' );
    a.href = url;
    a.download = `finance-tracker-${ new Date().toISOString().split( 'T' )[ 0 ] }.json`;
    a.click();
    URL.revokeObjectURL( url );
    showStatus( 'Data exported successfully' );
};

/**
 * Import data from JSON file
 */
const importJSON = ( e ) =>
{
    const file = e.target.files[ 0 ];
    if ( !file ) return;

    const reader = new FileReader();
    reader.onload = ( event ) =>
    {
        try
        {
            const data = JSON.parse( event.target.result );
            const validation = Validators.validateJSON( data );

            if ( !validation.valid )
            {
                alert( 'Invalid JSON: ' + validation.message );
                return;
            }

            if ( confirm( 'This will replace all existing transactions. Continue?' ) )
            {
                State.importData( data );
                showStatus( 'Data imported successfully' );
            }
        } catch ( error )
        {
            alert( 'Error parsing JSON file: ' + error.message );
        }

        // Reset file input
        e.target.value = '';
    };

    reader.onerror = () =>
    {
        alert( 'Error reading file' );
        e.target.value = '';
    };

    reader.readAsText( file );
};

/**
 * Generate hash code for string (for color generation)
 */
const hashCode = ( str ) =>
{
    let hash = 0;
    for ( let i = 0; i < str.length; i++ )
    {
        hash = str.charCodeAt( i ) + ( ( hash << 5 ) - hash );
    }
    return Math.abs( hash );
};

/**
 * Main render function
 */
const render = () =>
{
    renderDashboard();
    renderTransactions();
};

export { init, render };