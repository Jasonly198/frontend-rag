import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/config-global';

import { SvgColor } from 'src/components/svg-color';

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

// ----------------------------------------------------------------------

export const navData = [
  /**
   * MyWorkSpace
   */
  {
    subheader: 'MyWorkSpace1',
    items: [
      {
        // todo: change the url
        title: 'Personal',
        path: paths.dashboard.personal.root,
        icon: ICONS.user,
        children: [
          { title: 'Chatbot1', path: paths.dashboard.personal.root },
          { title: 'Chatbot2', path: paths.dashboard.personal.two },
          { title: 'Chatbot3', path: paths.dashboard.personal.three },
        ],
      },
      {
        title: 'Shared',
        path: paths.dashboard.group.root,
        icon: ICONS.user,
        children: [
          { title: 'Chatbot4', path: paths.dashboard.group.root },
          { title: 'Chatbot5', path: paths.dashboard.group.five },
          { title: 'Chatbot6', path: paths.dashboard.group.six },
        ],
      },

    ],
  },
  {
    subheader: 'MyWorkSpace2',
    items: [
      {
        // todo: change the url
        title: 'Personal',
        path: paths.dashboard.personal2.root,
        icon: ICONS.user,
        children: [
          { title: 'Chatbot1', path: paths.dashboard.personal2.root },
          { title: 'Chatbot2', path: paths.dashboard.personal2.two },
          { title: 'Chatbot3', path: paths.dashboard.personal2.three },
        ],
      },
      {
        title: 'Shared',
        path: paths.dashboard.group2.root,
        icon: ICONS.user,
        children: [
          { title: 'Chatbot4', path: paths.dashboard.group2.root },
          { title: 'Chatbot5', path: paths.dashboard.group2.five },
          { title: 'Chatbot6', path: paths.dashboard.group2.six },
        ],
      },

    ],
  },
];
