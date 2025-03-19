document.getElementById('expenseForm').addEventListener('submit', function(e) {
    e.preventDefault();

    let category = document.getElementById('category').value;
    let amount = document.getElementById('amount').value;
    let date = document.getElementById('date').value;

    fetch('http://localhost:5000/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: 1, category, amount, date })
    })
    .then(response => response.json())
    .then(() => {
        fetchExpenses();
        document.getElementById('expenseForm').reset();
    })
    .catch(error => console.error('Error:', error));
});

function fetchExpenses() {
    fetch('http://localhost:5000/expenses')
    .then(response => response.json())
    .then(data => {
        let list = document.getElementById('expenseList');
        list.innerHTML = '';

        data.forEach(expense => {
            let item = document.createElement('li');
            item.textContent = `${expense.category}: $${expense.amount} (${expense.date})`;
            list.appendChild(item);
        });
    })
    .catch(error => console.error('Error fetching expenses:', error));
}

fetchExpenses();
