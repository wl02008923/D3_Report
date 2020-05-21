$(".btn").on("click", function() {
  let id = $(this).attr("id");
  $("#chart svg").remove();
  draw(data[`${id}`]);
});


function draw(dataset) {
  const margin = {
    left: 80,
    right: 80,
    top: 60,
    bottom: 60
  };
  const padding = 10;
  const width = 900;
  const height = 450;

  // const white = "#fff";
  // const orange = "#d85221";
  const green = "#aed581";

  let formatRound = d3.format(".0f");
  let formatComma = d3.format(",d");

  let chart = d3.select('#chart')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

  let xScale = d3.scaleBand()
    .domain(["December", "January", "February", "March"])
    .range([margin.left, width - margin.right])
    .padding(0.1);

  let yScale = d3.scaleLinear()
    .domain([0, d3.max(dataset, d => d.number)])
    .range([height - margin.bottom, margin.top]);

  let axis = chart.append('g').attr('class', 'axis');
  // x axis
  axis.append('g')
    .attr("transform", `translate(0, ${height - margin.bottom})`)
    .call(d3.axisBottom(xScale)
      .tickPadding(padding));
  // y axis left

  // y axis right
  axis.append('g')
    .attr('transform', `translate(${margin.left}, 0)`)
    .call(d3.axisLeft(yScale)
      .tickPadding(padding))
    .selectAll('text')
    .style('fill', green)
    .style('font-weight', 'bold');
  // x axis title
  axis.append('text')
    .attr('text-anchor', 'middle')
    .attr('x', width / 2)
    .attr('y', height - 5)
    .text('月份');

  axis.append('text')
    .attr('text-anchor', 'end')
    .attr('x', margin.left - padding)
    .attr('y', margin.top - 20)
    .text('入境人數');

  axis.selectAll('text')
    .style('font-size', 14);

  let data = dataset.slice(0, 4);
  // let barChart = chart.append('g').attr('class', 'bar-chart');
  let lineChart = chart.append('g').attr('class', 'line-chart');
  let line_tooltip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-30, 0])
    .html(d => {
      return `<div>入境人數 (${d.month})</div><div>${formatComma(d.number)} 人</div>`;
    });
  lineChart.call(line_tooltip);

  let line = lineChart.append('path')
    .datum(data)
    .attr('class', 'line')
    .attr('fill', 'none')
    .attr('stroke', green)
    .attr('stroke-width', 2)
    .attr('d', d3.line()
      .x(d => xScale(d.month) + xScale.bandwidth() / 2)
      .y(d => yScale(d.number)));

  let totalLength = line.node().getTotalLength();
  line.attr('stroke-dasharray', totalLength + " " + totalLength)
    .attr('stroke-dashoffset', totalLength)
    .transition()
    .duration(2000)
    .ease(d3.easeLinear)
    .attr('stroke-dashoffset', 0);

  let dot = lineChart.selectAll('.dot').data(data);
  dot.enter()
    .append('circle')
    .attr('class', 'dot')
    .attr('cx', d => xScale(d.month) + xScale.bandwidth() / 2)
    .attr('cy', d => yScale(d.number))
    .attr('fill', d => "white")
    .attr('stroke', green)
    .attr('stroke-width', 2)
    .attr('r', 0)
    .on("mouseover", line_tooltip.show)
    .on("mouseout", line_tooltip.hide)
    .transition()
    .duration(500)
    .delay((d, i) => i * 500)
    .ease(d3.easeLinear)
    .attr('r', 5);

  let dotLabel = lineChart.selectAll('.dot-label').data(data);
  dotLabel.enter()
    .append('text')
    .attr('class', 'dot-label')
    .text(d => formatComma(d.number))
    .attr('x', d => xScale(d.month) + xScale.bandwidth() / 2)
    .attr('y', d => yScale(d.number) - 15)
    .attr('text-anchor', 'middle')
    .attr('font-size', 12)
    .attr('opacity', 0)
    .transition()
    .duration(500)
    .delay((d, i) => i * 500)
    .ease(d3.easeLinear)
    .attr('opacity', 1);
}