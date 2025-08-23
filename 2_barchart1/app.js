import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';

const data = await d3.json('data.json');
const years = data.years;
// Find the max value
const maxValue = d3.max(years, (d) => d.population);
console.log('maxValue:', maxValue);

// Declare the chart dimensions and margins.
const width = 640;
const height = 400;
const marginTop = 20;
const marginRight = 20;
const marginBottom = 30;
const marginLeft = 80;

// Declare the x (horizontal position) scale.
const x = d3
	.scaleBand()
	.domain(years.map((d) => d.year))
	.range([marginLeft, width - marginRight])
	.padding(0.1);

// Declare the y (vertical position) scale.

// Y scale (population values)
const y = d3
	.scaleLinear()
	.domain([0, maxValue]) // must be numbers
	.nice() // extend to a nice round number
	.range([height - marginBottom, marginTop]);

// Create the SVG container.
const svg = d3.create('svg').attr('width', width).attr('height', height);

// X axis
svg
	.append('g')
	.attr('transform', `translate(0,${height - marginBottom})`)
	.call(d3.axisBottom(x).tickValues(x.domain().filter((d, i) => i % 5 === 0))); // every 5 years

// Y axis
svg.append('g').attr('transform', `translate(${marginLeft},0)`).call(d3.axisLeft(y).ticks(10));

// Add a rect for each bar.
svg
	.append('g')
	.attr('fill', 'steelblue')
	.selectAll('rect')
	.data(years)
	.join('rect')
	.attr('x', (d) => x(d.year))
	.attr('y', (d) => y(d.population))
	.attr('height', (d) => y(0) - y(d.population))
	.attr('width', x.bandwidth());

// Append the SVG element.
document.querySelector('#container').append(svg.node());
