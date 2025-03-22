document.getElementById('expenseForm').addEventListener('submit', function(e) {
    e.preventDefault();

    let category = document.getElementById('category').value;
    let amount = parseFloat(document.getElementById('amount').value);
    let date = document.getElementById('date').value;

    fetch('http://localhost:5000/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: 1, category, amount, date })
    })
    .then(response => response.json())
    .then(() => {
        fetchExpenses();
        updateBalance();
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

        let totalSpending = 0;

        data.forEach(expense => {
            let item = document.createElement('li');
            item.textContent = `${expense.category}: ₹${expense.amount} (${expense.date})`;
            list.appendChild(item);
            totalSpending += parseFloat(expense.amount);
        });

        document.getElementById('totalSpending').textContent = totalSpending.toFixed(2);
        checkBudgetAlerts(totalSpending);
    })
    .catch(error => console.error('Error fetching expenses:', error));
}

function setBudget() {
    let dailyBudget = parseFloat(document.getElementById('dailyBudget').value) || 0;
    let weeklyBudget = parseFloat(document.getElementById('weeklyBudget').value) || 0;
    let monthlyBudget = parseFloat(document.getElementById('monthlyBudget').value) || 0;

    if (dailyBudget > weeklyBudget) {
        alert("❌ Daily budget cannot be more than the weekly budget!");
        return;
    }

    if (weeklyBudget > monthlyBudget) {
        alert("❌ Weekly budget cannot be more than the monthly budget!");
        return;
    }

    localStorage.setItem('dailyBudget', dailyBudget);
    localStorage.setItem('weeklyBudget', weeklyBudget);
    localStorage.setItem('monthlyBudget', monthlyBudget);

    updateBalance();
    alert("✅ Budget saved successfully!");
}

function updateBalance() {
    let totalSpending = parseFloat(document.getElementById('totalSpending').textContent) || 0;
    let dailyBudget = parseFloat(localStorage.getItem('dailyBudget')) || 0;
    let weeklyBudget = parseFloat(localStorage.getItem('weeklyBudget')) || 0;
    let monthlyBudget = parseFloat(localStorage.getItem('monthlyBudget')) || 0;

    document.getElementById('dailyBalance').textContent = (dailyBudget - totalSpending).toFixed(2);
    document.getElementById('weeklyBalance').textContent = (weeklyBudget - totalSpending).toFixed(2);
    document.getElementById('monthlyBalance').textContent = (monthlyBudget - totalSpending).toFixed(2);
}

function checkBudgetAlerts(totalSpending) {
    let dailyBudget = parseFloat(localStorage.getItem('dailyBudget')) || 0;
    let weeklyBudget = parseFloat(localStorage.getItem('weeklyBudget')) || 0;
    let monthlyBudget = parseFloat(localStorage.getItem('monthlyBudget')) || 0;

    if (totalSpending >= dailyBudget * 0.8) alert('⚠️ Warning: You are close to exceeding your daily budget!');
    if (totalSpending >= weeklyBudget * 0.8) alert('⚠️ Warning: You are close to exceeding your weekly budget!');
    if (totalSpending >= monthlyBudget * 0.8) alert('⚠️ Warning: You are close to exceeding your monthly budget!');
}

fetchExpenses();
