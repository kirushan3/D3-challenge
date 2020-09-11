// @TODO: YOUR CODE HERE!

var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
csvfile="assets/data/data.csv"
d3.csv(csvfile).then(function(journalData) {

    // Step 1: Parse Data/Cast as numbers
    // ==============================
          // create date parser
        //var dateParser = d3.timeParse("%d-%b");

          // parse data
        journalData.forEach(function(data) {
            // data.healthcare = dateParser(data.healthcare);
            data.poverty = +data.poverty;
            data.healthcare= +data.healthcare
          });

    // Step 2: Create scale functions
    // ==============================
          // create scales
        var xTimeScale = d3.scaleLinear()
          .domain([8,50])
          .range([0, width]);
  
        var yLinearScale = d3.scaleLinear()
          .domain([10,40])
          .range([height, 0]);

    // Step 3: Create axis functions
    // ==============================
        var xAxis = d3.axisBottom(xTimeScale); //.tickFormat(d3.timeFormat("%d-%b"));
        var yAxis = d3.axisLeft(yLinearScale); //.ticks(6);

    // Step 4: Append Axes to the chart
    // ==============================
    // append axes
        chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis);

        chartGroup.append("g")
        .classed("y-axis", true)
        .call(yAxis);

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
        var circlesGroup = chartGroup.selectAll("circle")
        .data(journalData)
        .enter()
        .append("circle")
        .attr("cx", d => xTimeScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", "10")
        .classed("stateCircle",true)
        //.attr("fill", "gold")
        //.attr("stroke-width", "1")
        //.attr("stroke", "black");

        chartGroup.selectAll("abbr")
        .data(journalData)
        .enter()
        .append("text")
        .text(d=>d.abbr)
        .attr("class", "stateText")
        .attr("cx", d => xTimeScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("font-size", "8px")

    // Step 6: Initialize tool tip
    // ==============================
        var toolTip = d3
        .tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(d) {
            return (`${d.state}<br>Poverty: ${d.poverty}%<br>Healthcare: ${d.healthcare}`);
    });

    // Step 7: Create tooltip in the chart
    // ==============================
        chartGroup.call(toolTip);

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
        circlesGroup.on("mouseover", function(d) {
            toolTip.show(d, this);
        })
      // Step 4: Create "mouseout" event listener to hide tooltip
            .on("mouseout", function(d) {
            toolTip.hide(d);
         });
        //}).catch(function(error) {
         //   console.log(error);
    });

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Lacks Healthcare %");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("In Poverty %");

//}).catch(function(error) {
  //  console.log(error);
//});
