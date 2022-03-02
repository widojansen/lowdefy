/*
  Copyright 2020-2021 Lowdefy, Inc

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

import path from 'path';
import { readFile, writeFile } from '@lowdefy/node-utils';

async function addCustomPluginsAsDeps({ context, directory }) {
  const packageJsonPath = path.join(directory, 'package.json');
  const packageJson = JSON.parse(await readFile(packageJsonPath));

  const devDependencies = packageJson.devDependencies;

  Object.values(context.plugins).forEach((plugin) => {
    devDependencies[plugin.name] = plugin.version;
  });

  // Sort dependencies
  packageJson.devDependencies = {};
  Object.keys(devDependencies)
    .sort()
    .forEach((name) => {
      packageJson.devDependencies[name] = devDependencies[name];
    });

  const newPackageJsonContent = JSON.stringify(packageJson, null, 2).concat('\n');
  await writeFile(packageJsonPath, newPackageJsonContent);
}

export default addCustomPluginsAsDeps;
