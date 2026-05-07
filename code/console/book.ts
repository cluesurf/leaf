#!/usr/bin/env node

import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

void yargs(hideBin(process.argv))
  .scriptName('book')
  .demandCommand(1)
  .strict()
  .help()
  .parse()
