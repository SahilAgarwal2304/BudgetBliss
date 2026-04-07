// ==========================================
// LocalStorage & Data Utilities
// ==========================================
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
    
    clearAllTransactions() {
        localStorage.removeItem('transactions');
        return [];
    }
};

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
            this.showWarning('CRITICAL: Storage almost full! ' + `(${usage.usedMB}MB / 5MB used)`);
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
            setTimeout(() => warning.remove(), 5000);
        }
    },
    
    estimateRemainingCapacity() {
        const usage = this.getUsage();
        const avgTransactionSize = 100;
        const remainingBytes = (5 * 1024 * 1024) - usage.used;
        return Math.floor(remainingBytes / avgTransactionSize);
    }
};

const Calculator = {
    getTotalBalance(transactions) {
        return transactions.reduce((acc, t) => acc + t.amount, 0);
    },
    getTotalIncome(transactions) {
        return transactions.filter(t => t.amount > 0).reduce((acc, t) => acc + t.amount, 0);
    },
    getTotalExpense(transactions) {
        return (transactions.filter(t => t.amount < 0).reduce((acc, t) => acc + t.amount, 0));
    },
    getRecentTransactions(transactions, limit = 5) {
        return transactions.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, limit);
    }
};

// ==========================================
// Formatting & UI Helpers
// ==========================================
function formatCurrency(amount) {
    return '₹' + Math.abs(amount).toFixed(2);
}

function formatBalance(amount) {
    return amount < 0 ? '-₹' + Math.abs(amount).toFixed(2) : '₹' + amount.toFixed(2);
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-IN');
}

function toggleAdminDropdown() {
    document.getElementById('admin-dropdown').classList.toggle('show');
}

document.addEventListener('click', function(event) {
    const dropdown = document.getElementById('admin-dropdown');
    const adminBtn = document.querySelector('.admin-btn:nth-child(2)'); // The Settings button
    if (adminBtn && !adminBtn.contains(event.target) && dropdown && !dropdown.contains(event.target)) {
        dropdown.classList.remove('show');
    }
});

function showStorageInfo() {
    const transactions = Storage.getTransactions();
    const usage = StorageMonitor.getUsage();
    
    document.getElementById('total-transactions').textContent = transactions.length;
    document.getElementById('storage-size').textContent = usage.usedKB + ' KB';
    document.getElementById('income-count-storage').textContent = Storage.getTransactionsByType('income').length;
    document.getElementById('expense-count-storage').textContent = Storage.getTransactionsByType('expense').length;
    
    let usageBar = document.getElementById('storage-usage-bar');
    if (!usageBar) {
        usageBar = document.createElement('div');
        usageBar.id = 'storage-usage-bar';
        usageBar.className = 'storage-usage-bar';
        document.getElementById('storage-info').appendChild(usageBar);
    }
    
    usageBar.innerHTML = `
        <div class="usage-fill" style="width: ${usage.percentage}%; background: ${usage.percentage > 90 ? 'var(--accent-danger)' : usage.percentage > 70 ? 'var(--accent-warning)' : 'var(--accent-success)'}">
            ${usage.percentage}% Used
        </div>
        <div style="padding: 5px; font-size: 12px; color: var(--text-muted);">
            ${usage.usedKB} KB / 5 MB • ~${StorageMonitor.estimateRemainingCapacity()} transactions remaining
        </div>
    `;
    
    document.getElementById('storage-info').style.display = 'block';
    toggleAdminDropdown();
}

function hideStorageInfo() {
    document.getElementById('storage-info').style.display = 'none';
}

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

// ==========================================
// Page Initializers
// ==========================================
function initializeDashboard() {
    const transactions = Storage.getTransactions();
    const balance = Calculator.getTotalBalance(transactions);
    
    const balanceEl = document.getElementById('total-balance');
    balanceEl.textContent = formatBalance(balance);
    balanceEl.style.color = balance < 0 ? 'var(--accent-danger)' : 'var(--accent-primary)';

    document.getElementById('total-income').textContent = formatCurrency(Calculator.getTotalIncome(transactions));
    document.getElementById('total-expense').textContent = formatCurrency(Calculator.getTotalExpense(transactions));

    const recentList = document.getElementById('recent-transactions-list');
    const recentTransactions = Calculator.getRecentTransactions(transactions, 5);
    
    if (recentTransactions.length === 0) {
        recentList.innerHTML = '<div class="empty-state">No transactions yet</div>';
    } else {
        recentList.innerHTML = recentTransactions.map(t => `
            <div class="transaction-item">
                <div class="transaction-info">
                    <div class="transaction-text">${t.text}</div>
                    <div class="transaction-date">${formatDate(t.date)}</div>
                </div>
                <div class="transaction-amount ${t.amount >= 0 ? 'positive' : 'negative'}">
                    ${t.amount >= 0 ? '+' : '-'}${formatCurrency(t.amount)}
                </div>
            </div>
        `).join('');
    }
    StorageMonitor.checkLimit();
}

function initializeIncomePage() {
    updateIncomeList();
    StorageMonitor.checkLimit();
    const form = document.getElementById('income-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const text = document.getElementById('text').value.trim();
            const amount = parseFloat(document.getElementById('amount').value);
            if (!text || !amount || amount <= 0) return alert('Invalid entry');
            Storage.addTransaction({ text, amount });
            form.reset();
            updateIncomeList();
        });
    }
}

function updateIncomeList() {
    const transactions = Storage.getTransactionsByType('income');
    const list = document.getElementById('income-list');
    
    list.innerHTML = transactions.length === 0 
        ? '<div class="empty-state">No income transactions yet</div>'
        : transactions.map(t => `
            <div class="transaction-item">
                <div class="transaction-info">
                    <div class="transaction-text">${t.text}</div>
                    <div class="transaction-date">${formatDate(t.date)}</div>
                </div>
                <div class="transaction-amount positive">+${formatCurrency(t.amount)}</div>
                <button class="delete-btn" onclick="deleteIncomeTransaction(${t.id})">Del</button>
            </div>
        `).join('');
        
    document.getElementById('income-total').textContent = formatCurrency(Calculator.getTotalIncome(Storage.getTransactions()));
    document.getElementById('income-count').textContent = transactions.length;
}

function deleteIncomeTransaction(id) {
    if (confirm('Delete this record?')) {
        Storage.deleteTransaction(id);
        updateIncomeList();
    }
}

function initializeExpensePage() {
    updateExpenseList();
    StorageMonitor.checkLimit();
    const form = document.getElementById('expense-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const text = document.getElementById('text').value.trim();
            const amount = parseFloat(document.getElementById('amount').value);
            if (!text || !amount || amount <= 0) return alert('Invalid entry');
            Storage.addTransaction({ text, amount: -amount });
            form.reset();
            updateExpenseList();
        });
    }
}

function updateExpenseList() {
    const transactions = Storage.getTransactionsByType('expense');
    const list = document.getElementById('expense-list');
    
    list.innerHTML = transactions.length === 0 
        ? '<div class="empty-state">No expense transactions yet</div>'
        : transactions.map(t => `
            <div class="transaction-item">
                <div class="transaction-info">
                    <div class="transaction-text">${t.text}</div>
                    <div class="transaction-date">${formatDate(t.date)}</div>
                </div>
                <div class="transaction-amount negative">-${formatCurrency(t.amount)}</div>
                <button class="delete-btn" onclick="deleteExpenseTransaction(${t.id})">Del</button>
            </div>
        `).join('');
        
    document.getElementById('expense-total').textContent = formatCurrency(Calculator.getTotalExpense(Storage.getTransactions()));
    document.getElementById('expense-count').textContent = transactions.length;
}

function deleteExpenseTransaction(id) {
    if (confirm('Delete this record?')) {
        Storage.deleteTransaction(id);
        updateExpenseList();
    }
}

// ==========================================
// Export / Import Features
// ==========================================
function exportData() {
    const transactions = Storage.getTransactions();
    if (transactions.length === 0) return alert("No data to export.");

    const dataStr = JSON.stringify(transactions, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `BudgetBliss_Backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toggleAdminDropdown();
}

function triggerImport() {
    document.getElementById('import-file').click();
    toggleAdminDropdown();
}

function importData(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedData = JSON.parse(e.target.result);
            if (!Array.isArray(importedData)) throw new Error("Invalid file format.");
            Storage.saveTransactions(importedData);
            alert('Data restored successfully!');
            location.reload();
        } catch (error) {
            alert('Failed to import data: ' + error.message);
        }
    };
    reader.readAsText(file);
    event.target.value = '';
}

// ==========================================
// Theme Management
// ==========================================
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const btn = document.getElementById('theme-toggle-btn');
    if (btn) {
        btn.innerHTML = theme === 'dark' ? '☀️' : '🌙';
    }
}

// ==========================================
// Bootstrapper
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    const path = window.location.pathname;
    const page = path.split('/').pop() || 'index.html';
    
    // Set active nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === page);
    });

    // Initialize page components
    if (page === 'index.html' || path === '/') initializeDashboard();
    else if (page === 'income.html') initializeIncomePage();
    else if (page === 'expense.html') initializeExpensePage();
    
    // Initialize Theme
    initTheme();
});