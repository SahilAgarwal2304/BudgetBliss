// script.js
// ==========================================
// Firebase Firestore Initialization
// ==========================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js";
import { 
    getFirestore, 
    collection, 
    addDoc, 
    getDocs, 
    deleteDoc, 
    doc, 
    query, 
    orderBy 
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBC86Kau3-C6zDCeluon0h-4pJ1hE9hHPg",
    authDomain: "budgetbliss-52cc5.firebaseapp.com",
    projectId: "budgetbliss-52cc5",
    storageBucket: "budgetbliss-52cc5.firebasestorage.app",
    messagingSenderId: "453839844426",
    appId: "1:453839844426:web:d3c56c638a6289b595e2b3",
    measurementId: "G-RVZVK4S99D"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ==========================================
// Cloud Database Utilities (Firestore)
// ==========================================
const Storage = {
    async getTransactions() {
        if (!window.currentUserId) return [];
        
        // Fetch only the documents belonging to the currently logged-in user
        const q = query(
            collection(db, "users", window.currentUserId, "transactions"), 
            orderBy("date", "desc")
        );
        
        const querySnapshot = await getDocs(q);
        const transactions = [];
        
        querySnapshot.forEach((doc) => {
            transactions.push({ id: doc.id, ...doc.data() });
        });
        
        return transactions;
    },
    
    async addTransaction(transaction) {
        if (!window.currentUserId) return alert("Authentication error.");
        
        transaction.date = new Date().toISOString();
        
        // Push document to cloud
        const docRef = await addDoc(collection(db, "users", window.currentUserId, "transactions"), transaction);
        transaction.id = docRef.id;
        
        return transaction;
    },
    
    async deleteTransaction(id) {
        if (!window.currentUserId) return;
        
        // Delete document from cloud
        await deleteDoc(doc(db, "users", window.currentUserId, "transactions", id));
    },
    
    async clearAllTransactions() {
        if (!window.currentUserId) return;
        
        // Firestore doesn't have a "delete all" command from the client
        // We must fetch them and delete them one by one
        const transactions = await this.getTransactions();
        for (let t of transactions) {
            await this.deleteTransaction(t.id);
        }
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
        return transactions.slice(0, limit);
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

// Bind to window because HTML inline onclick events cannot see inside modules
window.toggleAdminDropdown = function() {
    document.getElementById('admin-dropdown').classList.toggle('show');
}

document.addEventListener('click', function(event) {
    const dropdown = document.getElementById('admin-dropdown');
    const adminBtn = document.querySelector('.admin-btn:nth-child(2)'); 
    
    if (adminBtn && !adminBtn.contains(event.target) && dropdown && !dropdown.contains(event.target)) {
        dropdown.classList.remove('show');
    }
});

window.showStorageInfo = async function() {
    const transactions = await Storage.getTransactions();
    
    document.getElementById('total-transactions').textContent = transactions.length;
    document.getElementById('income-count-storage').textContent = transactions.filter(t => t.amount > 0).length;
    document.getElementById('expense-count-storage').textContent = transactions.filter(t => t.amount < 0).length;
    document.getElementById('storage-size').textContent = 'Cloud Active';
    
    document.getElementById('storage-info').style.display = 'block';
    window.toggleAdminDropdown();
}

window.hideStorageInfo = function() {
    document.getElementById('storage-info').style.display = 'none';
}

window.showClearDataModal = function() {
    document.getElementById('clear-data-modal').classList.add('show');
    window.toggleAdminDropdown();
}

window.hideClearDataModal = function() {
    document.getElementById('clear-data-modal').classList.remove('show');
}

window.clearAllData = async function() {
    await Storage.clearAllTransactions();
    alert('All cloud data has been cleared!');
    window.hideClearDataModal();
    location.reload();
}

// ==========================================
// Export / Import (Updated for Cloud)
// ==========================================
window.exportData = async function() {
    const transactions = await Storage.getTransactions();
    if (transactions.length === 0) return alert("No data to export.");

    const dataStr = JSON.stringify(transactions, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `BudgetBliss_CloudBackup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    window.toggleAdminDropdown();
}

window.triggerImport = function() {
    document.getElementById('import-file').click();
    window.toggleAdminDropdown();
}

window.importData = function(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async function(e) {
        try {
            const importedData = JSON.parse(e.target.result);
            if (!Array.isArray(importedData)) throw new Error("Invalid file format.");
            
            alert('Uploading backup to cloud... Please wait.');
            for (let item of importedData) {
                await Storage.addTransaction({ text: item.text, amount: item.amount });
            }
            
            alert('Data restored to cloud successfully!');
            location.reload();
        } catch (error) {
            alert('Failed to import data: ' + error.message);
        }
    };
    reader.readAsText(file);
    event.target.value = '';
}

// ==========================================
// Page Initializers (Asynchronous)
// ==========================================
async function initializeDashboard() {
    const transactions = await Storage.getTransactions();
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
}

async function initializeIncomePage() {
    await updateIncomeList();
    
    const form = document.getElementById('income-form');
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            const text = document.getElementById('text').value.trim();
            const amount = parseFloat(document.getElementById('amount').value);
            
            if (!text || !amount || amount <= 0) return alert('Invalid entry');
            
            form.querySelector('.btn').textContent = "Saving to Cloud...";
            await Storage.addTransaction({ text, amount });
            
            form.reset();
            form.querySelector('.btn').textContent = "Add Income";
            await updateIncomeList();
        });
    }
}

async function updateIncomeList() {
    const allTransactions = await Storage.getTransactions();
    const transactions = allTransactions.filter(t => t.amount > 0);
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
                <button class="delete-btn" onclick="deleteTransaction('${t.id}', 'income')">Del</button>
            </div>
        `).join('');
        
    document.getElementById('income-total').textContent = formatCurrency(Calculator.getTotalIncome(allTransactions));
    document.getElementById('income-count').textContent = transactions.length;
}

async function initializeExpensePage() {
    await updateExpenseList();
    
    const form = document.getElementById('expense-form');
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            const text = document.getElementById('text').value.trim();
            const amount = parseFloat(document.getElementById('amount').value);
            
            if (!text || !amount || amount <= 0) return alert('Invalid entry');
            
            form.querySelector('.btn').textContent = "Saving to Cloud...";
            await Storage.addTransaction({ text, amount: -amount });
            
            form.reset();
            form.querySelector('.btn').textContent = "Add Expense";
            await updateExpenseList();
        });
    }
}

async function updateExpenseList() {
    const allTransactions = await Storage.getTransactions();
    const transactions = allTransactions.filter(t => t.amount < 0);
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
                <button class="delete-btn" onclick="deleteTransaction('${t.id}', 'expense')">Del</button>
            </div>
        `).join('');
        
    document.getElementById('expense-total').textContent = formatCurrency(Calculator.getTotalExpense(allTransactions));
    document.getElementById('expense-count').textContent = transactions.length;
}

window.deleteTransaction = async function(id, type) {
    if (confirm('Delete this record?')) {
        await Storage.deleteTransaction(id);
        if (type === 'income') await updateIncomeList();
        if (type === 'expense') await updateExpenseList();
    }
}

// ==========================================
// Theme Management
// ==========================================
window.toggleTheme = function() {
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
// Cloud Bootstrapper (Called securely by auth.js)
// ==========================================
window.initAppAfterAuth = async function() {
    const path = window.location.pathname;
    const page = path.split('/').pop() || 'dashboard.html';
    
    // Set active nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === page);
    });

    // Initialize the appropriate page based on URL
    if (page === 'dashboard.html' || path === '/') {
        await initializeDashboard();
    } else if (page === 'income.html') {
        await initializeIncomePage();
    } else if (page === 'expense.html') {
        await initializeExpensePage();
    }
    
    // Initialize Theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
};