// Fetch the logged-in user's data from localStorage
const user = JSON.parse(localStorage.getItem('user'));

if (user) {
    // Fetch user's transaction data from the API
    fetch(`http://localhost:3000/transactions/${user.id}`)
        .then((response) => response.json())
        .then((transactions) => {
            const tableBody = document.getElementById('transaction-table-body');

            if (transactions.length > 0) {
                // Clear existing rows (if any)
                tableBody.innerHTML = '';

                // Loop through each transaction and create a table row
                transactions.forEach((transaction) => {
                    const row = document.createElement('tr');

                    // Create table cells
                    const amountCell = document.createElement('td');
                    const descriptionCell = document.createElement('td');
                    const dateCell = document.createElement('td');

                    // Format transaction amount
                    amountCell.textContent = `${transaction.amount > 0 ? '+' : '-'}${Math.abs(
                        transaction.amount
                    ).toFixed(2)} ${localStorage.getItem('currency') || 'USD'}`;

                    // Add description
                    descriptionCell.textContent = transaction.description;

                    // Format date
                    const formattedDate = new Date(transaction.date).toLocaleDateString();
                    dateCell.textContent = formattedDate;

                    // Append cells to the row
                    row.appendChild(amountCell);
                    row.appendChild(descriptionCell);
                    row.appendChild(dateCell);

                    // Append the row to the table body
                    tableBody.appendChild(row);
                });
            } else {
                // No transactions found, display a placeholder message
                tableBody.innerHTML = `<tr><td colspan="3">No transactions found.</td></tr>`;
            }
        })
        .catch((err) => {
            console.error('Error fetching transactions:', err);
            document.getElementById('transaction-table-body').innerHTML =
                '<tr><td colspan="3">Error loading transactions.</td></tr>';
        });
} else {
    // If user is not logged in, redirect to login page
    window.location.href = '/';
}
