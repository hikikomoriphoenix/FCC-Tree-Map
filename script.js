fetch("https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json")
  .then(response => response.json())
  .then(dataset => showTreeMap(dataset));

function showTreeMap(dataset) {
  const w = 1200;
  const h = 800;

  const svg = d3.select("main")
    .append("svg")
    .attr("id", "treemap")
    .attr("width", w)
    .attr("height", h)
    .style("margin-top", "50px");

  const root = d3.hierarchy(dataset).sum(d => d.value);

  d3.treemap()
    .size([w, h])
    (root);

  const colorScale = d3.scaleOrdinal()
    .domain(dataset.children.map(c => c.name))
    .range(["DarkOliveGreen", "chocolate", "brown", "green", "blue", "indigo", "violet"]);

  svg.selectAll("rect")
    .data(root.leaves())
    .enter()
    .append("rect")
    .attr("class", "tile")
    .attr("x", d => d.x0)
    .attr("y", d => d.y0)
    .attr("width", d => d.x1 - d.x0)
    .attr("height", d => d.y1 - d.y0)
    .style("stroke", "#222")
    .style("fill", d => colorScale(d.parent.data.name))
    .attr("data-name", d => d.data.name)
    .attr("data-category", d => d.data.category)
    .attr("data-value", d => d.data.value);

  d3.select("main")
    .selectAll("div")
    .data(root.leaves())
    .enter()
    .append("div")
    .attr("class", "cell-text")
    .style("left", d => {
      const svgRect = document.getElementById("treemap").getBoundingClientRect();
      return (svgRect.x + d.x0 + 5) + "px";
    })
    .style("top", d => {
      const svgRect = document.getElementById("treemap").getBoundingClientRect();
      return (svgRect.y + d.y0 + 5) + "px";
    })
    .html(d => d.data.name.replace(/ (?=[A-Z][^A-Z])/g, "<br>"));

  const legendW = 280;
  const legendH = 160;
  const legendItemSize = 40;
  const legendPadding = 160;

  const legend = d3.select("main")
  .append("svg")
  .attr("id", "legend")
  .attr("width", legendW + legendPadding*2)
  .attr("height", legendH)
  .style("margin-top", "50px");

  legend.selectAll("rect")
  .data(dataset.children.map(c => c.name))
  .enter()
  .append("rect")
  .attr("class", "legend-item")
  .attr("x", (d,i) => legendPadding + legendItemSize * i)
  .attr("y", (d,i) => legendH - legendItemSize)
  .attr("width", legendItemSize)
  .attr("height", legendItemSize)
  .attr("fill", d => colorScale(d));

  legend.selectAll("text")
  .data(dataset.children.map(c => c.name))
  .enter()
  .append("text")
  .attr("x", 0)
  .attr("y", 0)
  .attr("fill", "white")
  .attr("transform", (d,i) =>
   `translate(${legendPadding + legendItemSize * i + 20},${legendH - legendItemSize - 5})rotate(-60)`)
  .style("text-anchor", "start")
  .style("font-size", "18px")
  .text(d => d);
}
