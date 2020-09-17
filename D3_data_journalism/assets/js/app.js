// @TODO: YOUR CODE HERE!

var svgWidth = 900;
var svgHeight = 600;

var margin = {
  top: 30,
  right: 40,
  bottom: 150,
  left: 150
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
let svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

let chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)
// Initial parameters 
let chosenXAxis = "poverty";
let chosenYAxis = "healthcare";

function xScale(liveData, chosenXAxis){
    let xLinearScale = d3.scaleLinear()
        .domain([d3.min(liveData, d=> d[chosenXAxis]) * 0.8,
          d3.max(liveData, d=> d[chosenXAxis]) * 1.2
        ])
        .range([0,width]);

    return xLinearScale;
}

function yScale(liveData, chosenYAxis) {
    // create scales
    let yLinearScale = d3.scaleLinear()
      .domain([d3.min(liveData, d => d[chosenYAxis]) * 0.8,
        d3.max(liveData, d => d[chosenYAxis]) * 1.2
      ])
      .range([height,0]);
  
    return yLinearScale;
}

// create a function to update the x and y axis once you click the label

function renderAxesX(newXScale, xAxis) {
    let bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);

    return xAxis;
}

function renderAxesY(newYScale, yAxis) {
    let leftAxis = d3.axisLeft(newYScale);

    yAxis.transition()
        .duration(1000)
        .call(leftAxis);

    return yAxis;
}


// function for the bubble circles on transition

function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis){

    circlesGroup.transition()
        .duration(1000)
        .attr("cx", xx => newXScale(xx[chosenXAxis]))
        .attr("cy", yy => newYScale(yy[chosenYAxis]));

    return circlesGroup;
}

// function to render the abbreviation 

function renderStateAbbr(stateAbbr, newXScale, chosenXAxis, newYScale, chosenYAxis){

    stateAbbr.transition()
    .duration(1000)
    .attr("x"  , xxx => newXScale(xxx[chosenXAxis]))
    .attr("y", yyy => newYScale(yyy[chosenYAxis]));

    return stateAbbr;
}

/// tool tip function

function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup){
    if (chosenXAxis == "poverty"){
        var labelx = "Poverty: ";
    }

    else if(chosenXAxis == "age"){
        var labelx = "Age: ";
    }

    else {
        var labelx = "Income: $";
    }


    // y labels
    if (chosenYAxis == "healthcare"){
        var labely = "Healthcare: ";
    }
    else if(chosenYAxis == "smokes") {
        var labely = "Smoke: ";
    }

    else {
        var labely = "Obesity: ";
    }

    // Create tool tip

    var toolTip = d3.tip()
        .attr("class", "d3-tip") 
        .style("font-size", "8px")
        .html(function(tip){return(`${tip.state}<br>${labelx} ${formatAxis(tip[chosenXAxis], chosenXAxis)} <br> 
        ${labely} ${formatAxis(tip[chosenYAxis], chosenYAxis)} `) // 
        });

    circlesGroup.call(toolTip);

    circlesGroup.on("mouseover", function(data) {
        toolTip.show(data);
    })

    // on mouse out event
        .on("mouseout", function (data, index) {
            toolTip.hide(data);
        });

    return circlesGroup;
}

/// function to format the x tip

function formatAxis(axisValue, chosenXAxis, chosenYAxis){

    if (chosenXAxis == "poverty"){
        return `${axisValue} %`;
    }

    else if(chosenXAxis == "age"){
        return `${axisValue}`;
    }

    else if(chosenXAxis == "income"){
        return `${axisValue}`;
    }

    else if(chosenYAxis = "healthcare"){
        return `${axisValue} %`;

    }

    else if(chosenYAxis == "smokes"){
        return `${axisValue} %`;
    }

    else {
        return `${axisValue} %`;
    }
}


// Import Data
csvfile="assets/data/data.csv"
d3.csv(csvfile).then(function(liveData, err) {
    if (err) throw err;
    console.log(liveData)

    // Step 1: Parse Data/Cast as numbers
    // ==============================
          // create date parser
        //var dateParser = d3.timeParse("%d-%b");

          // parse data
    liveData.forEach(function(data) {
            // data.healthcare = dateParser(data.healthcare);
            data.poverty = +data.poverty;
            data.healthcare= +data.healthcare
            data.age = +data.age;
            data.obesity = +data.obesity;
            data.smokes = +data.smokes;
            data.income = +data.income;
    });

    // Step 2: Create scale functions
    // ==============================
          // create scales
    let xLinearScale = xScale(liveData, chosenXAxis);
  
    let yLinearScale = yScale(liveData, chosenYAxis);

    // Step 3: Create axis functions
    // ==============================
    let bottomAxis = d3.axisBottom(xLinearScale); //.tickFormat(d3.timeFormat("%d-%b"));
    let leftAxis = d3.axisLeft(yLinearScale); //.ticks(6);

    // Step 4: Append Axes to the chart
    // ==============================
    // append axes
    let xAxis= chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    let yAxis = chartGroup.append("g")
        .classed("y-axis", true)
        .call(leftAxis);

        // line generator
        // var line = d3.line()
        // .x(d => xTimeScale(d.poverty))
        // .y(d => yLinearScale(d.healthcare));

        // append line
        // chartGroup.append("path")
        // .data([journalData])
        // .attr("d", line)
        // .attr("fill", "none")
        // .attr("stroke", "red");

    // Step 5: Create Circles
    // ==============================
          // append circles
    let circlesGroup = chartGroup.selectAll("circle")
    .data(liveData)
    .enter()
    .append("circle")
    .attr("class", "stateCircle")
    .attr("cx", xx => xLinearScale(xx[chosenXAxis]))
    .attr("cy", yy => yLinearScale(yy[chosenYAxis]))
    .attr("r", 10)
    .attr("opacity","1")
    // .attr("fill", "gold")
    // .attr("stroke-width", "1")
    // .attr("stroke", "black");

    let stateAbbr = chartGroup.selectAll("abbr")
    .data(liveData)
    .enter()
    .append("text")
    .text(d => d.abbr)
    .attr("class", "stateText")  // get format from d3Style.css
    .attr("cx", xx => xLinearScale(xx[chosenXAxis]))
    .attr("cy", yy => yLinearScale(yy[chosenYAxis]))
    // .style("text-anchor", "middle")
    .attr("font-size", "8px")
    // .attr("font-weight", "bold")
    // .attr("fill", "white");


    let labelsGroupX = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);

    let povertyLabel = labelsGroupX.append("text")
        .attr("x",0)
        .attr("y",20)
        .attr("value", "poverty")
        .classed("active", true)
        .text("In Poverty (%)");

    let ageLabel = labelsGroupX.append("text")
        .attr("x",0)
        .attr("y",50)
        .attr("value", "age")
        .classed("inactive", true)
        .text("Age (median)");

    let houseLabel = labelsGroupX.append("text")
        .attr("x",0)
        .attr("y",80)
        .attr("value", "income")
        .classed("inactive", true)
        .text("Household Income (median)");

    let labelsGroupY = chartGroup.append("g")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))

    let healthLabel = labelsGroupY.append("text")
        .attr("value", "healthcare")
        .attr("dx", "-10em")
        .attr("dy", "-2em")
        .classed("active", true)
        .text("Lacks Healthcare (%)");

    let smokesLabel = labelsGroupY.append("text")
        .attr("value", "smokes")
        .attr("dx", "-10em")
        .attr("dy", "-4em")
        .classed("inactive", true)
        .text("Smokes (%)");
    
    let obeseLabel = labelsGroupY.append("text")
        .attr("value", "obesity")
        .attr("dx", "-10em")
        .attr("dy", "-6em")
        .classed("inactive", true)
        .text("Obesity (%)");

    // listening events

    labelsGroupX.selectAll("text")
        .on("click", function() {
            let xValue = d3.select(this).attr("value");
            if (xValue !== chosenXAxis){

                chosenXAxis = xValue;

                xLinearScale = xScale(liveData, chosenXAxis)

                xAxis = renderAxesX(xLinearScale, xAxis);

                circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

                circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

                stateAbbr = renderStateAbbr(stateAbbr, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis); 

                if (chosenYAxis === "age"){
                    ageLabel
                        .classed("active", true)
                        .classed("inactive", false)
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true)
                    houseLabel
                        .classed("active", false)
                        .classed("inactive", true)
                }

                else if (chosenYAxis === "income"){
                    houseLabel
                        .classed("active", true)
                        .classed("inactive", false)
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true)
                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true)

                }

                else {
                    houseLabel
                        .classed("active", false)
                        .classed("inactive", true)
                    povertyLabel
                        .classed("active", true)
                        .classed("inactive", false)
                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true)
                }
            }
        })

    labelsGroupY.selectAll("text")
        .on("click", function(){

            let yValue = d3.select(this).attr("value");

            if (yValue !== chosenYAxis) {

                chosenYAxis = yValue;
                yLinearScale = yScale(liveData, chosenYAxis);
                yAxis = renderAxesY(yLinearScale, yAxis);

                circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

                circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

                stateAbbr = renderStateAbbr(stateAbbr, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

                if (chosenYAxis === "smokes"){
                    smokesLabel
                        .classed("active", true)
                        .classed("inactive", false)
                    healthLabel
                        .classed("active", false)
                        .classed("inactive", true)
                    obeseLabel
                        .classed("active", false)
                        .classed("inactive", true)
                }

                else if(chosenYAxis === "obesity"){
                    smokesLabel
                        .classed("active", false)
                        .classed("inactive", true)
                    healthLabel
                        .classed("active", false)
                        .classed("inactive", true)
                    obeseLabel
                        .classed("active", true)
                        .classed("inactive", false)                   
                }

                else {
                    smokesLabel
                        .classed("active", false)
                        .classed("inactive", true)
                    healthLabel
                        .classed("active", true)
                        .classed("inactive", false)
                    obeseLabel
                        .classed("active", false)
                        .classed("inactive", true)
                }
            }
        })

}).catch(function(error) {
    console.log(error);
    });
      


