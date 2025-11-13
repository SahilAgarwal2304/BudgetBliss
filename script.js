// Utility functions for localStorage
const Storage = {
    getTransactions() {
        return JSON.parse(localStorage.getItem('transactions')) || [];
    },
    
    saveTransactions(transactions) {
        localStorage.setItem('transactions', JSON.stringify(transactions));
    },
    
    addTransaction(transaction) {
        const transactions = this.getTransactions();
        transaction.id = Date.now() + Math.random();
        transaction.date = new Date().toISOString();
        transactions.push(transaction);
        this.saveTransactions(transactions);
        return transaction;
    },
    
    deleteTransaction(id) {
        const transactions = this.getTransactions();
        const filtered = transactions.filter(t => t.id !== id);
        this.saveTransactions(filtered);
        return filtered;
    },
    
    getTransactionsByType(type) {
        const transactions = this.getTransactions();
        if (type === 'income') {
            return transactions.filter(t => t.amount > 0);
        } else if (type === 'expense') {
            return transactions.filter(t => t.amount < 0);
        }
        return transactions;
    },
    
    // Clear all transactions
    clearAllTransactions() {
        localStorage.removeItem('transactions');
        return [];
    }
};

// Storage Monitor Utility
const StorageMonitor = {
    getUsage() {
        let total = 0;
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                total += localStorage[key].length;
            }
        }
        return {
            used: total,
            usedKB: (total / 1024).toFixed(2),
            usedMB: (total / 1024 / 1024).toFixed(2),
            limitMB: 5,
            percentage: ((total / 1024 / 1024) / 5 * 100).toFixed(1)
        };
    },
    
    checkLimit() {
        const usage = this.getUsage();
        
        if (usage.usedMB > 4.5) {
            this.showWarning('CRITICAL: Storage almost full! ' + 
                           `(${usage.usedMB}MB / 5MB used)`);
            return 'critical';
        } else if (usage.usedMB > 3) {
            this.showWarning(`Warning: Storage getting full (${usage.usedMB}MB used)`);
            return 'warning';
        }
        return 'safe';
    },
    
    showWarning(message) {
        let warning = document.getElementById('storage-warning');
        if (!warning) {
            warning = document.createElement('div');
            warning.id = 'storage-warning';
            warning.className = message.includes('CRITICAL') ? 'storage-warning' : 'storage-warning warning';
            document.body.appendChild(warning);
        }
        warning.textContent = message;
        
        if (!message.includes('CRITICAL')) {
            setTimeout(() => {
                warning.remove();
            }, 5000);
        }
    },
    
    estimateRemainingCapacity() {
        const usage = this.getUsage();
        const avgTransactionSize = 100;
        const remainingBytes = (5 * 1024 * 1024) - usage.used;
        return Math.floor(remainingBytes / avgTransactionSize);
    }
};

// Calculate statistics
const Calculator = {
    getTotalBalance(transactions) {
        return transactions.reduce((acc, t) => acc + t.amount, 0);
    },
    
    getTotalIncome(transactions) {
        return transactions
            .filter(t => t.amount > 0)
            .reduce((acc, t) => acc + t.amount, 0);
    },
    
    getTotalExpense(transactions) {
        return (transactions
            .filter(t => t.amount < 0)
            .reduce((acc, t) => acc + t.amount, 0));
    },
    
    getRecentTransactions(transactions, limit = 5) {
        return transactions
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, limit);
    }
};

// Format currency
function formatCurrency(amount) {
    return '₹' + Math.abs(amount).toFixed(2);
}

// Format date
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-IN');
}

// Admin Functions
function toggleAdminDropdown() {
    const dropdown = document.getElementById('admin-dropdown');
    dropdown.classList.toggle('show');
}

// Close dropdown when clicking elsewhere
document.addEventListener('click', function(event) {
    const dropdown = document.getElementById('admin-dropdown');
    const adminBtn = document.querySelector('.admin-btn');
    
    if (adminBtn && !adminBtn.contains(event.target) && dropdown && !dropdown.contains(event.target)) {
        dropdown.classList.remove('show');
    }
});

// Show storage information
function showStorageInfo() {
    const transactions = Storage.getTransactions();
    const incomeTransactions = Storage.getTransactionsByType('income');
    const expenseTransactions = Storage.getTransactionsByType('expense');
    const usage = StorageMonitor.getUsage();
    const remainingCapacity = StorageMonitor.estimateRemainingCapacity();
    
    document.getElementById('total-transactions').textContent = transactions.length;
    document.getElementById('storage-size').textContent = usage.usedKB + ' KB';
    document.getElementById('income-count-storage').textContent = incomeTransactions.length;
    document.getElementById('expense-count-storage').textContent = expenseTransactions.length;
    
    let usageBar = document.getElementById('storage-usage-bar');
    if (!usageBar) {
        usageBar = document.createElement('div');
        usageBar.id = 'storage-usage-bar';
        usageBar.className = 'storage-usage-bar';
        document.getElementById('storage-info').appendChild(usageBar);
    }
    
    usageBar.innerHTML = `
        <div class="usage-fill" style="width: ${usage.percentage}%; background: ${usage.percentage > 90 ? '#ff4444' : usage.percentage > 70 ? '#ffaa00' : '#44ff44'}">
            ${usage.percentage}% Used
        </div>
        <div style="padding: 5px; font-size: 12px;">
            ${usage.usedKB} KB / 5 MB • ~${remainingCapacity} transactions remaining
        </div>
    `;
    
    document.getElementById('storage-info').style.display = 'block';
    toggleAdminDropdown();
}

function hideStorageInfo() {
    document.getElementById('storage-info').style.display = 'none';
}

// Clear all data with confirmation modal
function showClearDataModal() {
    document.getElementById('clear-data-modal').classList.add('show');
    toggleAdminDropdown();
}

function hideClearDataModal() {
    document.getElementById('clear-data-modal').classList.remove('show');
}

function clearAllData() {
    Storage.clearAllTransactions();
    alert('All data has been cleared!');
    hideClearDataModal();
    location.reload();
}

// Dashboard specific functions
function initializeDashboard() {
    updateDashboard();
    StorageMonitor.checkLimit();
}

function updateDashboard() {
    const transactions = Storage.getTransactions();
    const balance = Calculator.getTotalBalance(transactions);
    const income = Calculator.getTotalIncome(transactions);
    const expense = Calculator.getTotalExpense(transactions);
    const recentTransactions = Calculator.getRecentTransactions(transactions, 5);

    document.getElementById('total-balance').textContent = formatCurrency(balance);
    document.getElementById('total-income').textContent = formatCurrency(income);
    document.getElementById('total-expense').textContent = formatCurrency(expense);

    const recentList = document.getElementById('recent-transactions-list');
    if (recentTransactions.length === 0) {
        recentList.innerHTML = '<div class="empty-state">No transactions yet</div>';
    } else {
        recentList.innerHTML = recentTransactions.map(transaction => `
            <div class="transaction-item">
                <div class="transaction-info">
                    <div class="transaction-text">${transaction.text}</div>
                    <div class="transaction-date">${formatDate(transaction.date)}</div>
                </div>
                <div class="transaction-amount ${transaction.amount >= 0 ? 'positive' : 'negative'}">
                    ${transaction.amount >= 0 ? '+' : '-'}${formatCurrency(transaction.amount)}
                </div>
            </div>
        `).join('');
    }
}

// Income page functions
function initializeIncomePage() {
    updateIncomeList();
    StorageMonitor.checkLimit();
    
    const form = document.getElementById('income-form');
    if (form) {
        form.addEventListener('submit', handleIncomeSubmit);
    }
}

function handleIncomeSubmit(e) {
    e.preventDefault();
    const text = document.getElementById('text').value.trim();
    const amount = parseFloat(document.getElementById('amount').value);
    
    if (!text || !amount || amount <= 0) {
        alert('Please enter valid description and positive amount');
        return;
    }
    
    Storage.addTransaction({ text, amount });
    document.getElementById('income-form').reset();
    updateIncomeList();
    alert('Income added successfully!');
}

function updateIncomeList() {
    const incomeTransactions = Storage.getTransactionsByType('income');
    const list = document.getElementById('income-list');
    
    if (incomeTransactions.length === 0) {
        list.innerHTML = '<div class="empty-state">No income transactions yet</div>';
    } else {
        list.innerHTML = incomeTransactions.map(transaction => `
            <div class="transaction-item">
                <div class="transaction-info">
                    <div class="transaction-text">${transaction.text}</div>
                    <div class="transaction-date">${formatDate(transaction.date)}</div>
                </div>
                <div class="transaction-amount positive">
                    +${formatCurrency(transaction.amount)}
                </div>
                <button class="delete-btn" onclick="deleteIncomeTransaction(${transaction.id})">Delete</button>
            </div>
        `).join('');
    }
    
    const totalIncome = Calculator.getTotalIncome(Storage.getTransactions());
    const incomeCount = incomeTransactions.length;
    
    document.getElementById('income-total').textContent = formatCurrency(totalIncome);
    document.getElementById('income-count').textContent = incomeCount;
}

function deleteIncomeTransaction(id) {
    if (confirm('Are you sure you want to delete this income transaction?')) {
        Storage.deleteTransaction(id);
        updateIncomeList();
    }
}

// Expense page functions
function initializeExpensePage() {
    updateExpenseList();
    StorageMonitor.checkLimit();
    
    const form = document.getElementById('expense-form');
    if (form) {
        form.addEventListener('submit', handleExpenseSubmit);
    }
}

function handleExpenseSubmit(e) {
    e.preventDefault();
    const text = document.getElementById('text').value.trim();
    const amount = parseFloat(document.getElementById('amount').value);
    
    if (!text || !amount || amount <= 0) {
        alert('Please enter valid description and positive amount');
        return;
    }
    
    Storage.addTransaction({ text, amount: -amount });
    document.getElementById('expense-form').reset();
    updateExpenseList();
    alert('Expense added successfully!');
}

function updateExpenseList() {
    const expenseTransactions = Storage.getTransactionsByType('expense');
    const list = document.getElementById('expense-list');
    
    if (expenseTransactions.length === 0) {
        list.innerHTML = '<div class="empty-state">No expense transactions yet</div>';
    } else {
        list.innerHTML = expenseTransactions.map(transaction => `
            <div class="transaction-item">
                <div class="transaction-info">
                    <div class="transaction-text">${transaction.text}</div>
                    <div class="transaction-date">${formatDate(transaction.date)}</div>
                </div>
                <div class="transaction-amount negative">
                    -${formatCurrency(transaction.amount)}
                </div>
                <button class="delete-btn" onclick="deleteExpenseTransaction(${transaction.id})">Delete</button>
            </div>
        `).join('');
    }
    
    const totalExpense = Calculator.getTotalExpense(Storage.getTransactions());
    const expenseCount = expenseTransactions.length;
    
    document.getElementById('expense-total').textContent = formatCurrency(totalExpense);
    document.getElementById('expense-count').textContent = expenseCount;
}

function deleteExpenseTransaction(id) {
    if (confirm('Are you sure you want to delete this expense transaction?')) {
        Storage.deleteTransaction(id);
        updateExpenseList();
    }
}

// Initialize page based on current page
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
    
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        initializeDashboard();
    } else if (window.location.pathname.includes('income.html')) {
        initializeIncomePage();
    } else if (window.location.pathname.includes('expense.html')) {
        initializeExpensePage();
    }
});

function initializePage() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

}
