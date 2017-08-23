import Base from './components/Base/Base.jsx';
import HomePage from './containers/HomePage/HomePage.jsx';

const routes = [
  {
    component: Base,
    routes:[
      {
        path: '/stock-app/',
        exact: true,
        component: HomePage
      },
    ]
  }
]

export default routes;