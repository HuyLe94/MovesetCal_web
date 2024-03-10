// Define the URL for the JSON file containing abilities data
const abilitiesJsonURL = 'https://raw.githubusercontent.com/HuyLe94/Pokemon-Data-File/main/V1/unique_abilities.json';
const movesJsonURL = 'https://raw.githubusercontent.com/HuyLe94/Pokemon-Data-File/main/V1/unique_moves.json';
const typesJsonURL = 'https://raw.githubusercontent.com/HuyLe94/Pokemon-Data-File/main/V1/unique_types.json';
const fullDataJsonURL = 'https://raw.githubusercontent.com/HuyLe94/Pokemon-Data-File/main/V1/Complete_Data.json';

const FontSize = '25px';

let pokemonData;

fetch(fullDataJsonURL)
    .then(response => response.json())
    .then(data => {
        pokemonData = data;
        //console.log('Pokémon data fetched successfully:', pokemonData);
    })
    .catch(error => {
        console.error('Error fetching Pokémon data:', error);
    });

function searchPokemonByCriteria() {
    const resultTable = document.getElementById('result_table');
    while (resultTable.rows.length > 1) {
        resultTable.deleteRow(1);
    }

    // Retrieve entered criteria
    const enteredMove1 = document.getElementById('search-input1').value.trim();
    const enteredMove2 = document.getElementById('search-input2').value.trim();
    const enteredMove3 = document.getElementById('search-input3').value.trim();
    const enteredMove4 = document.getElementById('search-input4').value.trim();
    const enteredType1 = document.getElementById('type1_search').value.trim();
    const enteredType2 = document.getElementById('type2_search').value.trim();
    const enteredAbility = document.getElementById('search-input5').value.trim();

    // Retrieve base stat input values
    const speedValue = parseInt(document.getElementById('speed_value').value.trim()) || 0;
    const hpValue = parseInt(document.getElementById('hp_value').value.trim()) || 0;
    const attackValue = parseInt(document.getElementById('attack_value').value.trim()) || 0;
    const defenseValue = parseInt(document.getElementById('defense_value').value.trim()) || 0;
    const satkValue = parseInt(document.getElementById('satk_value').value.trim()) || 0;
    const sdefValue = parseInt(document.getElementById('sdef_value').value.trim()) || 0;

    // Iterate through each pokemon in pokemonData
    for (const pokemonName in pokemonData) {
        const pokemon = pokemonData[pokemonName];
        const moves = pokemon.learnset;
        moves.sort();
        const abilities = pokemon.abilities;
        const types = pokemon.types;
        const baseStats = pokemon.baseStats;
        const pokename = pokemon.name;


        let move1Found = enteredMove1 === "" || moves.some(move => move.toLowerCase() === enteredMove1.toLowerCase());
        let move2Found = enteredMove2 === "" || moves.some(move => move.toLowerCase() === enteredMove2.toLowerCase());
        let move3Found = enteredMove3 === "" || moves.some(move => move.toLowerCase() === enteredMove3.toLowerCase());
        let move4Found = enteredMove4 === "" || moves.some(move => move.toLowerCase() === enteredMove4.toLowerCase());

        // Check if each entered type exists in the pokemon's types
        let type1Found = enteredType1 === "" || types.some(type => type.toLowerCase() === enteredType1.toLowerCase());
        let type2Found = enteredType2 === "" || types.some(type => type.toLowerCase() === enteredType2.toLowerCase());

        // Check if the entered ability exists in the pokemon's abilities
        let abilityFound = enteredAbility === "" || abilities.some(ability => ability.toLowerCase() === enteredAbility.toLowerCase());


        // Check if the base stats meet the input criteria
        let statsMatch = baseStats.hp >= hpValue &&
            baseStats.atk >= attackValue &&
            baseStats.def >= defenseValue &&
            baseStats.spa >= satkValue &&
            baseStats.spd >= sdefValue &&
            baseStats.spe >= speedValue;

        // Check if all entered criteria are found
        if (move1Found && move2Found && move3Found && move4Found &&
            type1Found && type2Found && abilityFound && statsMatch) {
            // Matching criteria found, create table row and populate the table
            createAndPopulateRow(resultTable, pokename, baseStats, types, moves);
        }
    }
}

function createAndPopulateRow(resultTable, pokename, baseStats, types, moves) {
    const row = resultTable.insertRow(-1); // Insert at the last position (before the end)
    const nameCell = row.insertCell(0);
    nameCell.textContent = pokename;
    nameCell.style.cursor = 'pointer'; // Change cursor to pointer to indicate clickability
    nameCell.style.textDecoration = 'underline'; // Underline the text
    row.style.height = '50px'; // Change the height as needed

    // Adjust the font size for the text
    row.style.fontSize = FontSize; // Change the font size as needed
    nameCell.addEventListener('click', () => {
        // Update the column header to show the Pokémon's name
        const movesListHeader = document.querySelector('#moveslist_table th');
        movesListHeader.innerHTML = `${pokename}'s <br> Moves List`;



        // Retrieve the learnset of the clicked Pokémon
        const learnset = moves;

        // Get or create the Moves List cell
        let movesListCell = document.querySelector('#moveslist_table td');
        if (!movesListCell) {
            movesListCell = document.createElement('td');
            document.querySelector('#moveslist_table tr').appendChild(movesListCell);
        }

        movesListCell.style.border = '1px solid black'; // Adjust border properties as needed

        // Clear the Moves List cell content
        movesListCell.textContent = '';

        // Format the moves list with HTML line breaks
        const movesListContent = learnset.join('\n').replaceAll('\n', '<br>');

        // Set the moves list content in the Moves List cell
        movesListCell.innerHTML = movesListContent;
        movesListCell.style.fontSize = FontSize;
    });



    row.insertCell(1).textContent = baseStats.hp;
    row.insertCell(2).textContent = baseStats.atk;
    row.insertCell(3).textContent = baseStats.spa;
    row.insertCell(4).textContent = baseStats.def;
    row.insertCell(5).textContent = baseStats.spd;
    row.insertCell(6).textContent = baseStats.spe;
    row.insertCell(7).textContent = types.join(', '); // Join types into a comma-separated string
}




// Function to populate the dropdown with options
function populateDropdown(dropdown, options) {
    dropdown.innerHTML = ''; // Clear existing options

    options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.textContent = option;
        dropdown.appendChild(optionElement);

        // Add click event listener to each option
        optionElement.addEventListener('click', () => {
            const input = dropdown.previousElementSibling;
            input.value = option; // Set input value to selected option
            dropdown.style.display = 'none'; // Hide dropdown after selection
        });
    });
}


function fetchAndPopulateMovesDropdown(inputId, dropdownId, jsonURL) {
    const input = document.getElementById(inputId);
    const dropdown = document.getElementById(dropdownId);

    let data;

    fetch(jsonURL)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(jsonData => {
            data = jsonData;

            input.addEventListener('input', () => {
                const searchText = input.value.toLowerCase();
                const matchingOptions = data.filter(option =>
                    option.toLowerCase().startsWith(searchText)
                ); 
                populateDropdown(dropdown, matchingOptions);

                if (searchText.length === 0 || matchingOptions.length === 0) {
                    dropdown.style.display = 'none'; // Hide dropdown if input is empty or no matching options
                } else {
                    dropdown.style.display = 'block'; // Show dropdown if there are matching options
                }
            });

            // Add focusout event listener to hide dropdown when input loses focus
            //input.addEventListener('focusout', (event) => {
            //    const relatedTarget = event.relatedTarget;
            //    if (!dropdown.contains(relatedTarget) && relatedTarget !== input) {
            //        dropdown.style.display = 'none';
            //    }
            //});
            
            

            // Add keydown event listener for Tab key
            input.addEventListener('keydown', (event) => {
                if (event.key === 'Tab') {
                    if (dropdown.style.display === 'block') {
                        const firstOption = dropdown.querySelector('option');
                        if (firstOption) {
                            event.preventDefault(); // Prevent default tab behavior
                            input.value = firstOption.textContent; // Fill input with first option
                            dropdown.style.display = 'none'; // Hide dropdown
                        }
                    } else {
                        // Dropdown is not visible, allow default Tab behavior
                        return;
                    }
                }
            }); 
            
        })
        .catch(error => {
            console.error('Error:', error);
        });
}


fetchAndPopulateMovesDropdown('search-input5', 'abilityList', abilitiesJsonURL);
fetchAndPopulateMovesDropdown('search-input1', 'movedropdown1', movesJsonURL);
fetchAndPopulateMovesDropdown('search-input2', 'movedropdown2', movesJsonURL);
fetchAndPopulateMovesDropdown('search-input3', 'movedropdown3', movesJsonURL);
fetchAndPopulateMovesDropdown('search-input4', 'movedropdown4', movesJsonURL);
fetchAndPopulateMovesDropdown('type1_search', 'type1dropdown', typesJsonURL);
fetchAndPopulateMovesDropdown('type2_search', 'type2dropdown', typesJsonURL);


function sortTable(tableId, colIndex) {
    const table = document.getElementById(tableId);
    if (!table) {
        console.error(`Table with ID '${tableId}' not found.`);
        return;
    }

    const rows = table.rows;
    const sortedRows = Array.from(rows).slice(1); // Exclude header row
    const sortDirection = table.getAttribute('data-sort-direction') || 'asc'; // Default sort direction

    // Sort the rows based on the content of the specified column
    sortedRows.sort((rowA, rowB) => {
        const valueA = parseValue(rowA.cells[colIndex].textContent.toLowerCase());
        const valueB = parseValue(rowB.cells[colIndex].textContent.toLowerCase());

        if (sortDirection === 'asc') {
            return valueA - valueB;
        } else {
            return valueB - valueA;
        }
    });

    // Update sort direction attribute
    table.setAttribute('data-sort-direction', sortDirection === 'asc' ? 'desc' : 'asc');

    // Clear table body
    while (table.rows.length > 1) {
        table.deleteRow(1);
    }

    // Re-append sorted rows to the table
    sortedRows.forEach(row => {
        table.appendChild(row);
    });

    // Update sort indicator in the header
    updateSortIndicator(table.querySelector('thead th'), sortDirection);
}


function parseValue(value) {
    const parsedValue = parseFloat(value);
    return isNaN(parsedValue) ? value : parsedValue;
}


function updateSortIndicator(th, sortDirection) {
    // Remove any existing sort indicators
    const sortIndicators = document.querySelectorAll('thead th button');
    sortIndicators.forEach(indicator => {
        indicator.innerHTML = '&#9650;&#9660;';
    });
}

document.getElementById('goToTopBtn').addEventListener('click', function () {
    // Scroll to the top of the document when the button is clicked
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Add click event listener to the document
document.addEventListener('click', (event) => {
    const clickedElement = event.target;

    // Check if the clicked element is an input box
    if (clickedElement.tagName.toLowerCase() === 'input') {
        const clickedInput = clickedElement;
        // Get all input boxes
        const allInputs = document.querySelectorAll('input');
        // Close dropdowns associated with other input boxes
        allInputs.forEach(input => {
            if (input !== clickedInput) {
                const associatedDropdown = input.nextElementSibling;
                if (associatedDropdown && associatedDropdown.classList.contains('dropdown')) {
                    associatedDropdown.style.display = 'none';
                }
            }
        });
    } else {
        // Check if the clicked element is not contained within any specific elements
        if (!clickedElement.closest('.your-dropdown-class') && !clickedElement.closest('.your-input-class')) {
            // Close all dropdowns
            const allDropdowns = document.querySelectorAll('.dropdown');
            allDropdowns.forEach(dropdown => {
                dropdown.style.display = 'none';
            });
        }
    }
});


