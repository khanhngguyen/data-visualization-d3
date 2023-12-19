import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";

let varianceData;
let baseTemp;

// Declare the chart dimensions cand margins.
const width = 1000;
const height = 600;
const padding = 60;

const drawChart = () => {
    const minYear = d3.min(varianceData, d => d["year"]);
    const maxYear = d3.max(varianceData, d => d["year"]);

    // Scale
    const xScale = d3.scaleLinear()
        .domain([minYear, maxYear + 1])
        .range([padding, width - padding]);

    const yScale = d3.scaleTime()
        .domain([
            new Date(0, 0, 0),
            new Date(0, 12, 0)
        ])
        .range([padding, height - padding]);

    // Axis
    const xAxis = d3.axisBottom(xScale)
        .tickFormat(d3.format("d"));
    const yAxis = d3.axisLeft(yScale)
        .tickFormat(d3.timeFormat("%B"));

    // tooltip
    const tooltip = d3.select("#tooltip");

    // Drawing chart
    const svg = d3.select("#map")
        .attr("width", width)
        .attr("height", height);
    
    // Append title & description
    svg.append("text")
        .text("Monthly Global Land-Surface Temperature")
        .attr("id", "title")
        .attr("x", width / 2 - 100)
        .attr("y", padding / 2);
    svg.append("text")
        .text("1753 - 2015: base temperature 8.66℃")
        .attr("id", "description")
        .attr("x", width / 2 - 80)
        .attr("y", 50);

    // Add x axis
    svg.append("g")
        .call(xAxis)
        .attr("id", "x-axis")
        .attr('transform', 'translate(0, ' + (height-padding) +')');
    // Adding y axis
    svg.append("g")
        .call(yAxis)
        .attr("id", "y-axis")
        .attr('transform','translate(' + padding + ', 0)');

    //Adding circle
    svg.selectAll("rect")
        .data(varianceData)
        .enter()
        .append("rect")
        .attr("class", "cell")
        .attr("data-year", d => d["year"])
        .attr("data-month", d => d["month"] - 1)
        .attr("data-temp", d => {
            return baseTemp + d["variance"];
        })
        .attr("height", d => {
            return (height - (2 * padding)) / 12;
        })
        .attr("width", d => {
            const yearCount = maxYear - minYear;
            return (width - (2 * padding)) / yearCount;
        })
        .attr("x", d => xScale(d["year"]))
        .attr("y", d => {
            return yScale(new Date(0, d["month"] - 1, 0, 0, 0, 0, 0));
        })
        .attr('fill', d => {
            let variance = d["variance"] + baseTemp;
            switch(true) {
                case (variance < 3.9): return 'midnightblue';
                break;
            case (variance < 5.0): return 'royalblue';
                break;
            case (variance < 6.1): return 'skyblue';
                break;
            case (variance < 7.2): return 'powderblue';
                break;
            case (variance < 8.3): return 'khaki';
                break;
            case (variance < 9.5): return 'gold';
                break;
            case (variance < 10.6): return 'sandybrown';
                break
            case (variance < 11.7): return 'orangered';
                break;
            default: return 'firebrick';
            }
        })
        .on("mouseover", (event, t) => {
            let values = [event.pageX, event.pageY]

            tooltip.transition()
                .style("visibility", "visible")
                .style("left", values[0] + 10 + "px")
                .style("top", values[1] - 40 + "px");

            tooltip.text(`
                ${t["month"]}/${t["year"]},
                temp: ${(t["variance"] + 8.66).toFixed(1)} °C,
                variance: ${t["variance"].toFixed(1)} °C
            `)
            
            tooltip.attr("data-year", t["year"])
        })
        .on("mouseout", (event, t) => {
            tooltip.transition()
            .style("visibility", "hidden")
        })

    // Add legends
    const legendSize = 30;
    const legendTemps = [2.8, 3.9, 5.0, 6.1, 7.2, 8.3, 9.5, 10.6, 11.7, 12.8];

    const legend = d3.select("#legend")
        .attr("width", width)
        .attr("height", legendSize * 2)

    // legend x axis
    const legendxScale = d3.scaleLinear()
        .domain([
            d3.min(legendTemps),
            d3.max(legendTemps) + 1
        ])
        .range([padding, (width - padding) / 2]);

    const legendxAxis = d3.axisBottom(legendxScale)
        .tickFormat(d3.format(".1f"))
        .ticks(legendTemps.length + 2);

    legend.append("g")
        .call(legendxAxis)
        .attr('transform', 'translate(0, ' + legendSize +')');

    legend.selectAll("rect")
        .data(legendTemps)
        .enter()
        .append("rect")
        .attr("height", 30)
        .attr("width", 30)
        .attr("x", t => legendxScale(t) + 7)
        .attr("y", 0)
        .attr('fill', t => {
            switch(true) {
                case (t < 3.9): return 'midnightblue';
                break;
                case (t < 5.0): return 'royalblue';
                break;
                case (t < 6.1): return 'skyblue';
                break;
                case (t < 7.2): return 'powderblue';
                break;
                case (t < 8.3): return 'khaki';
                break;
                case (t < 9.5): return 'gold';
                break;
                case (t < 10.6): return 'sandybrown';
                break;
                case (t < 11.7): return 'orangered';
                break;
                default: return 'firebrick';
            }
        })
}

d3.json(url).then(
    (data, error) => {
        if (error) console.log(error);
        else {
            varianceData = data["monthlyVariance"];
            baseTemp = data["baseTemperature"];
            drawChart();
        }
    }
)