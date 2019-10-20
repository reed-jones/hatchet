#!/usr/bin/env node

// Import Hatchet
const { Hatchet } = require('./hatchetHelpers')

// Parse Command Line Arguments
const argv = require('yargs').argv

// load the configuration file
new Hatchet(require(argv.config))
