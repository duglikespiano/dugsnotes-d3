// https://www.youtube.com/watch?v=TOJ9yjvlapY

import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';
const DUMMY_DATA = [
	{ id: 1, value: 10, region: 'America' },
	{ id: 2, value: 13, region: 'Korea' },
	{ id: 3, value: 3, region: 'China' },
	{ id: 4, value: 6, region: 'India' },
];

const xScale = d3
	.scaleBand()
	.domain(DUMMY_DATA.map((d) => d.region))
	.rangeRound([0, 250])
	.padding(0.1);
const yScale = d3.scaleLinear().domain([0, 15]).range([250, 0]);

const container = d3
	.select('svg') //
	.classed('container', true); //

const bars = container
	.selectAll('.bar') //
	.data(DUMMY_DATA) //
	.enter() //
	.append('rect') //
	.classed('bar', true) //
	.attr('width', xScale.bandwidth()) //
	.attr('height', (d) => 250 - yScale(d.value)) //
	.attr('x', (d) => xScale(d.region))
	.attr('y', (d) => yScale(d.value));

setTimeout(() => {
	bars.data(DUMMY_DATA.slice(0, 2)).exit().remove();
}, 2000);
