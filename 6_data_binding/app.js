// https://youtu.be/ZOeWdkq-L90?si=MprUseR3gz8Ndwhi

import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';

const countryData = {
	items: ['Korea', 'America', 'Mexico'],
	addItems(item) {
		this.items.push(item);
	},
	removeItems(index) {
		this.items.splice(index, 1);
	},
	updateItems(index, newItem) {
		this.items[index] = newItem;
	},
};

d3.select('ul') //
	.selectAll('li') //
	.data(countryData.items, (data) => data) //
	.enter() //
	.append('li') //
	.text((data) => data);

setTimeout(() => {
	countryData.addItems('Germany');
	d3.select('ul') //
		.selectAll('li') //
		.data(countryData.items, (data) => data) //
		.enter() //
		.append('li') //
		.classed('added', true) //
		.text((data) => data);
}, 1000);

setTimeout(() => {
	countryData.removeItems(0);
	d3.select('ul') //
		.selectAll('li') //
		.data(countryData.items, (data) => data) //
		.exit() //
		// .remove() //
		.remove() //
		.classed('redundant', true); //
}, 3000);

setTimeout(() => {
	const updatedCountryName = 'Poland';
	countryData.updateItems(1, updatedCountryName);
	d3.select('ul') //
		.selectAll('li') //
		.data(countryData.items, (data) => data) //
		.exit() //
		.classed('updated', true) //
		.text(updatedCountryName);
}, 5000);
