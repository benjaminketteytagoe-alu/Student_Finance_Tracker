// Main application logic

import { state } from './state.js';
import { renderPage, renderDashboard, renderRecords, renderForm, clearForm, clearFormErrors, renderSettings } from './ui.js';
import { validateDescription, validateAmount, validateDate, validateCategory } from './validators.js';
import { searchWithRegex } from './search.js';
import { exportData, importData } from './storage.js';

// Load seed data if no transactions exist
const loadSeedDataIfNeeded = async () =>
{
    if ( state.transactions.length === 0 )
    {
        try
        {
            const response = await fetch( './seed.json' );
            const seedData = await response.json();
            seedData.forEach( transaction =>
            {
                state.addTransaction( transaction );
            } );
        } catch ( error )
        {
            console.log( 'No seed data loaded' );
        }
    }
};

// Initialize app
const init = async () =>
{
    // Load seed data if needed
    await loadSeedDataIfNeeded();

    // Subscribe to state changes
    state.subscribe( () =>
    {
        if ( state.currentPage === 'dashboard' )
        {
            renderDashboard();
        } else if ( state.currentPage === 'records' )
        {
            renderRecords();
        }
    } );

    // Set up navigation
    setupNavigation();

    // Set up page-specific handlers
    setupDashboard();
    setupRecords();
    setupForm();
    setupSettings();

    // Initial render
    renderPage();
    renderDashboard();
    renderRecords();
    renderForm();
    renderSettings();
};

// Navigation
const setupNavigation = () =>
{
    // Desktop navigation
    document.querySelectorAll( '.nav-link' ).forEach( link =>
    {
        link.addEventListener( 'click', ( e ) =>
        {
            e.preventDefault();
            state.currentPage = link.dataset.page;
            renderPage();

            if ( state.currentPage === 'dashboard' ) renderDashboard();
            if ( state.currentPage === 'records' ) renderRecords();
            if ( state.currentPage === 'add-transaction' )
            {
                clearForm();
                renderForm();
            }
            if ( state.currentPage === 'settings' ) renderSettings();

            // Close mobile menu
            document.querySelector( '.nav-list' ).classList.remove( 'active' );
        } );
    } );

    // Mobile menu toggle
    const navToggle = document.querySelector( '.nav-toggle' );
    navToggle.addEventListener( 'click', () =>
    {
        const navList = document.querySelector( '.nav-list' );
        const isActive = navList.classList.toggle( 'active' );
        navToggle.setAttribute( 'aria-expanded', isActive );
    } );
};

// Dashboard
const setupDashboard = () =>
{
    // Dashboard updates automatically via state subscription
};

// Records
const setupRecords = () =>
{
    const searchInput = document.getElementById( 'regex-search' );
    const caseSensitive = document.getElementById( 'case-sensitive' );
    const sortBy = document.getElementById( 'sort-by' );
    const searchError = document.getElementById( 'search-error' );

    const performSearch = () =>
    {
        const pattern = searchInput.value.trim();
        const isCaseSensitive = caseSensitive.checked;

        if ( pattern )
        {
            const result = searchWithRegex( 'test', pattern, isCaseSensitive );
            if ( result.error )
            {
                searchError.textContent = result.error;
                return;
            }
        }

        searchError.textContent = '';
        renderRecords( pattern, isCaseSensitive );
    };

    searchInput.addEventListener( 'input', performSearch );
    caseSensitive.addEventListener( 'change', performSearch );
    sortBy.addEventListener( 'change', performSearch );

    // Edit and delete handlers (event delegation)
    document.getElementById( 'records-container' ).addEventListener( 'click', ( e ) =>
    {
        if ( e.target.dataset.edit )
        {
            state.editingId = e.target.dataset.edit;
            state.currentPage = 'add-transaction';
            renderPage();
            renderForm();
        }

        if ( e.target.dataset.delete )
        {
            state.deleteId = e.target.dataset.delete;
            showDeleteModal();
        }
    } );

    // Delete modal
    document.getElementById( 'confirm-delete' ).addEventListener( 'click', () =>
    {
        if ( state.deleteId )
        {
            state.deleteTransaction( state.deleteId );
            hideDeleteModal();
            renderRecords();
        }
    } );

    document.getElementById( 'cancel-delete' ).addEventListener( 'click', hideDeleteModal );

    document.getElementById( 'delete-modal' ).addEventListener( 'click', ( e ) =>
    {
        if ( e.target.id === 'delete-modal' )
        {
            hideDeleteModal();
        }
    } );
};

const showDeleteModal = () =>
{
    const modal = document.getElementById( 'delete-modal' );
    modal.hidden = false;
    document.getElementById( 'confirm-delete' ).focus();
};

const hideDeleteModal = () =>
{
    document.getElementById( 'delete-modal' ).hidden = true;
    state.deleteId = null;
};

// Form
const setupForm = () =>
{
    const form = document.getElementById( 'transaction-form' );

    form.addEventListener( 'submit', ( e ) =>
    {
        e.preventDefault();
        clearFormErrors();

        const description = document.getElementById( 'description' ).value;
        const amount = document.getElementById( 'amount' ).value;
        const category = document.getElementById( 'category' ).value;
        const date = document.getElementById( 'date' ).value;
        const editId = document.getElementById( 'edit-id' ).value;

        // Validate all fields
        let isValid = true;

        const descValidation = validateDescription( description );
        if ( !descValidation.isValid )
        {
            showFieldError( 'description', descValidation.message );
            isValid = false;
        }

        const amountValidation = validateAmount( amount );
        if ( !amountValidation.isValid )
        {
            showFieldError( 'amount', amountValidation.message );
            isValid = false;
        }

        const categoryValidation = validateCategory( category );
        if ( !categoryValidation.isValid )
        {
            showFieldError( 'category', categoryValidation.message );
            isValid = false;
        }

        const dateValidation = validateDate( date );
        if ( !dateValidation.isValid )
        {
            showFieldError( 'date', dateValidation.message );
            isValid = false;
        }

        if ( !isValid ) return;

        // Save transaction
        const transactionData = {
            description: description.trim(),
            amount: parseFloat( amount ),
            category: category.trim(),
            date: date,
        };

        if ( editId )
        {
            state.updateTransaction( editId, transactionData );
        } else
        {
            state.addTransaction( transactionData );
        }

        clearForm();
        state.currentPage = 'records';
        renderPage();
        renderRecords();
    } );

    document.getElementById( 'cancel-edit' ).addEventListener( 'click', () =>
    {
        clearForm();
        renderForm();
    } );
};

const showFieldError = ( fieldId, message ) =>
{
    const errorEl = document.getElementById( `${ fieldId }-error` );
    const inputEl = document.getElementById( fieldId );

    errorEl.textContent = message;
    inputEl.style.borderColor = 'var(--danger-500)';
};

// Settings
const setupSettings = () =>
{
    // Save budget
    document.getElementById( 'save-budget' ).addEventListener( 'click', () =>
    {
        const budget = parseFloat( document.getElementById( 'monthly-budget' ).value );
        if ( budget > 0 )
        {
            state.updateSettings( { monthlyBudget: budget } );
            alert( 'Budget saved successfully!' );
        }
    } );

    // Save currency settings
    document.getElementById( 'save-currency' ).addEventListener( 'click', () =>
    {
        const baseCurrency = document.getElementById( 'base-currency' ).value;
        const currencies = {};

        Object.keys( state.settings.currencies ).forEach( code =>
        {
            const rate = parseFloat( document.getElementById( `rate-${ code }` ).value );
            currencies[ code ] = rate;
        } );

        state.updateSettings( { baseCurrency, currencies } );
        alert( 'Currency settings saved successfully!' );
    } );

    // Add category
    document.getElementById( 'add-category' ).addEventListener( 'click', () =>
    {
        const input = document.getElementById( 'new-category' );
        const category = input.value.trim();

        const validation = validateCategory( category );
        if ( validation.isValid )
        {
            state.addCategory( category );
            input.value = '';
            renderSettings();
        } else
        {
            alert( validation.message );
        }
    } );

    // Remove category (event delegation)
    document.getElementById( 'categories-list' ).addEventListener( 'click', ( e ) =>
    {
        const category = e.target.dataset.removeCategory;
        if ( category )
        {
            if ( confirm( `Remove category "${ category }"?` ) )
            {
                state.removeCategory( category );
                renderSettings();
            }
        }
    } );

    // Export data
    document.getElementById( 'export-data' ).addEventListener( 'click', () =>
    {
        const data = exportData();
        const blob = new Blob( [ data ], { type: 'application/json' } );
        const url = URL.createObjectURL( blob );
        const a = document.createElement( 'a' );
        a.href = url;
        a.download = `finance-tracker-${ new Date().toISOString().split( 'T' )[ 0 ] }.json`;
        a.click();
        URL.revokeObjectURL( url );
    } );

    // Import data
    document.getElementById( 'import-file' ).addEventListener( 'change', ( e ) =>
    {
        const file = e.target.files[ 0 ];
        if ( !file ) return;

        const reader = new FileReader();
        reader.onload = ( event ) =>
        {
            const result = importData( event.target.result );
            const statusEl = document.getElementById( 'import-status' );

            if ( result.success )
            {
                statusEl.textContent = result.message;
                statusEl.style.color = 'var(--success-500)';

                // Reload entire app state by reinitializing
                window.location.reload();
            } else
            {
                statusEl.textContent = result.message;
                statusEl.style.color = 'var(--danger-500)';
            }

            setTimeout( () =>
            {
                statusEl.textContent = '';
            }, 3000 );
        };

        reader.readAsText( file );
        e.target.value = ''; // Reset input
    } );
};

// Start app
init();
