import { IConfig } from 'umi-types';

// ref: https://umijs.org/config/
const config: IConfig = {
  treeShaking: true,
  routes: [
    {
      path: '/',
      component: '../layouts/index',
      routes: [
        { path: '/', component: '../pages/index' }
      ]
    }
  ],
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    ['umi-plugin-react', {
      antd: false,
      dva: false,
      dynamicImport: false,
      title: 'umi-auto-complete',
      dll: false,
      routes: {
        exclude: [
          /components\//,
        ],
      },
      locale: {
        enable: true, // default false
        default: 'zh-CN', // default zh-CN
        baseNavigator: true, // default true, when it is true, will use `navigator.language` overwrite default
      }
    }],
  ],
  "theme": {
    "primary-color": "#1DA57A",
    "hight-light-color": "#43d6a7",
    "text-background-color": "#F5F5F2",
  },
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
}



export default config;
