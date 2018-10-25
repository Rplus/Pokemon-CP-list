import pmData from '../pm-data-by-dex.json';
import pmName from '../pm-name.json';

console.log({ pmData, pmName });

let data = Object.values(pmData);

console.log(111);

console.log(pmData[1][0]);

console.log(data);
console.log(222);

// console.log(data);

export default {
  name: 'pmData2',
};
