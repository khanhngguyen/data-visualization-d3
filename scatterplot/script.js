import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

let dopingData;

// Declare the chart dimensions cand margins.
const width = 800;
const height = 600;
const padding = 40;

const drawChart = () => {
    // Scale
    const xScale = d3.scaleLinear()
        .domain([
            d3.min(dopingData, d => d["Year"]) - 1, 
            d3.max(dopingData, d => d["Year"]) + 1
        ])
        .range([padding, width - padding]);

    const yScale = d3.scaleTime()
        .domain([
            d3.min(dopingData, d => {
                return new Date(d["Seconds"] * 1000)}), 
            d3.max(dopingData, d => {
                return new Date(d["Seconds"] * 1000)})
        ])
        .range([padding, height - padding]);

    // Axis
    const xAxis = d3.axisBottom(xScale)
        .tickFormat(d3.format("d"));
    const yAxis = d3.axisLeft(yScale)
        .tickFormat(d3.timeFormat("%M:%S"));

    // tooltip
    const tooltip = d3.select("#tooltip");

    // Drawing chart
    const svg = d3.select("#chart")
        .attr("width", width)
        .attr("height", height);
    
    // Append title
    svg.append("text")
        .text("Doping in Professional Bicycle Racing")
        .attr("id", "title")
        .attr("x", width / 2 - (2 * padding))
        .attr("y", padding);
    svg.append("text")
        .text("35 Fastest times up Alpe d'Huez")
        .attr("id", "sub-title")
        .attr("x", width / 2 - (2 * padding))
        .attr("y", padding + 20);

    // Add x axis
    svg.append("g")
        .call(xAxis)
        .attr('id', 'x-axis')
        .attr('transform', 'translate(0, ' + (height-padding) +')')
  
    // Adding y axis
    svg.append('g')
        .call(yAxis)
        .attr('id', 'y-axis')
        .attr('transform','translate(' + padding + ', 0)')

    //Adding circle
    svg.append('g')
    .call(yAxis)
    .attr('id', 'y-axis')
    .attr('transform','translate(' + padding + ', 0)')
  
    svg.selectAll("circle")
        .data(dopingData)
        .enter()
        .append("circle")
        .attr('class', 'dot')
        .attr('r', '5')
        .attr("data-xvalue", d => d["Year"])
        .attr("data-yvalue", d => {
            return new Date(d["Seconds"] * 1000)
        })
        .attr("cx", d => {
            return xScale(d["Year"])
        })
        .attr("cy", d => {
            return yScale(new Date(d["Seconds"] * 1000))
        })
        .attr('fill', (item) => {
            if(item['URL'] === ""){
            return 'orange'
            } else {
            return 'blue'
            }
        })
        .on("mouseover", (event, d) => {
        let values = [event.pageX, event.pageY];
            tooltip.transition()
            .style("visibility", "visible")
            .style("left", values[0] +  "px")
            .style("top", values[1] - 50 + "px");;

            tooltip.text(`
            ${d["Name"]}: ${d["Nationality"]}.
            Year: ${d["Year"]}, Time: ${d["Time"]}.
            ${d["Doping"]}
            `)

            tooltip.attr("data-year", d["Year"])
        })
        .on("mouseout", (event, d) => {
            tooltip.transition()
            .style("visibility", "hidden");
        })

        // Add legends
        svg.append("text")
            .attr("x", width - 150)
            .attr("y", height - height/2 - padding + 4)
            .attr("id", "legend")
            .text("Doping Allegation");
        svg.append("circle")
            .attr("cx", width - 150 - 15)
            .attr("cy", height - height/2 - padding)
            .attr("r", 8)
            .attr("fill", "blue");

        svg.append("text")
            .attr("x", width - 150)
            .attr("y", height - height/2)
            .attr("id", "legend")
            .text("No Doping Allegation");
        svg.append("circle")
            .attr("cx", width - 150 - 15)
            .attr("cy", height - height/2 - 4)
            .attr("r", 8)
            .attr("fill", "orange");
}

d3.json(url).then(
    (data, error) => {
        if (error) console.log(error);
        else {
            dopingData = data;
            console.log(dopingData);
            drawChart();
        }
    }
)