// Obtener referencias a los elementos del DOM
const expenseForm = document.getElementById('expense-form');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const categorySelect = document.getElementById('category');
const personSelect = document.getElementById('person');
const monthSelect = document.getElementById('month');
const expensesTableBody = document.querySelector('#expenses-table tbody');
const summary = {
    'Persona 1': document.getElementById('total-person1'),
    'Persona 2': document.getElementById('total-person2'),
    'Persona 3': document.getElementById('total-person3'),
    'Total': document.getElementById('total-general')
};

// Referencias para filtros
const filterPerson = document.getElementById('filter-person');
const filterMonth = document.getElementById('filter-month');
const clearFiltersBtn = document.getElementById('clear-filters');

// Inicializar gastos desde localStorage o vacío
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

// Variables para filtros
let currentFilterPerson = 'Todos';
let currentFilterMonth = 'Todos';

// Función para actualizar la tabla de gastos
function updateExpensesTable() {
    // Limpiar la tabla
    expensesTableBody.innerHTML = '';

    // Filtrar gastos según los filtros seleccionados
    const filteredExpenses = expenses.filter(expense => {
        const matchPerson = currentFilterPerson === 'Todos' || expense.person === currentFilterPerson;
        const matchMonth = currentFilterMonth === 'Todos' || expense.month === currentFilterMonth;
        return matchPerson && matchMonth;
    });

    // Agregar cada gasto filtrado a la tabla
    filteredExpenses.forEach((expense, index) => {
        const row = document.createElement('tr');

        const descCell = document.createElement('td');
        descCell.textContent = expense.description;
        row.appendChild(descCell);

        const amountCell = document.createElement('td');
        amountCell.textContent = parseFloat(expense.amount).toFixed(2);
        row.appendChild(amountCell);

        const categoryCell = document.createElement('td');
        categoryCell.textContent = expense.category;
        row.appendChild(categoryCell);

        const personCell = document.createElement('td');
        personCell.textContent = expense.person;
        row.appendChild(personCell);

        const monthCell = document.createElement('td');
        monthCell.textContent = expense.month;
        row.appendChild(monthCell);

        const actionCell = document.createElement('td');
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Eliminar';
        deleteBtn.classList.add('delete-btn');
        deleteBtn.dataset.index = index;
        actionCell.appendChild(deleteBtn);
        row.appendChild(actionCell);

        expensesTableBody.appendChild(row);
    });
}

// Función para actualizar el resumen de gastos
function updateSummary() {
    let totals = {
        'Persona 1': 0,
        'Persona 2': 0,
        'Persona 3': 0,
        'Total': 0
    };

    // Filtrar gastos según los filtros seleccionados para el resumen
    const filteredExpenses = expenses.filter(expense => {
        const matchPerson = currentFilterPerson === 'Todos' || expense.person === currentFilterPerson;
        const matchMonth = currentFilterMonth === 'Todos' || expense.month === currentFilterMonth;
        return matchPerson && matchMonth;
    });

    filteredExpenses.forEach(expense => {
        totals[expense.person] += parseFloat(expense.amount);
        totals['Total'] += parseFloat(expense.amount);
    });

    summary['Persona 1'].textContent = `Persona 1: $${totals['Persona 1'].toFixed(2)}`;
    summary['Persona 2'].textContent = `Persona 2: $${totals['Persona 2'].toFixed(2)}`;
    summary['Persona 3'].textContent = `Persona 3: $${totals['Persona 3'].toFixed(2)}`;
    summary['Total'].textContent = `Total General: $${totals['Total'].toFixed(2)}`;
}

// Función para guardar gastos en localStorage
function saveExpenses() {
    localStorage.setItem('expenses', JSON.stringify(expenses));
}

// Manejar el envío del formulario
expenseForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const description = descriptionInput.value.trim();
    const amount = amountInput.value.trim();
    const category = categorySelect.value;
    const person = personSelect.value;
    const month = monthSelect.value;

    if (description === '' || amount === '' || category === '' || person === '' || month === '') {
        alert('Por favor, completa todos los campos.');
        return;
    }

    const newExpense = {
        description,
        amount,
        category,
        person,
        month
    };

    expenses.push(newExpense);
    saveExpenses();
    updateExpensesTable();
    updateSummary();

    // Limpiar el formulario
    expenseForm.reset();
});

// Manejar la eliminación de gastos
expensesTableBody.addEventListener('click', function(e) {
    if (e.target.classList.contains('delete-btn')) {
        const index = e.target.dataset.index;
        expenses.splice(index, 1);
        saveExpenses();
        updateExpensesTable();
        updateSummary();
    }
});

// Manejar filtros
filterPerson.addEventListener('change', function(e) {
    currentFilterPerson = e.target.value;
    updateExpensesTable();
    updateSummary();
});

filterMonth.addEventListener('change', function(e) {
    currentFilterMonth = e.target.value;
    updateExpensesTable();
    updateSummary();
});

// Manejar limpiar filtros
clearFiltersBtn.addEventListener('click', function() {
    filterPerson.value = 'Todos';
    filterMonth.value = 'Todos';
    currentFilterPerson = 'Todos';
    currentFilterMonth = 'Todos';
    updateExpensesTable();
    updateSummary();
});

// Inicializar la aplicación
function init() {
    updateExpensesTable();
    updateSummary();
}

init();
