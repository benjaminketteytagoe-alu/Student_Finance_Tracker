// DOM manipulation and UI rendering

import { state } from './state.js';
import { filterTransactions, highlightMatches } from './search.js';

// Navigation
export const renderNavigation = () =>
{
    const navLinks = document.querySelectorAll( '.nav-link' );
    navLinks.forEach( link =>
    {
        link.classList.toggle( 'active', link.dataset.page === state.currentPage );
    } );
};

export const renderPage = () =>
{
    const pages = document.querySelectorAll( '.page' );
    pages.forEach( page =>
    {
        page.classList.toggle( 'active', page.id === `${ state.currentPage }-page` );
    } );
    renderNavigation();
};

// Dashboard
export const renderDashboard = () =>
{
    renderStats();
    renderBudgetStatus();
    renderCategoryBreakdown();
    renderTrendChart();
};

const renderStats = () =>
{
    const container = document.getElementById( 'stats-grid' );
    const totalSpent = state.getTotalSpent();
    const monthSpent = state.getSpentThisMonth();
    const totalTransactions = state.transactions.length;
    const avgTransaction = totalTransactions > 0 ? totalSpent / totalTransactions : 0;

    container.innerHTML = `
    <div class="stat-card">
      <div class="stat-label">Total Spent</div>
      <div class="stat-value">$${ totalSpent.toFixed( 2 ) }</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">This Month</div>
      <div class="stat-value">$${ monthSpent.toFixed( 2 ) }</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Total Transactions</div>
      <div class="stat-value">${ totalTransactions }</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Average per Transaction</div>
      <div class="stat-value">$${ avgTransaction.toFixed( 2 ) }</div>
    </div>
  `;
};

const renderBudgetStatus = () =>
{
    const container = document.getElementById( 'budget-status' );
    const status = state.getBudgetStatus();

    container.className = `budget-status ${ status.status }`;
    container.innerHTML = `
    <strong>Budget Status:</strong> ${ status.message }
    <div style="margin-top: 0.5rem;">
      <small>Spent: $${ status.spent.toFixed( 2 ) } / $${ state.settings.monthlyBudget.toFixed( 2 ) }</small>
    </div>
  `;
};

const renderCategoryBreakdown = () =>
{
    const container = document.getElementById( 'category-breakdown' );
    const spending = state.getSpendingByCategory();
    const sorted = Object.entries( spending ).sort( ( a, b ) => b[ 1 ] - a[ 1 ] );

    if ( sorted.length === 0 )
    {
        container.innerHTML = '<p>No transactions yet.</p>';
        return;
    }

    container.innerHTML = sorted.map( ( [ category, amount ] ) => `
    <div class="category-item">
      <span>${ category }</span>
      <strong>$${ amount.toFixed( 2 ) }</strong>
    </div>
  `).join( '' );
};

const renderTrendChart = () =>
{
    const container = document.getElementById( 'trend-chart' );
    const trend = state.getLast7DaysTrend();
    const maxAmount = Math.max( ...trend.map( d => d.amount ), 1 );

    container.innerHTML = trend.map( day =>
    {
        const percentage = ( day.amount / maxAmount ) * 100;
        const date = new Date( day.date );
        const label = date.toLocaleDateString( 'en-US', { weekday: 'short' } );

        return `
      <div class="trend-bar">
        <span class="trend-label">${ label }</span>
        <div class="trend-bar-fill" style="width: ${ percentage }%"></div>
        <span style="margin-left: 0.5rem; font-size: 0.875rem;">$${ day.amount.toFixed( 2 ) }</span>
      </div>
    `;
    } ).join( '' );
};

// Records
export const renderRecords = ( searchPattern = '', caseSensitive = false ) =>
{
    const container = document.getElementById( 'records-container' );
    const sortBy = document.getElementById( 'sort-by' ).value;

    let transactions = [ ...state.transactions ];

    // Apply search filter
    if ( searchPattern )
    {
        transactions = filterTransactions( transactions, searchPattern, caseSensitive );
    }

    // Apply sorting
    transactions = sortTransactions( transactions, sortBy );

    if ( transactions.length === 0 )
    {
        container.innerHTML = '<p style="text-align: center; padding: 2rem;">No transactions found.</p>';
        return;
    }

    // Desktop table view
    const tableHTML = `
    <div class="records-table">
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Category</th>
            <th>Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${ transactions.map( t => `
            <tr>
              <td>${ t.date }</td>
              <td>${ searchPattern ? highlightMatches( t.description, searchPattern, caseSensitive ) : t.description }</td>
              <td>${ searchPattern ? highlightMatches( t.category, searchPattern, caseSensitive ) : t.category }</td>
              <td>$${ t.amount.toFixed( 2 ) }</td>
              <td>
                <div class="record-actions">
                  <button class="btn btn-small btn-secondary" data-edit="${ t.id }">Edit</button>
                  <button class="btn btn-small btn-danger" data-delete="${ t.id }">Delete</button>
                </div>
              </td>
            </tr>
          `).join( '' ) }
        </tbody>
      </table>
    </div>
  `;

    // Mobile card view
    const cardsHTML = `
    <div class="records-cards">
      ${ transactions.map( t => `
        <div class="record-card">
          <div class="record-card-header">
            <div class="record-card-title">${ searchPattern ? highlightMatches( t.description, searchPattern, caseSensitive ) : t.description }</div>
            <div class="record-actions">
              <button class="btn btn-small btn-secondary" data-edit="${ t.id }">Edit</button>
              <button class="btn btn-small btn-danger" data-delete="${ t.id }">Delete</button>
            </div>
          </div>
          <div class="record-card-body">
            <div class="record-card-field">
              <span class="record-card-label">Date:</span>
              <span>${ t.date }</span>
            </div>
            <div class="record-card-field">
              <span class="record-card-label">Category:</span>
              <span>${ searchPattern ? highlightMatches( t.category, searchPattern, caseSensitive ) : t.category }</span>
            </div>
            <div class="record-card-field">
              <span class="record-card-label">Amount:</span>
              <strong>$${ t.amount.toFixed( 2 ) }</strong>
            </div>
          </div>
        </div>
      `).join( '' ) }
    </div>
  `;

    container.innerHTML = tableHTML + cardsHTML;
};

const sortTransactions = ( transactions, sortBy ) =>
{
    const sorted = [ ...transactions ];

    switch ( sortBy )
    {
        case 'date-desc':
            return sorted.sort( ( a, b ) => new Date( b.date ) - new Date( a.date ) );
        case 'date-asc':
            return sorted.sort( ( a, b ) => new Date( a.date ) - new Date( b.date ) );
        case 'amount-desc':
            return sorted.sort( ( a, b ) => b.amount - a.amount );
        case 'amount-asc':
            return sorted.sort( ( a, b ) => a.amount - b.amount );
        case 'description-asc':
            return sorted.sort( ( a, b ) => a.description.localeCompare( b.description ) );
        case 'description-desc':
            return sorted.sort( ( a, b ) => b.description.localeCompare( a.description ) );
        default:
            return sorted;
    }
};

// Form
export const renderForm = () =>
{
    const categorySelect = document.getElementById( 'category' );
    categorySelect.innerHTML = '<option value="">Select category...</option>' +
        state.settings.categories.map( cat => `<option value="${ cat }">${ cat }</option>` ).join( '' );

    if ( state.editingId )
    {
        const transaction = state.getTransaction( state.editingId );
        if ( transaction )
        {
            document.getElementById( 'form-title' ).textContent = 'Edit Transaction';
            document.getElementById( 'edit-id' ).value = transaction.id;
            document.getElementById( 'description' ).value = transaction.description;
            document.getElementById( 'amount' ).value = transaction.amount;
            document.getElementById( 'category' ).value = transaction.category;
            document.getElementById( 'date' ).value = transaction.date;
            document.getElementById( 'cancel-edit' ).style.display = 'inline-block';
        }
    } else
    {
        document.getElementById( 'form-title' ).textContent = 'Add Transaction';
        document.getElementById( 'edit-id' ).value = '';
        document.getElementById( 'cancel-edit' ).style.display = 'none';
    }
};

export const clearForm = () =>
{
    document.getElementById( 'transaction-form' ).reset();
    state.editingId = null;
    clearFormErrors();
};

export const clearFormErrors = () =>
{
    document.querySelectorAll( '.error-message' ).forEach( el => el.textContent = '' );
    document.querySelectorAll( 'input, select' ).forEach( el =>
    {
        el.style.borderColor = '';
    } );
};

// Settings
export const renderSettings = () =>
{
    document.getElementById( 'monthly-budget' ).value = state.settings.monthlyBudget;
    document.getElementById( 'base-currency' ).value = state.settings.baseCurrency;

    renderCurrencyRates();
    renderCategories();
};

const renderCurrencyRates = () =>
{
    const container = document.getElementById( 'currency-rates' );
    const currencies = Object.entries( state.settings.currencies );

    container.innerHTML = `
    <div style="margin-top: 1rem;">
      ${ currencies.map( ( [ code, rate ] ) => `
        <div class="form-group">
          <label for="rate-${ code }">${ code } Rate:</label>
          <input type="number" id="rate-${ code }" value="${ rate }" step="0.01" min="0">
        </div>
      `).join( '' ) }
    </div>
  `;
};

const renderCategories = () =>
{
    const container = document.getElementById( 'categories-list' );

    container.innerHTML = `
    <div class="categories-list">
      ${ state.settings.categories.map( cat => `
        <span class="category-badge">
          ${ cat }
          <button data-remove-category="${ cat }" aria-label="Remove ${ cat }">×</button>
        </span>
      `).join( '' ) }
    </div>
  `;
};
