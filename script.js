/*
Brendan Mulligan, UMass Lowell Computer Science, brendan_mulligan@student.uml.edu
Copyright (c) 2025 by Brendan. All rights reserved. May be freely copied or
excerpted for educational purposes with credit to the author.
*/

// Wait for the DOM to be fully loaded before initializing the app
document.addEventListener('DOMContentLoaded', initializeApp);

// Main function that sets up the application
function initializeApp() {
    // Initialize jQuery Validation
    $('#multiplicationForm').validate({
        rules: {
            rowStart: {
                required: true,
                number: true,
                min: -50,
                max: 50,
                lessThanOrEqual: '#rowEnd'
            },
            rowEnd: {
                required: true,
                number: true,
                min: -50,
                max: 50,
                greaterThanOrEqual: '#rowStart'
            },
            columnStart: {
                required: true,
                number: true,
                min: -50,
                max: 50,
                lessThanOrEqual: '#columnEnd'
            },
            columnEnd: {
                required: true,
                number: true,
                min: -50,
                max: 50,
                greaterThanOrEqual: '#columnStart'
            }
        },
        messages: {
            rowStart: {
                required: "Please enter a start value for rows",
                number: "Please enter a valid number",
                min: "Value must be at least -50",
                max: "Value must be at most 50",
                lessThanOrEqual: "Row start must be less than or equal to row end"
            },
            rowEnd: {
                required: "Please enter an end value for rows",
                number: "Please enter a valid number",
                min: "Value must be at least -50",
                max: "Value must be at most 50",
                greaterThanOrEqual: "Row end must be greater than or equal to row start"
            },
            columnStart: {
                required: "Please enter a start value for columns",
                number: "Please enter a valid number",
                min: "Value must be at least -50",
                max: "Value must be at most 50",
                lessThanOrEqual: "Column start must be less than or equal to column end"
            },
            columnEnd: {
                required: "Please enter an end value for columns",
                number: "Please enter a valid number",
                min: "Value must be at least -50",
                max: "Value must be at most 50",
                greaterThanOrEqual: "Column end must be greater than or equal to column start"
            }
        },
        errorElement: 'span',
        errorPlacement: function(error, element) {
            error.insertAfter(element);
        },
        submitHandler: function(form) {
            handleValidForm();
        }
    });

    // Custom validation method for less than or equal
    $.validator.addMethod("lessThanOrEqual", function(value, element, param) {
        var target = $(param);
        if (this.settings.onfocusout) {
            target.unbind(".validate-lessThanOrEqual").bind("blur.validate-lessThanOrEqual", function() {
                $(element).valid();
            });
        }
        return value <= target.val();
    }, "Must be less than or equal to the other field");

    // Custom validation method for greater than or equal
    $.validator.addMethod("greaterThanOrEqual", function(value, element, param) {
        var target = $(param);
        if (this.settings.onfocusout) {
            target.unbind(".validate-greaterThanOrEqual").bind("blur.validate-greaterThanOrEqual", function() {
                $(element).valid();
            });
        }
        return value >= target.val();
    }, "Must be greater than or equal to the other field");

    // Get references to key DOM elements
    const errorDisplay = document.getElementById('errorDisplay');
    const tableOutput = document.getElementById('tableOutput');

    // Handles the form submission when validation passes
    function handleValidForm() {
        clearPreviousResults(); // Clear any previous results or errors

        const inputValues = getInputValues(); // Get user input values
        
        // Additional validation for range size
        const rowRange = inputValues.rowEnd - inputValues.rowStart;
        const columnRange = inputValues.columnEnd - inputValues.columnStart;
        
        if (rowRange > 100 || columnRange > 100) {
            showError('Range between start and end values cannot exceed 100.');
            return;
        }

        generateMultiplicationTable(inputValues); // Generate and display the table
    }

    // Clears any previous error messages and table results
    function clearPreviousResults() {
        errorDisplay.style.display = 'none';
        errorDisplay.textContent = '';
        tableOutput.innerHTML = '';
    }

    // Gets and parses input values from the form
    function getInputValues() {
        return {
            rowStart: parseInt(document.getElementById('rowStart').value),
            rowEnd: parseInt(document.getElementById('rowEnd').value),
            columnStart: parseInt(document.getElementById('columnStart').value),
            columnEnd: parseInt(document.getElementById('columnEnd').value)
        };
    }

    // Displays an error message to the user
    function showError(message) {
        errorDisplay.textContent = message;
        errorDisplay.style.display = 'block';
    }

    // Generates the multiplication table based on valid inputs
    function generateMultiplicationTable({ rowStart, rowEnd, columnStart, columnEnd }) {
        const table = document.createElement('table');
        table.setAttribute('aria-label', 'Multiplication Table');
        
        // Create the header (column labels) and body (multiplication results)
        createTableHeader(table, columnStart, columnEnd);
        createTableBody(table, rowStart, rowEnd, columnStart, columnEnd);
        
        tableOutput.appendChild(table); // Add the completed table to the DOM
    }

    // Creates the table header row with column labels
    function createTableHeader(table, columnStart, columnEnd) {
        const headerRow = document.createElement('tr');
        headerRow.appendChild(createHeaderCell('')); // Empty top-left cell

        // Add column headers from columnStart to columnEnd
        for (let col = columnStart; col <= columnEnd; col++) {
            headerRow.appendChild(createHeaderCell(col));
        }

        table.appendChild(headerRow);
    }

    // Creates the table body with multiplication results
    function createTableBody(table, rowStart, rowEnd, columnStart, columnEnd) {
        // Create a row for each row value
        for (let row = rowStart; row <= rowEnd; row++) {
            const tableRow = document.createElement('tr');
            tableRow.appendChild(createHeaderCell(row)); // Row label

            // Create cells for each column value
            for (let col = columnStart; col <= columnEnd; col++) {
                const cell = document.createElement('td');
                cell.textContent = row * col; // Calculate and display product
                tableRow.appendChild(cell);
            }

            table.appendChild(tableRow);
        }
    }

    // Helper function to create a header cell with specified content
    function createHeaderCell(content) {
        const cell = document.createElement('th');
        cell.textContent = content;
        return cell;
    }
}