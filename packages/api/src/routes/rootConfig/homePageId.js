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

import getHomePageId from '../rootConfig/getHomePageId';
import getMenus from '../rootConfig/menus/getMenus';

async function homePageId(context) {
  // TODO: We can optimise here as we don't need to read menus if homepageId is configured
  // but not sure if it is worth the added complexity
  const menus = await getMenus(context);
  return getHomePageId(context, { menus });
}

export default homePageId;