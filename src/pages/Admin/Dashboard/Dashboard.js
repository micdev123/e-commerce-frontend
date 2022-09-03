import { Helmet } from 'react-helmet-async'
import FeaturedInfo from '../../../components/FeaturedInfo';
import SideNav from '../../../components/SideNav';
import WidgetLg from '../../../components/WidgetLg';
import WidgetSm from '../../../components/WidgetSm';


import "../Dashboard/dashboard.css";




const Dashboard = () => {
    return (
        <div>
            <Helmet>
                <title>Dashboard | Home</title>     
            </Helmet>
            <div className='admin_container'>
                <SideNav/>
                <div className='container_contents'>
                    <FeaturedInfo />
                    <div className="homeWidgets">
                        <WidgetSm />
                        <WidgetLg />
                    </div>
                </div>
            </div>
        </div>
    ) 
}

export default Dashboard