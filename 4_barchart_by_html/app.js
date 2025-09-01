// https://youtu.be/g5bp02-CRAc?si=dmIyAfmNRBedvw_q
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';
const DUMMY_DATA = [
	{ id: 1, value: 10, region: 'America' },
	{ id: 2, value: 16, region: 'Korea' },
	{ id: 3, value: 3, region: 'China' },
	{ id: 4, value: 6, region: 'India' },
];

const container = d3
	.select('div') //
	.classed('container', true) //
	.style('border', '1px solid red');

const bars = container
	.selectAll('.bar') //
	.data(DUMMY_DATA) //
	.enter() //
	.append('div') //
	.classed('bar', true) //
	.style('width', '50px') //
	.style('height', (d) => `${250 - d.value * 12}px`);
