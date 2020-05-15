#!/usr/bin/env node
let argv = require('yargs')
	.alias('n', 'name')
	.demand(['n'])
	.default({ name: 'xiangju' })
	.describe({ name: 'Your name' })
	.boolean(['private'])
	.argv;
console.log(process.argv);
console.log(argv);
console.log('hello', argv.name);
console.log(argv._);
