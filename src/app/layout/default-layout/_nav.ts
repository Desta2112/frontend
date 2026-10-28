import { INavData } from '@coreui/angular';

export interface INavDataWithPermissions extends INavData {
  permissions?: string[];
  children?: INavDataWithPermissions[];
}
export const navItems: INavDataWithPermissions[] = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    iconComponent: { name: 'cil-speedometer' },
  },
  {
    name: 'User Mangment',
    url: '/user',
    iconComponent: { name: 'cil-people' },
  },
  {
    name: 'Role Management',
    iconComponent: { name: 'cil-list' },

    children: [
      {
        name: 'Permission',
        url: '/permission',
        icon: 'nav-icon-bullet',
      },
      {
        name: 'Role-Permission',
        url: '/role-permission',
        icon: 'nav-icon-bullet',
      },
    ],
  },

  {
    name: 'Question',
    url: 'question',
    iconComponent: { name: 'cilPencil' },
  },

  {
    name: 'Answer',
    url: 'answer',
    iconComponent: { name: 'cilPencil' },
  },
  {
    name: 'Course',
    url: 'course',
    iconComponent: { name: 'cilPencil' },
  },

  {
    name: 'course Request',
    url: 'course-request',
    iconComponent: { name: 'cilPencil' },
  },
];
