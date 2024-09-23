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

// Referencias para el modal de edición
const editModal = document.getElementById('edit-modal');
const closeButton = document.querySelector('.close-button');
const editForm = document.getElementById('edit-form');
const editDescriptionInput = document.getElementById('edit-description');
const editAmountInput = document.getElementById('edit-amount');
const editCategorySelect = document.getElementById('edit-category');
const editPersonSelect = document.getElementById('edit-person');
const editMonthSelect = document.getElementById('edit-month');

// Contraseña para modificar
const MODIFY_PASSWORD = "admin123"; // Cambia esto a una contraseña segura

// Inicializar gastos desde localStorage o vacío
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

// Variables para filtros
let currentFilterPerson = 'Todos';
let currentFilterMonth = 'Todos';

// Variable para almacenar el índice del gasto a modificar
let currentEditIndex = null;

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
        row
