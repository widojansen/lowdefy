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

import { type } from '@lowdefy/helpers';

function createTypeDefinitions({ packageName, store, typeNames, typePrefix, version }) {
  if (type.isArray(typeNames)) {
    typeNames.forEach((typeName) => {
      store[`${typePrefix}${typeName}`] = {
        package: packageName,
        version,
      };
    });
  }
}

function createPluginTypesMap({ packageName, packageTypes, typePrefix = '', typesMap, version }) {
  createTypeDefinitions({
    typeNames: packageTypes.actions,
    store: typesMap.actions,
    packageName,
    typePrefix,
    version,
  });

  createTypeDefinitions({
    typeNames: packageTypes.blocks,
    store: typesMap.blocks,
    packageName,
    typePrefix,
    version,
  });

  createTypeDefinitions({
    typeNames: packageTypes.connections,
    store: typesMap.connections,
    packageName,
    typePrefix,
    version,
  });

  createTypeDefinitions({
    typeNames: type.isObject(packageTypes.operators) ? packageTypes.operators.client : [],
    store: typesMap.operators.client,
    packageName,
    typePrefix,
    version,
  });

  createTypeDefinitions({
    typeNames: type.isObject(packageTypes.operators) ? packageTypes.operators.server : [],
    store: typesMap.operators.server,
    packageName,
    typePrefix,
    version,
  });

  createTypeDefinitions({
    typeNames: packageTypes.requests,
    store: typesMap.requests,
    packageName,
    typePrefix,
    version,
  });

  if (type.isObject(packageTypes.styles)) {
    typesMap.styles[packageName] = packageTypes.styles;
  }

  if (type.isObject(packageTypes.icons)) {
    typesMap.icons[packageName] = packageTypes.icons;
  }
}

export default createPluginTypesMap;
