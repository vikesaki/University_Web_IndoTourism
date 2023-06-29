// Returns all row values from the table, in an array
function GetTable() {
    // Get a link to the table
    let table = document.getElementById("my-table");

    // Get a list of column headers
    const headers = [];
    for (let i = 0; i < table.rows[0].cells.length; i++) {
        headers[i] = table.rows[0].cells[i].textContent;
    }

    //console.log(headers);

    // Loop through each row of the table and save its contents to an array of dictionaries
    let data = [];

    for (let i = 1; i < table.rows.length; i++) {
        const tableRow = table.rows[i];
        const rowData = {};

        // Loop through each cell in the row and store its contents in the corresponding column heading
        for (let j = 0; j < tableRow.cells.length; j++) {
            rowData[headers[j]] = tableRow.cells[j].textContent;
        }

        data.push(rowData);
    }

    return data;
}

// Goes through all the values of the input array, and collects the array of values for the chart
function CreateOutpMassForDate(Date, int_mode_y, int_mode_x) {

    let str_mode;
    let str_mode_date;

    // Set key strings to retrieve data from dictionary array
    if(int_mode_y == 0) str_mode = "Province";
    else if (int_mode_y == 1) str_mode = "Price";

    if(int_mode_x == 0) str_mode_date = "Visitor";
    else if (int_mode_x == 1) str_mode_date = "Visitor";

    let outMassForDate_x = {}; // output array

    for(let i = 0; i < Date.length; i++) {
        if(outMassForDate_x[Date[i][str_mode]] == null) {
            //console.log('Для данного значения ' + Date[i][str_mode] + ' no key yet');
            outMassForDate_x[Date[i][str_mode]] = Date[i][str_mode_date];
        } else {
            if(int_mode_x == 0) {
                if (outMassForDate_x[Date[i][str_mode]] < parseInt(Date[i][str_mode_date])) {
                    outMassForDate_x[Date[i][str_mode]] = parseInt(Date[i][str_mode_date]);
                    //console.log('Number of parts detected, more than recorded. outMassForDate_x[Date[i][str_mode]] = ' + outMassForDate_x[Date[i][str_mode]]);
                }
            } else if(int_mode_x == 1) {
                if (outMassForDate_x[Date[i][str_mode]] > parseInt(Date[i][str_mode_date])) {
                    outMassForDate_x[Date[i][str_mode]] = parseInt(Date[i][str_mode_date]);
                    //console.log('Rating detected, higher than recorded.outMassForDate_x[Date[i][str_mode]] = ' + outMassForDate_x[Date[i][str_mode]]);
                }
            }
        }
    }

    console.log(outMassForDate_x);
    return outMassForDate_x;
}

// Draws a line chart
function DrawLinearGrafic_02(data_x, data_y, strX, strY, int_color) {
    // Check if the input is a number
    if (!Array.isArray(data_x) || !Array.isArray(data_y) || data_x.length !== data_y.length) {
        console.error("Invalid input data");
        return;
    }
    for (var i = 0; i < data_x.length; i++) {
        if (isNaN(data_x[i]) || isNaN(data_y[i])) {
            console.error("Invalid input data");
            return;
        }
    }

    // Create an SVG element
    var svg = d3.select(".curr-graff")
        .append("svg")
        .attr("width", '500px')
        .attr("height", '400px')
        .attr("margin", 'auto');

    // Create scaling functions for x and y

    let dat_x = GetMinMaxVal(data_x);
    let dat_y = GetMinMaxVal(data_y);

    var xScale = d3.scaleLinear()
        .domain([dat_x[0], dat_x[1]]) //.domain([0, d3.max(data_x)]) // .domain([0, data_x.length - 1])
        .range([50, 450]);

    var yScale = d3.scaleLinear()
        .domain([dat_y[0], dat_y[1]]) //.domain([0, d3.max(data_y)])
        .range([250, 50]);

    // Создаем оси x и y
    var xAxis = d3.axisBottom(xScale);
    //var xAxis;
    //xAxis.tickFormat(d3.format(".0f")).tickValues(data_x.map(d => Number(d).toLocaleString('en-US', {minimumIntegerDigits: 4, useGrouping:false})));
    xAxis.tickFormat(d3.format(".0f"))
    //.tickValues(data_x.filter((d, i) => i % 2 === 0).map(d => Number(d).toLocaleString('en-US', {minimumIntegerDigits: 4, useGrouping:false})));

    var yAxis = d3.axisLeft(yScale)
    //.tickValues(d3.range(Math.ceil(yScale.domain()[0]), Math.floor(yScale.domain()[1]) + 1, 1))
    //.tickFormat(d3.format(".0f"));

    svg.append("g")
        .attr("transform", "translate(20," + 250 + ")")
        .attr("class", "x-axis")
        .call(xAxis);

    svg.append("g")
        .attr("transform", "translate(" + 70 + ",0)")
        .attr("class", "y-axis")
        .call(yAxis);

    let currColor = "#00a3ff";

    svg.append("path")
        .datum(data_y)
        .attr("fill", "none")
        .attr("stroke", currColor)
        .attr("stroke-width", 3)
        .attr("stroke-linecap", "round")
        .attr("stroke-dasharray", "0,0")
        .attr("d", d3.line()
            .x(function(d, i) { return xScale(data_x[i]); })
            .y(function(d) { return yScale(d); })
            .curve(d3.curveCardinal.tension(0.1)) // Set the degree of curvature of the line
        );
}

// Draws a bar graph
function DrawGistDiagramm(map, input_b) {
    let width = 500;
    let height = 300;
    let marginX = 55;
    let marginY = 75;

    let svg = d3.select(".curr-graff")
        .append("svg")
        .attr("height", height)
        .attr("width", width)
    //.style("border", "solid thin grey");

    let min = 0;
    let max;

    max = 5000000;

    let xAxisLen = width - 2 * marginX;
    let yAxisLen = height - 2 * marginY;
    let data = Object.entries(map);

    // scaling functions
    let scaleX = d3.scaleBand()
        .domain(data.map(function(d) {
            return d[0];
        }))
        .range([0, xAxisLen])
        .padding(0.45);

    let scaleY = d3.scaleLinear()
        .domain([min, max])
        .range([yAxisLen, 0]);

    // Create axes

    let axisY = d3.axisLeft(scaleY)     // Вертикальная
    //var yAxis = d3.axisLeft(yScale)
    //.tickValues(d3.range(Math.ceil(scaleY.domain()[0]), Math.floor(scaleY.domain()[1]) + 1, 1))
    //.tickFormat(d3.format(".0f"));

    let axisX = d3.axisBottom(scaleX).tickPadding(10).tickFormat(function(d){return d;}); // Горизонтальная
    svg.append("g")
        .attr("transform", `translate(${marginX}, ${height - marginY})`)
        .call(axisX)
        .attr("class", "x-axis")
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "7px")
        .attr("dy", "5px")
        .attr("transform", "rotate(-45)");

    svg.append("g")
        .attr("transform", `translate(${marginX}, ${marginY})`)
        .call(axisY);

    // Bar colors
    let color = d3.scaleOrdinal(d3.schemeCategory10);

    // Create and draw histogram bars
    let g = svg.append("g")
        .attr("transform", `translate(${ marginX}, ${ marginY})`)
        .selectAll(".rect")
        .data(data)
        .enter().append("rect")
        .attr("x", function(d) { return scaleX(d[0]); })
        .attr("width", scaleX.bandwidth())
        .attr("y", function(d) { return scaleY(d[1]); })
        .attr("height", function(d) { return yAxisLen - scaleY(d[1]); })
        .attr("fill", function(d) { return color(d[0]); })
        .attr("rx", 3)
        .attr("ry", 3);

}

// Returns the minimum and maximum value from the array, with a small offset,
// for a more beautiful display of the chart
function GetMinMaxVal(mass) {
    for(let i = 0; i<mass.length; i++) {
        // Convert all array data to numbers
        mass[i] = parseFloat(mass[i]);
    }

    let min = d3.min(mass);
    let max = d3.max(mass);
    let gerr = max-min;

    let outMin = min - gerr*0.1;
    let outMax = max + gerr*0.1;

    let outMass = [outMin, outMax];
    console.log('sizeMass = ' + outMass);
    return outMass;
}

// Checks Which Round Buttons Are Currently Selected
function radioButtonCheck() {
    // Get all radio buttons
    const radioButtons = document.querySelectorAll('.block-01 input[type="radio"]');

    let inpMassRad = [];

    // Traverse all radio buttons and find selected values
    for (let i = 0; i < radioButtons.length; i++) {
        console.log(radioButtons[i].checked);
        inpMassRad.push(radioButtons[i].checked);
    }

    if(inpMassRad[0] == true) input_a = 0; else input_a = 1;
    if(inpMassRad[2] == true) input_b = 0;
    else if(inpMassRad[3] == true) input_b = 1;
    else input_b = 2;

    // If nothing is selected, will return the last values
}

// Changes the display of the chart block on the page
function setVisibleElementGraf(isVisible) {
    grafDiv[0].style.display = isVisible ? "block" : "none";
}

// -----------
// Program start

let grafDiv = document.getElementsByClassName('block-graf');

// Hide or show the chart element
let isVisible = false;
setVisibleElementGraf(isVisible);

let input_a = 0;
let input_b = 0;

// -------

let buttDraw = document.getElementById('butt-graf');
let graf_container = document.getElementById('graf-container');

// Executed when clicking on the "Build" button in the chart block
buttDraw.addEventListener('click', () => {
    console.log('Кнопка нажата!');
    setVisibleElementGraf(true);

    // Delete chart
    let mainGraf = document.getElementsByClassName('curr-graff');
    mainGraf[0].remove();

    // Create a new element
    let mainGraf2 = document.createElement("div");
    mainGraf2.className = "curr-graff";

    // And paste it in the right place
    //console.log('graf_container.nodeName = ' + graf_container.nodeName);
    graf_container.insertBefore(mainGraf2, graf_container.firstChild);

    radioButtonCheck(); // Gather information about selected options

    MainGenerateGrafic(input_a, input_b); // And draw the chart
});

// Draws the desired chart, with the desired data
function MainGenerateGrafic(input_a, input_b) {
    let data_x = [];
    let data_y = [];

    let tt = 1;
    console.log(tt); tt++;

    // Get new data from the table on the page
    // So the graphs change after filtering the values
    let data = GetTable();

    // I get an array of values for plotting
    let newDate = CreateOutpMassForDate(data, input_a, input_b);

    data_x = Object.keys(newDate);
    data_y = Object.values(newDate);

    let strLett; // Line chart caption

    if(input_b == 0) strLett = "Max visior";
    else if(input_b == 1) strLett = "Min visior";

    if(input_a == 1) {
        DrawLinearGrafic_02(data_x, data_y, strLett, "Price", input_b);
    } else {
        DrawGistDiagramm(newDate, input_b);
    }
}