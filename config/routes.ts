export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './user/login',
      },
    ],
  },
  {
    path: '/welcome',
    name: 'welcome',
    icon: 'smile',
    component: './Welcome',
  },
  {
    path: '/admin',
    name: 'admin',
    icon: 'crown',
    access: 'canAdmin',
    component: './Admin',
    routes: [
      {
        path: '/admin/sub-page',
        name: 'sub-page',
        icon: 'smile',
        component: './Welcome',
      },
    ],
  },
  {
    name: 'list.table-list',
    icon: 'table',
    path: '/list',
    component: './ListTableList',
  },
  {
    name: '表单页面',
    icon: 'table',
    path: '/searchTable/demoConfig',
    component: './SearchTable',
  },
  {
    name: '组件展示',
    icon: 'table',
    path: '/demoCom',
    component: './DemoComponents',
  },
  {
    name: 'ii-admin-base组件展示',
    icon: 'table',
    path: '/ii-base',
    component: './IIBaseDemo',
  },
  {
    path: '/',
    redirect: '/welcome',
  },
  {
    component: './404',
  },
];
