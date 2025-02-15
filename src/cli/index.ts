#!/usr/bin/env node

/**
 * Copyright 2019, SumUp Ltd.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import yargs from 'yargs';

import { run, RunParams } from './run';
import { init, InitParams } from './init';
import { DEFAULT_OPTIONS } from './defaults';

// eslint-disable-next-line no-void
void yargs
  .command(
    'init',
    "Initialize Foundry's tools in your project",
    {
      openSource: {
        alias: 'o',
        desc: 'Whether the project is open-source',
        type: 'boolean',
      },
      publish: {
        desc: 'Whether to publish to NPM',
        type: 'boolean',
      },
      configDir: {
        alias: 'c',
        desc: 'The directory to write configs to',
        type: 'string',
        default: DEFAULT_OPTIONS.configDir,
      },
      overwrite: {
        desc: 'Whether to overwrite existing config files',
        type: 'boolean',
        default: DEFAULT_OPTIONS.overwrite,
      },
    },
    execute('init'),
  )
  .command(
    'run <tool> [...tool options]',
    'Run any of the bundled tools.',
    execute('run'),
  )
  .showHelpOnFail(true)
  .demandCommand(1, '')
  .help()
  .version().argv;

type CommandType = 'init' | 'run';

function execute(command: CommandType) {
  const commands = { run, init };
  const commandFn = commands[command];

  return (args: unknown): void => {
    // eslint-disable-next-line no-console
    commandFn(args as RunParams & InitParams).catch(console.error);
  };
}
