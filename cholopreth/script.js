import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import * as topojson from "https://esm.sh/topojson-client";

const countyURL = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";
const educationURL = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";

let countyData;
let educationData;

// Declare the chart dimensions cand margins.
const width = 1000;
const height = 600;
const padding = 60;

const drawChart = () => {
    // tooltip
    const tooltip = d3.select("#tooltip");

    // Draw map
    const svg = d3.select("#map")
        .attr("width", width)
        .attr("height", height);

    //Adding circle
    svg.selectAll("path")
        .data(countyData)
        .enter()
        .append("path")
        .attr("d", d3.geoPath())
        .attr("class", "county")
        .attr("fill", data => {
            let id = data["id"];
            let county = educationData.find(d => {
                return d["fips"] === id;
            });
            let percentage = county["bachelorsOrHigher"];
            switch(true) {
                case (percentage > 57): 
                    return "#006d2c";
                    break;
                case (percentage > 48): 
                    return "#238b45";
                    break;
                case (percentage > 39): 
                    return "#41ab5d";
                    break;
                case (percentage > 30): 
                    return "#74c476";
                    break;
                case (percentage > 21): 
                    return "#a1d99b";
                    break;
                case (percentage > 12): 
                    return "#c7e9c0";
                    break;
                default:
                    return "#e5f5e0";
            }
        })
        .attr("data-fips", data => data["id"])
        .attr("data-education", data => {
            let id = data["id"];
            let county = educationData.find(d => {
                return d["fips"] === id;
            });
            let percentage = county["bachelorsOrHigher"];
            return percentage;
        })
        .on("mouseover", (event, data) => {
            let values = [event.pageX, event.pageY]
            let id = data["id"];
            let county = educationData.find(d => {
                return d["fips"] === id;
            });
            let percentage = county["bachelorsOrHigher"];

            tooltip.transition()
                .style("visibility", "visible")
                .style("left", values[0] + 10 + "px")
                .style("top", values[1] - 30 + "px");

            tooltip.text(`
                ${county["area_name"]}, ${county["state"]}: ${percentage}%
            `);

            tooltip.attr("data-education", percentage);
        })
        .on("mouseout", (event, data) => {
            tooltip.transition()
                .style("visibility", "hidden")
        })

        // Add legends
        const legendPercentage = [3, 12, 21, 30, 39, 48, 57, 66];
        const legendWidth = 800;
        const legendHeight = 60;

        const legend = d3.select("#legend")
            .attr("width", legendWidth)
            .attr("height", legendHeight)

        // legend x scale & x axis
        const legendXScale = d3.scaleLinear()
            .domain([
                d3.min(legendPercentage),
                d3.max(legendPercentage)
            ])
            .range([padding, (width - padding) / 2])

        const legendXAxis = d3.axisBottom(legendXScale);

        legend.selectAll("rect")
            .data(legendPercentage)
            .enter()
            .append("rect")
            .attr("height", 20)
            .attr("width", 50)
            .attr("x", p => legendXScale(p))
            .attr("y", 0)
            .attr("fill", p => {
                switch(true) {
                    case (p> 57): 
                    return "#006d2c";
                    break;
                    case (p > 48): 
                    return "#238b45";
                    break;
                    case (p > 39): 
                    return "#41ab5d";
                    break;
                    case (p > 30): 
                    return "#74c476";
                    break;
                    case (p > 21): 
                    return "#a1d99b";
                    break;
                    case (p > 12): 
                    return "#c7e9c0";
                    break;
                    default:
                    return "#e5f5e0";
                }
            })

        const rects = legend.selectAll("text")
            .data(legendPercentage)
            .enter()
            .append("text")
            .text(p => "> " + p + "%")
            .attr("x", p => legendXScale(p))
            .attr("y", legendHeight);
}

d3.json(countyURL).then(
    (data, error) => {
        if (error) console.log(error);
        else {
            countyData = topojson.feature(data, data.objects.counties).features;
            console.log("county data");
            console.log(countyData);

            d3.json(educationURL).then(
                (data, error) => {
                    if (error) console.log(error);
                    else {
                        educationData = data;
                        console.log("education data");
                        console.log(educationData);

                        drawChart();
                    }
                }
            )
        }
    }
)