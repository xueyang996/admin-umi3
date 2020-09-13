import { Breadcrumb } from 'antd';
import MyIcon from '@/components/MyIcon';
import pathToRegexp from 'path-to-regexp';

const BREAD_INFO = {
  '/componyInfo': [
    { name: '个人中心', url: '/policyMatch/personCenter', icon: 'iconshouye' },
    { name: '企业信息' },
  ],
  '/manageStaff': [
    { name: '个人中心', url: '/policyMatch/personCenter', icon: 'iconshouye' },
    { name: '员工管理' },
  ],
  '/myCollect': [
    { name: '个人中心', url: '/policyMatch/personCenter', icon: 'iconshouye' },
    { name: '我的收藏' },
  ],

  '/policyOrigin': [
    { name: '政策计算器', url: '/policyMatch/home', icon: 'iconshouye' },
    { name: '政策奖励' },
  ],
  '/rewardDetail': [
    { name: '政策计算器', url: '/policyMatch/home', icon: 'iconshouye' },
    { name: '政策奖励', url: '/policyMatch/policyOrigin?', queryKey: ['id'] },
    { name: '奖励详情' },
  ],
};

/**
 *
 * @param {string} path url地址
 */
export function getBreadInfo(path, query) {
  let type;
  let breadInfo;
  const result = Object.keys(BREAD_INFO).find(item => {
    const match = pathToRegexp(item).exec(path);
    if (match && match.length > 2) {
      type = match[1];
    }
    return !!match && match.length > 0;
  });

  if (result) {
    breadInfo = BREAD_INFO[result];
    let newBreadInfo = [];
    for (let i = 0; i < breadInfo.length; i++) {
      const element = breadInfo[i];
      if (element.url) {
        const index = element.url.indexOf(':');
        let url = element.url;
        if (index !== -1) {
          url = element.url.substring(0, index) + type;
        } else {
          if (element.queryKey) {
            element.queryKey.forEach(element => {
              url += `${element}=${query[element] || ''}&`;
            });
            url = url.substring(0, url.length - 1);
          }
        }
        newBreadInfo.push({
          name: element.name,
          url,
          icon: element.icon,
        });
      } else {
        newBreadInfo.push(element);
      }
    }
    breadInfo = newBreadInfo;
    return (
      <Breadcrumb
        style={{
          width: '1180px',
          margin: '0 auto',
          height: '80px',
          lineHeight: '80px',
        }}
      >
        {breadInfo.map(item => (
          <Breadcrumb.Item key={item.name}>
            {item.icon && (
              <MyIcon
                type={item.icon}
                style={{ marginRight: '8px', fontSize: '16px' }}
              ></MyIcon>
            )}
            {item.url ? <a href={item.url}>{item.name}</a> : item.name}
          </Breadcrumb.Item>
        ))}
      </Breadcrumb>
    );
  } else {
    return <div></div>;
  }
}
