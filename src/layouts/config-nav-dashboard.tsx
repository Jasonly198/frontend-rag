import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/config-global';

import { SvgColor } from 'src/components/svg-color';
import { useEffect, useState } from 'react';

import axios from 'axios';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`${CONFIG.assetsDir}/assets/icons/navbar/${name}.svg`} />
);

const ICONS = {
  job: icon('ic-job'),
  blog: icon('ic-blog'),
  chat: icon('ic-chat'),
  mail: icon('ic-mail'),
  user: icon('ic-user'),
  file: icon('ic-file'),
  lock: icon('ic-lock'),
  tour: icon('ic-tour'),
  order: icon('ic-order'),
  label: icon('ic-label'),
  blank: icon('ic-blank'),
  kanban: icon('ic-kanban'),
  folder: icon('ic-folder'),
  course: icon('ic-course'),
  banking: icon('ic-banking'),
  booking: icon('ic-booking'),
  invoice: icon('ic-invoice'),
  product: icon('ic-product'),
  calendar: icon('ic-calendar'),
  disabled: icon('ic-disabled'),
  external: icon('ic-external'),
  menuItem: icon('ic-menu-item'),
  ecommerce: icon('ic-ecommerce'),
  analytics: icon('ic-analytics'),
  dashboard: icon('ic-dashboard'),
  parameter: icon('ic-parameter'),
};


const fetchWorkspaces = async () => {
  console.log('Fetching workspaces...');
  try {
    const response = await axios.get('http://localhost:8080/ragApplications/workspace/list');
    console.log('Fetched workspaces:', response.data); 
    return response.data; 
  } catch (error) {
    console.error('Error fetching workspaces:', error);
    return [];
  }
};


const buildNavData = (workspaces: any[]) => 
  workspaces.map((workspace: any, index: number) => ({
    subheader: workspace.name, 
    items: [
      {
        title: 'Chat',
        path: `/${workspace.name.replace(/\s+/g, '-')}/chat`,
        icon: ICONS.chat,
      } 
    ],
  }));

export const navData = await (async () => {
  const workspaces = await fetchWorkspaces();
  return buildNavData(workspaces);
})();


