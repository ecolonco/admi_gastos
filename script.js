// Obtener referencias a los elementos del DOM
const expenseForm = document.getElementById('expense-form');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const categorySelect = document.getElementById('category');
const personSelect = document.getElementById('person');
const monthSelect = document.getElementById('month');
const expensesTableBody = document.querySelector('#expenses-table tbody');
const summary = {
    'Alda': document.getElementById('total-person1'),
    'Jorge': document.getElementById('total-person2'),
    'Martin': document.getElementById('total-person3'),
    'Aremko': document.getElementById('total-person4'),
    'Total': document.getElementById('total-general')
};

// Referencias para filtros
const filterPerson = document.getElementById('filter-person');
const filterMonth = document.getElementById('filter-month');
const clearFiltersBtn = document.getElementById('clear-filters');

// Modal de Modificación
const modal = document.getElementById('modal');
const closeButton = document.querySelector('.close-button');
const modifyForm = document.getElementById('modify-form');
const modifyDescription = document.getElementById('modify-description');
const modifyAmount = document.getElementById('modify-amount');
const modifyCategory = document.getElementById('modify-category');
const modifyPerson = document.getElementById('modify-person');
const modifyMonth = document.getElementById('modify-month');
const modifyPassword = document.getElementById('password');

let currentModifyIndex = null;

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
        amountCell.textContent = Math.roun(parseFloat(expense.amount).toFixed(2));
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
        const modifyBtn = document.createElement('button');
        modifyBtn.textContent = 'Modificar';
        modifyBtn.classList.add('modify-btn');
        modifyBtn.dataset.index = index;
        actionCell.appendChild(modifyBtn);
        row.appendChild(actionCell);

        expensesTableBody.appendChild(row);
    });
}

// Función para actualizar el resumen de gastos
function updateSummary() {
    let totals = {
        'Alda': 0,
        'Jorge': 0,
        'Martin': 0,
        'Aremko': 0,
        'Total': 0
    };

    // Filtrar gastos según los filtros seleccionados para el resumen
    const filteredExpenses = expenses.filter(expense => {
        const matchPerson = currentFilterPerson === 'Todos' || expense.person === currentFilterPerson;
        const matchMonth = currentFilterMonth === 'Todos' || expense.month === currentFilterMonth;
        return matchPerson && matchMonth;
    });

    filteredExpenses.forEach(expense => {
        if (totals.hasOwnProperty(expense.person)) { // Asegurarse de que la persona exista
            totals[expense.person] += parseFloat(expense.amount);
            totals['Total'] += parseFloat(expense.amount);
        }
    });

    summary['Alda'].textContent = `Alda: $${totals['Alda'].toFixed(2)}`;
    summary['Jorge'].textContent = `Jorge: $${totals['Jorge'].toFixed(2)}`;
    summary['Martin'].textContent = `Martin: $${totals['Martin'].toFixed(2)}`;
    summary['Aremko'].textContent = `Aremko: $${totals['Aremko'].toFixed(2)}`;
    summary['Total'].textContent = `Total General: $${totals['Total'].toFixed(2)}`;
}

// Función para guardar gastos en localStorage
function saveExpenses() {
    localStorage.setItem('expenses', JSON.stringify(expenses));
}

// Manejar el envío del formulario de agregar gasto
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

// Manejar la apertura del modal de modificación
expensesTableBody.addEventListener('click', function(e) {
    if (e.target.classList.contains('modify-btn')) {
        const index = e.target.dataset.index;
        currentModifyIndex = index;
        modal.style.display = 'block';
    }
});

// Manejar el cierre del modal
closeButton.addEventListener('click', function() {
    modal.style.display = 'none';
    modifyForm.reset();
    currentModifyIndex = null;
});

// Manejar el clic fuera del modal para cerrarlo
window.addEventListener('click', function(e) {
    if (e.target == modal) {
        modal.style.display = 'none';
        modifyForm.reset();
        currentModifyIndex = null;
    }
});

// Manejar el envío del formulario de modificación
modifyForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const description = modifyDescription.value.trim();
    const amount = modifyAmount.value.trim();
    const category = modifyCategory.value;
    const person = modifyPerson.value;
    const month = modifyMonth.value;
    const password = modifyPassword.value;

    const PASSWORD = '1234'; // Contraseña fija (Cambia esto por una más segura si es necesario)

    if (password !== PASSWORD) {
        alert('Contraseña incorrecta. No se pueden modificar los datos.');
        return;
    }

    if (description === '' || amount === '' || category === '' || person === '' || month === '') {
        alert('Por favor, completa todos los campos.');
        return;
    }

    // Actualizar el gasto seleccionado
    expenses[currentModifyIndex] = {
        description,
        amount,
        category,
        person,
        month
    };

    saveExpenses();
    updateExpensesTable();
    updateSummary();

    // Cerrar el modal y resetear el formulario
    modal.style.display = 'none';
    modifyForm.reset();
    currentModifyIndex = null;
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
