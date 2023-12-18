import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

let gdpData;

// Declare the chart dimensions cand margins.
const width = 800;
const height = 600;
const padding = 50;

const drawChart = () => {
    let dates = gdpData.map(item => {
        return new Date(item[0]);
    });

    const heightScale = d3.scaleLinear()
        .domain([0, d3.max(gdpData, g => g[1])])
        .range([0, height - (2 * padding)]);

    const xScale = d3.scaleLinear()
        .domain([0, gdpData.length - 1])
        .range([padding, width - padding]);

    const xAxisScale = d3.scaleTime()
        .domain([d3.min(dates), d3.max(dates)])
        .range([padding, width - padding]);

    const yAxisScale = d3.scaleLinear()
        .domain([0, d3.max(gdpData, g => g[1])])
        .range([height - padding, padding]);

    // tooltip
    const tooltip = d3.select("#container")
        .append("div")
        .attr("id", "tooltip")
        .style("visibility", "hidden")
        .style("width", "auto")
        .style("height", "auto");

    // Drawing chart
    const svg = d3.select("#chart")
        .attr("width", width)
        .attr("height", height);
    
    // Append title
    svg.append("text")
        .text("USA GDP")
        .attr("id", "title")
        .attr("x", width / 2 - padding)
        .attr("y", padding / 2);

    // Add x axis
    svg.append("g") 
        .attr("id", "x-axis")
        .attr("transform", `translate(0, ${height - padding})`)
        .call(d3.axisBottom(xAxisScale));
    // Adding y axis
    svg.append("g")
        .attr("id", "y-axis")
        .attr("transform", `translate(${padding}, 0)`)
        .call(d3.axisLeft(yAxisScale));

    //Adding bars
    svg.selectAll("rect")
        .data(gdpData)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("width", (width - (2 * padding)) / gdpData.length)
        .attr("data-date", g => g[0])
        .attr("data-gdp", g => g[1])
        .attr("height", g => heightScale(g[1]))
        .attr("x", (g, i) => xScale(i))
        .attr("y", g => {
            return (height - padding) - heightScale(g[1]);
        })
        .on("mouseover", (event, g) => {
            let values = [event.pageX, event.pageY];

            tooltip.transition()
                .style("visibility", "visible")
                .style("left", values[0] + 20 + "px")
                .style("top", values[1] + "px");

            tooltip.text(`
                ${g[0]}: $${g[1]} Billion
            `);

            tooltip.attr("data-date", g[0]);
            })
        .on("mouseout", (event, g) => {
            tooltip.transition()
                .style("visibility", "hidden");
        })
        .attr("class", "bar")
}

d3.json(url).then(
    (data, error) => {
        if (error) console.log(error);
        else {
            gdpData = data.data;
            console.log(gdpData);
            drawChart();
        }
    }
)