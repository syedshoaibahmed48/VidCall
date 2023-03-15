import Controls from '../components/Controls';
import Notification from '../components/Notification';

const LandingPage = () => {

    return (
        <div className="landingPageContainer">
            <h1>📲<u>Video Chat</u></h1>
            <Controls />
            <Notification/>
        </div>
    );

};

export default LandingPage;