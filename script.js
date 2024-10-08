// Obtener referencias a los elementos del DOM
const expenseForm = document.getElementById('expense-form');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const dateInput = document.getElementById('date'); // Nuevo Campo
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
const clearAllBtn = document.getElementById('clear-all'); // Nuevo Botón

// Modal de Modificación
const modal = document.getElementById('modal');
const closeButton = document.querySelector('.close-button');
const modifyForm = document.getElementById('modify-form');
const modifyDescription = document.getElementById('modify-description');
const modifyAmount = document.getElementById('modify-amount');
const modifyDate = document.getElementById('modify-date'); // Nuevo Campo
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
        amountCell.textContent = Math.round(parseFloat(expense.amount)); // Sin decimales
        row.appendChild(amountCell);

        const dateCell = document.createElement('td');
        dateCell.textContent = expense.date; // Mostrar Fecha
        row.appendChild(dateCell);

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

    summary['Alda'].textContent = `Alda: $${Math.round(totals['Alda'])}`;
    summary['Jorge'].textContent = `Jorge: $${Math.round(totals['Jorge'])}`;
    summary['Martin'].textContent = `Martin: $${Math.round(totals['Martin'])}`;
    summary['Aremko'].textContent = `Aremko: $${Math.round(totals['Aremko'])}`;
    summary['Total'].textContent = `Total General: $${Math.round(totals['Total'])}`;
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
    const date = dateInput.value; // Obtener Fecha
    const category = categorySelect.value;
    const person = personSelect.value;
    const month = monthSelect.value;

    if (description === '' || amount === '' || date === '' || category === '' || person === '' || month === '') {
        alert('Por favor, completa todos los campos.');
        return;
    }

    // Validar que el monto sea un número entero
    if (!Number.isInteger(parseFloat(amount))) {
        alert('Por favor, ingresa un monto entero sin decimales.');
        return;
    }

    const newExpense = {
        description,
        amount,
        date, // Incluir Fecha
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
        // Prellenar el formulario con los datos actuales del gasto
        const expense = expenses[index];
        modifyDescription.value = expense.description;
        modifyAmount.value = Math.round(parseFloat(expense.amount)); // Sin decimales
        modifyDate.value = expense.date; // Asignar Fecha
        modifyCategory.value = expense.category;
        modifyPerson.value = expense.person;
        modifyMonth.value = expense.month;
        modifyPassword.value = ''; // Limpiar contraseña
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
    const date = modifyDate.value; // Obtener Fecha
    const category = modifyCategory.value;
    const person = modifyPerson.value;
    const month = modifyMonth.value;
    const password = modifyPassword.value;

    const PASSWORD = '1234'; // Contraseña fija (Cambia esto por una más segura si es necesario)

    if (password !== PASSWORD) {
        alert('Contraseña incorrecta. No se pueden modificar los datos.');
        return;
    }

    if (description === '' || amount === '' || date === '' || category === '' || person === '' || month === '') {
        alert('Por favor, completa todos los campos.');
        return;
    }

    // Validar que el monto sea un número entero
    if (!Number.isInteger(parseFloat(amount))) {
        alert('Por favor, ingresa un monto entero sin decimales.');
        return;
    }

    // Actualizar el gasto seleccionado
    expenses[currentModifyIndex] = {
        description,
        amount,
        date, // Incluir Fecha
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

// Manejar el botón para borrar todos los gastos
clearAllBtn.addEventListener('click', function() {
    if (confirm('¿Estás seguro de que deseas borrar todos los gastos?')) {
        expenses = []; // Vaciar el arreglo de gastos
        saveExpenses(); // Guardar los cambios en localStorage
        updateExpensesTable(); // Actualizar la tabla en el DOM
        updateSummary(); // Actualizar el resumen de gastos
    }
});

// Inicializar la aplicación
function init() {
    updateExpensesTable();
    updateSummary();
}

init();
