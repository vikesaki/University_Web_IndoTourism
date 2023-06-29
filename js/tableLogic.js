// This function sorts the input array, according to the received parameters.
function sortDataByName(data, headers, opt_mass, opt_bool_mass) {
    data.sort((a, b) => {
        for(let i = 0; i < opt_mass.length; i++) {

            let outpInd = opt_mass[i] - 1;
            outpInd = parseInt(outpInd);

            if((outpInd >= 0) && (outpInd < 5)) {
                let navOpt = headers[outpInd];
                //console.log('navOpt = ' + navOpt);

                let nameA = a[navOpt].toLowerCase();
                let nameB = b[navOpt].toLowerCase();

                if((!(isNaN(parseInt(nameA)) || !isFinite(nameA))) &&
                    (!(isNaN(parseInt(nameB)) || !isFinite(nameB))) ) {

                    nameA = parseFloat(nameA);
                    nameB = parseFloat(nameB);
                }

                let bool = opt_bool_mass[i];

                if (nameA < nameB) {
                    if (bool == true) { return 1 } else { return -1 }
                }
                else if (nameA > nameB) {
                    if (bool == true) { return -1 } else { return 1 }
                }
            }
        }
        return 0;
    });
}

function createTable(data) {
    // Создаем элемент таблицы
    var table = document.createElement("table");
    table.id = 'my-table';

    // Создаем заголовок таблицы
    var headerRow = document.createElement("tr");
    var headerNames = ["Name", "Location", "Province", "Visitor", "Price"];
    for (var i = 0; i < headerNames.length; i++) {
        var headerCell = document.createElement("th");
        headerCell.textContent = headerNames[i];
        //headerCell.className = 'title';
        headerRow.appendChild(headerCell);
        headerRow.className = 'title';
    }
    table.appendChild(headerRow);

    // Создаем строки таблицы
    for (var j = 0; j < data.length; j++) {
        var row = document.createElement("tr");
        var item = data[j];
        var keys = Object.keys(item);
        for (var k = 0; k < keys.length; k++) {
            var cell = document.createElement("td");
            cell.textContent = item[keys[k]];
            row.appendChild(cell);
        }
        table.appendChild(row);
    }

    // Возвращаем таблицу
    return table;
}

// --------------------
// start program

// Получаем ссылку на таблицу
let table = document.getElementById("my-table");

// buttons, which we will update the table
let butt_sort = document.getElementById("butt-sort");
let butt_filter = document.getElementById("butt-filter");

if(table == undefined) {
    alert('Error! The required table was not found on the page!');
}

// Get a list of column headers
const headers = [];
for (let i = 0; i < table.rows[0].cells.length; i++) {
    headers[i] = table.rows[0].cells[i].textContent;
}

console.log(headers);

// Iterate over each row of the table and save its contents to an array of dictionaries
let data = [];

for (let i = 1; i < table.rows.length; i++) {
    const tableRow = table.rows[i];
    const rowData = {};

    // Loop through each cell in a row and store its contents in the corresponding column heading
    for (let j = 0; j < tableRow.cells.length; j++) {
        rowData[headers[j]] = tableRow.cells[j].textContent;
    }

    data.push(rowData);
}

console.log(data);
let data_1 = data;

// An array of which options are selected in each of the 3 sort levels
// (values from 0 to 5)
let opt_mass = [];

opt_mass[0] = 0;
opt_mass[1] = 0;
opt_mass[2] = 0;

// An array of checkboxes called "descending?"
let opt_bool_mass = [];

opt_bool_mass[0] = false;
opt_bool_mass[1] = false;
opt_bool_mass[2] = false;

// Rebuild the table (sort)
function ReqSort() {
    sortDataByName(data, headers, opt_mass, opt_bool_mass);
    data_1 = data;

    table.remove(); // Drop the table from the page

    var newTable = createTable(data); // And I collect a new one, with the necessary data

    var container = document.getElementById("table-container"); // Find container for table
    container.insertBefore(newTable, container.firstChild); // And insert a new table into this container

    table = document.getElementById("my-table");
}

butt_sort.addEventListener('click', () => {
    check_checkboxes_1();

    // Here we sort and filter the table data at the same time
    ReqSort();
    ReqFilter();
});

// This is an array of values for all 6 filter fields
let strMass = ["", "", "", 0, 0, 0, 0];

function setSortTable(date, strMass) {

    let outDate = [];

    for(let j = 3; j < strMass.length; j++) {
        if(strMass[j] == "") strMass[j] = 0;
        else strMass[j] = parseInt(strMass[j]);
    }

    // Loop through all entries in the date array
    // If the entry matches all the conditions, then I add it to the output array
    for(let i = 0; i < date.length; i++) {
        let bool = true;

        if(strMass[0] != "") {
            if (date[i].Name.indexOf(strMass[0]) === -1) {
                bool = false;
            }
        }
        if(strMass[1] != "") {
            if (date[i].Location.indexOf(strMass[1]) === -1) {
                bool = false;
            }
        }
        if(strMass[2] != "") { // ?
            if (date[i].Province.indexOf(strMass[2]) === -1) {
                bool = false;
            }
        }
        if(strMass[3] != 0) {
            if(date[i]['Visitor'] < strMass[3]) {
                bool = false;
            }
        }
        if(strMass[4] != 0) { // ?
            if(date[i]['Visitor'] > strMass[4]) {
                bool = false;
            }
        }
        if(strMass[5] != 0) {
            if(date[i]['Price'] < strMass[5]) {
                bool = false;
            }
        }
        if(strMass[6] != 0) {
            if(date[i]['Price'] > strMass[6]) {
                bool = false;
            }
        }

        if(bool == true) {
            outDate.push(date[i]);
        }
    }

    return outDate;
}

// This is the inscription "No records found for this query"
bad_news = document.getElementById('bad-news');
bad_news.style.display = "none";

// Rebuild the table (filtering)
function ReqFilter() {

    // Get the values of all 6 fields from the page, and write them to the strMass array
    const inputs = document.querySelectorAll('.block-02 .right-edge-1 input[type="text"]');
    strMass = [];
    for (let i = 0; i < inputs.length; i++) {
        strMass.push(inputs[i].value);
    }

    console.log('strMass = ' + strMass);

    let inDate = setSortTable(data_1, strMass); // filtering

    table.remove();

    var newTable;

    if(inDate.length > 0) {
        bad_news.style.display = "none"; // Hide the bad_news element

        newTable = createTable(inDate);
        var container = document.getElementById("table-container");
        container.insertBefore(newTable, container.firstChild);

        table = document.getElementById("my-table");
    }
    else {
        // If there are no records after filtering - show error message
        bad_news.style.display = "block";
    }
}

butt_filter.addEventListener('click', () => {
    console.log('filter button pressed!');
    check_checkboxes_1();
    ReqSort();
    ReqFilter();
});

// Массив, в котором хранятся все строки значений списка
let allElemMass = [];

allElemMass[0] = 'No';
allElemMass[1] = 'Name';
allElemMass[2] = 'Location';
allElemMass[3] = 'Province';
allElemMass[4] = 'Visitor	';
allElemMass[5] = 'Price	';

// Returns the desired option element
function getNumElem(name) {
    // Get element with id = "sort-opt"
    let sortOpt = document.getElementById("sort-opt");
    // Get element with class l1 inside sortOpt
    let l1 = sortOpt.getElementsByClassName(name)[0];
    // Get the select element inside l1
    let select = l1.getElementsByTagName("select")[0];
    return select;
}

// Loop through 3 sort select inputs
// So that if the first option is selected, then
// In others - it was no longer there
function reqInputElements(indDesel) {

    console.log('itsElementFree = ' + itsElementFree);

    if(opt_mass[0] == 0 && opt_mass[1] == 0 && opt_mass[2] == 0) {
        itsElementFree = [0, 0, 0, 0, 0];
        // might broke down somehow
    }

    // Get elements
    let a = getNumElem('l1');
    let b = getNumElem('l2');
    let c = getNumElem('l3');

    // Iterate over each of the 3
    for(let j = 0; j < 3; j++) {
        // Удаляю их содержимое
        if(j == 0) a.innerHTML = '';
        if(j == 1) b.innerHTML = '';
        if(j == 2) c.innerHTML = '';

        for(let i = 0; i < 6; i++) {
            if ((itsElementFree[i] != 1) || (opt_mass[j] == i)) {
                // If the i-th option is not selected in any of them
                // Or, if this option is selected specifically on this element,
                // I add this option to this element

                let option = document.createElement("option");
                option.value = i;
                option.text = allElemMass[i];

                if(opt_mass[j] == i) {
                    // If this option is selected specifically on this element,
                    // then I put it selected.
                    option.selected = true;
                    console.log('opt_mass[' + j + '] = ' + i);
                }

                if(j == 0) a.appendChild(option);
                if(j == 1) b.appendChild(option);
                if(j == 2) c.appendChild(option);
            }
        }
    }
}

// To get the value of the selected radio button:

/*
const radioButtons = document.querySelector('.block-03 .center-edge-2 select');
console.log(radioButtons[0].value);
*/

let itsElementFree = [0, 0, 0, 0, 0];
// This is an array that tells us if the i-th option is selected somewhere
// For example, if only in the 1st sort level select "Name",
// then this array will look like this: itsElementFree = [0, 1, 0, 0, 0]

let bufMass = [0, 0, 0];
// Array of buffer values
// We will need it when the user removes his selection from some sort level,
// and we will need to set the desired array element itsElementFree to 0

// Further, for each sort level list, I add a function,
// called when its value changes

const selectElement1 = document.querySelector('.block-03 .l1 select');

selectElement1.addEventListener('change', function() {
    let selectedValue = selectElement1.value;
    //console.log('selectElement1.value = ' + selectElement1.value);
    opt_mass[0] = selectedValue;

    if(selectedValue != 0) {
        itsElementFree[selectedValue] = 1;
    } else {
        itsElementFree[bufMass[0]] = 0;
    }

    bufMass[0] = selectedValue;
    reqInputElements(1); // Rebuild all 3 elements, depending on the user's choice
});

const selectElement2 = document.querySelector('.block-03 .l2 select');

selectElement2.addEventListener('change', function() {
    let selectedValue = selectElement2.value;
    console.log('opt_mass[1] = ' + selectedValue);
    opt_mass[1] = selectedValue;

    if(selectedValue != 0) {
        itsElementFree[selectedValue] = 1;
    } else {
        itsElementFree[bufMass[1]] = 0;
    }

    bufMass[1] = selectedValue;
    reqInputElements(2);
});

const selectElement3 = document.querySelector('.block-03 .l3 select');

selectElement3.addEventListener('change', function() {
    let selectedValue = selectElement3.value;
    console.log('opt_mass[2] = ' + selectedValue);
    opt_mass[2] = selectedValue;

    if(selectedValue != 0) {
        itsElementFree[selectedValue] = 1;
    } else {
        itsElementFree[bufMass[2]] = 0;
    }

    bufMass[2] = selectedValue;
    reqInputElements(3);
});

//To get the values of the selected checkboxes:

const checkboxes = document.querySelectorAll('.block-03 input[type="checkbox"]');
let checkedValues = [];

check_checkboxes_1();

function check_checkboxes_1() {
    checkedValues = [];
    checkboxes.forEach(checkbox => {
        checkedValues.push(checkbox.checked);
    });

    //console.log(checkedValues);
    opt_bool_mass = checkedValues;
}