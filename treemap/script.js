import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const videogameURL = "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json"

let videogameData;

// Declare the chart dimensions cand margins.
const width = 1000;
const height = 600;
const padding = 60;

const drawChart = () => {
    const hierarchy = d3.hierarchy(videogameData, (node) => {
        return node["children"]
    }).sum((node) => {
        return node["value"];
    }).sort((node1, node2) => {
        return node2["value"] - node1["value"];
    })

    // tooltip
    const tooltip = d3.select("#tooltip");

    //Create Treemap
    const createTreemap = d3.treemap().size([1000, 600]);
    createTreemap(hierarchy);

    const videogameTiles = hierarchy.leaves();

    const svg = d3.select("#map");

    // Drawing Treemap
    const block = svg.selectAll("g")
        .data(videogameTiles)
        .enter()
        .append("g")
        .attr("transform", tile => {
            return "translate(" + tile["x0"] + ", " + tile["y0"] + ")";
        });
    // Append rect
    block.append("rect")
        .attr("class", "tile")
        .attr("fill", tile => {
            switch(tile["data"]["category"]) {
                case "Wii": return "rgb(76, 146, 195)"; break;
                case "GB": return "rgb(255, 201, 147)"; break;
                case "PS2": return "rgb(222, 82, 83)"; break;
                case "SNES": return "rgb(209, 192, 221)"; break;
                case "GBA": return "rgb(233, 146, 206)"; break;
                case "2600": return "rgb(210, 210, 210)"; break;
                case "DS": return "rgb(190, 210, 237)"; break;
                case "PS3": return "rgb(86, 179, 86)"; break;
                case "3DS": return "rgb(255, 173, 171)"; break;
                case "PS": return "rgb(163, 120, 111)"; break;
                case "XB": return "rgb(249, 197, 219)"; break;
                case "PSP": return "rgb(201, 202, 78)"; break;
                case "X360": return "rgb(255, 153, 62)"; break;
                case "NES": return "rgb(173, 229, 161)"; break;
                case "PS4": return "rgb(169, 133, 202)"; break;
                case "N64": return "rgb(208, 176, 169)"; break;
                case "PC": return "rgb(153, 153, 153)"; break;
                case "XOne": return "rgb(226, 226, 164)"; break;
                default: return "pink";
            }
        })
        .attr("data-name", tile => tile["data"]["name"])
        .attr("data-category", tile => tile["data"]["category"])
        .attr("data-value", tile => tile["data"]["value"])
        .attr("width", tile => {
            return tile["x1"] - tile["x0"];
        })
        .attr("height", tile => {
            return tile["y1"] - tile["y0"];
        })
        // Add tooltip
        .on("mouseover", (event, tile) => {
            let values = [event.pageX, event.pageY]
            tooltip.transition()
                .style("visibility", "visible")
                .style("left", values[0] + "px")
                .style("top", values[1] - 10 + "px");

            tooltip.text(`
            Name: ${tile["data"]["name"]},
            Category: ${tile["data"]["category"]},
            Value: ${tile["data"]["value"]}
            `);

            tooltip.attr("data-value", tile["data"]["value"])
        })
        .on("mouseout", (event, tile) => {
            tooltip.transition()
                .style("visibility", "hidden");
        })

    // Append text to each rect
    block.append("text")
        .text(tile => {
            return tile["data"]["name"];
        })
        .attr("class", "name")
        .attr("x", 10)
        .attr("y", 20);

    // get all categories
    let categoriesData = [];
    videogameTiles.forEach(tile => {
        categoriesData.push(tile["data"]["category"]);
    })
    const categories = [...new Set(categoriesData)];

      // Drawing legends
    const legendSize = 20;

    const legend = d3.select("#legend")
        .attr("width", 600)
        .attr("height", 200);

    const legendItems = legend.selectAll("g")
        .data(categories)
        .enter()
        .append("g")
        .attr("transform", position);

    legendItems.append("text")
        .attr("x", legendSize + 5)
        .attr("y", legendSize - 5)
        .text(c => c);

    legendItems.append("rect")
        .attr("class", "legend-item")
        .attr("height", legendSize)
        .attr("width", legendSize)
        .attr("fill", c => {
            switch(c) {
                case "Wii": return "rgb(76, 146, 195)"; break;
                case "GB": return "rgb(255, 201, 147)"; break;
                case "PS2": return "rgb(222, 82, 83)"; break;
                case "SNES": return "rgb(209, 192, 221)"; break;
                case "GBA": return "rgb(233, 146, 206)"; break;
                case "2600": return "rgb(210, 210, 210)"; break;
                case "DS": return "rgb(190, 210, 237)"; break;
                case "PS3": return "rgb(86, 179, 86)"; break;
                case "3DS": return "rgb(255, 173, 171)"; break;
                case "PS": return "rgb(163, 120, 111)"; break;
                case "XB": return "rgb(249, 197, 219)"; break;
                case "PSP": return "rgb(201, 202, 78)"; break;
                case "X360": return "rgb(255, 153, 62)"; break;
                case "NES": return "rgb(173, 229, 161)"; break;
                case "PS4": return "rgb(169, 133, 202)"; break;
                case "N64": return "rgb(208, 176, 169)"; break;
                case "PC": return "rgb(153, 153, 153)"; break;
                case "XOne": return "rgb(226, 226, 164)"; break;
            default: return "pink";
            }
        })
}

// function to divide legendItems into 3 columns
function position(d, i) {
    var c = 6;   // number of columns
    var h = 60;  // height of each entry
    var w = 100; // width of each entry (so you can position the next column)
    var tx = 10; // tx/ty are essentially margin values
    var ty = 10;
    var x = i % c * w + tx;
    var y = Math.floor(i / c) * h + ty;
    return "translate(" + x + "," + y + ")";
}

d3.json(videogameURL).then(
  (data, error) => {
    if (error) {
      console.log(error)
    } else {
      videogameData = data;
      drawChart();
    }
  }
)