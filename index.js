const width = 800;
const height = 400;
const margin = { top: 20, right: 20, bottom: 50, left: 60 };

const svg = d3.select("#scatterplot")
.attr("width", width)
.attr("height", height);

d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json")
.then(data => {
    data.forEach(d => {
        d.Year = new Date(d.Year.toString());
        d.Time = new Date("1970-01-01T00:" + d.Time.toString());
    })

    const xScale = d3.scaleTime()
    .domain([new Date("1993-01-01"), d3.max(data, d => d.Year)])
    .range([margin.left, width - margin.right]);

    const yScale = d3.scaleTime()
    .domain(d3.extent(data, d => d.Time))
    .range([height - margin.bottom, margin.top]);

    const xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%Y"));
    const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));

    svg.append("g")
    .attr("id", "x-axis")
    .attr("transform", `translate(0, ${height - margin.bottom})`)
    .call(xAxis);

    svg.append("g")
    .attr("id", "y-axis")
    .attr("transform", `translate(${margin.left}, 0)`)
    .call(yAxis);

    svg.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", d => `dot ${d.Doping ? "doping" : "no-doping"}`)
    .attr("cx", d => xScale(d.Year))
    .attr("cy", d => yScale(d.Time))
    .attr("r", 5)
    .attr("data-xvalue", d => d.Year.toISOString())
    .attr("data-yvalue", d => d.Time.toISOString())
    .on("mouseover", handleMouseOver)
    .on("mouseout", handleMouseOut)
})
.catch(error => console.error(error));

function handleMouseOver(event, d) {
    const tooltip = d3.select("#tooltip");
    tooltip.transition().duration(200).style("opacity", 0.9);
    tooltip.html(`Year: ${d.Year.getFullYear()}<br>Time: ${d3.timeFormat("%M:%S")(d.Time)}<br>Name: ${d.Name}<br>${d.Doping ? "Doping Allegation" : "No Doping Allegation"}`)
    .attr("data-year", d.Year.toISOString())
    .style("left", (event.pageX + 5) + "px")
    .style("top", (event.pageY - 28) + "px");
    tooltip.classed("hidden", false);
}

function handleMouseOut() {
    d3.select("#tooltip").transition().duration(500).style("opacity", 0);
    d3.select("#tooltip").classed("hidden", true);
}