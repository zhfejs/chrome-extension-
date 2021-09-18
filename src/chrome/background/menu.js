/*
 * @Description:
 * @Autor: zhenghui
 * @Date: 2021-09-17 17:37:15
 */
import { getSystemMapList } from '@/api';
import { sortBy } from 'lodash-es';
import sysJson from '@/assets/json/sys.json';

const baseMenu = [{ id: 'system', visible: true, title: 'FFITM小助手' }];
const staticMenu = [
  { id: 'static1', visible: true, title: 'FFITM工作台', parentId: 'system' },
];

const createMenu = (menuData) => {
  baseMenu.forEach(({ id, visible, title }) => {
    chrome.contextMenus.create({
      id,
      visible,
      title,
    });
  });
  staticMenu.forEach(({ id, visible, title, parentId }) => {
    chrome.contextMenus.create({   
      id,
      visible,
      title,
      parentId,
      onclick() {
        window.open('index.html', '_blank');
      },
    });
  });
  menuData.forEach(({ oderId, systemName, url }) => {
    chrome.contextMenus.create({
      id: oderId,
      visible: true,
      title: systemName,
      parentId: 'system',
      onclick() {
        window.open(url, '_blank');
      },
    });
  });
};

export const getMenuList = async () => {
  try {
    const { data } = await getSystemMapList();
    return sortBy(data, 'orderId') || sysJson;
  } catch {
    return sysJson;
  }
};

export const menuMain = async () => {
  const menuData = await getMenuList();
  createMenu(menuData);
};
