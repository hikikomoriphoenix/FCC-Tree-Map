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
    .attr("height", h);

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
    .attr("x", d => d.x0)
    .attr("y", d => d.y0)
    .attr("width", d => d.x1 - d.x0)
    .attr("height", d => d.y1 - d.y0)
    .style("stroke", "LightGrey")
    .style("fill", d => colorScale(d.parent.data.name));

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
}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
