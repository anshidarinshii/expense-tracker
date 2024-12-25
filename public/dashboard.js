// Fetch user data from localStorage (or sessionStorage) to maintain the session
const user = JSON.parse(localStorage.getItem('user'));

if (user) {
    // Display username dynamically
    document.getElementById('username').textContent = user.username;

    // Set the currency selector to the stored value or default to USD
    const currencySelector = document.getElementById('currency');
    currencySelector.value = localStorage.getItem('currency') || 'USD';

    // Fetch user's transaction data and update the summary
    fetch(`http://localhost:3000/transactions/${user.id}`)
        .then(response => response.json())
        .then(transactions => {
            let totalIncome = 0;
            let totalExpense = 0;
            let balance = 0;

            transactions.forEach(transaction => {
                if (transaction.amount > 0) {
                    totalIncome += transaction.amount;
                } else {
                    totalExpense += Math.abs(transaction.amount);
                }
            });

            balance = totalIncome - totalExpense;

            // Update the summary dynamically
            document.getElementById('total-income-value').textContent = totalIncome.toFixed(2);
            document.getElementById('total-expense-value').textContent = totalExpense.toFixed(2);
            document.getElementById('balance-value').textContent = balance.toFixed(2);

            // Update the currency short form for all summary elements
            const currency = currencySelector.value;
            updateCurrencySymbols(currency);
        })
        .catch(err => console.error('Error fetching transactions:', err));
} else {
    // If no user data found, redirect to login
    window.location.href = '/';
}

// Function to update currency symbols dynamically
function updateCurrencySymbols(currency) {
    document.getElementById('total-income-currency').textContent = currency;
    document.getElementById('total-expense-currency').textContent = currency;
    document.getElementById('balance-currency').textContent = currency;
}

// Handle Currency Selector Change
document.getElementById('currency').addEventListener('change', function () {
    const selectedCurrency = this.value;
    localStorage.setItem('currency', selectedCurrency);

    // Update the currency short form across the dashboard
    updateCurrencySymbols(selectedCurrency);
});

// Event listeners for Add Income and Expense buttons
document.getElementById('add-income-btn').addEventListener('click', function () {
    window.location.href = 'add-transaction.html?type=income';
});

document.getElementById('add-expense-btn').addEventListener('click', function () {
    window.location.href = 'add-transaction.html?type=expense';
});
