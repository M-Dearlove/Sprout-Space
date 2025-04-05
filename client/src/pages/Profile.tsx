import { useQuery } from '@apollo/client';
import { QUERY_ME } from '../graphQL/queries';
import '../styles/Profile.css';

const ProfilePage = () => {
  const { loading, error, data } = useQuery(QUERY_ME);

  if (loading) return <p>Loading your garden plans...</p>;
  if (error) return <p>Error loading profile: {error.message}</p>;

  //destructure data
  const { firstname } = data.me;
  const gardenPlotTemp = false;

  return (
    // Main container
    <div className="profilePage-container">
      <div className="profile-container">
        {/* Header Container*/}
        <div className="profile-header">
          <h1>{firstname}'s Garden Plans</h1>
          <p>"The glory of gardening: hands in the dirt, head in the sun, heart with nature." - Alfred Austin </p>
        </div>
        <div className="savedPlot-container">
          {/* Garden Plots Container */}
          {gardenPlotTemp ? (
            <div>
              <p>Plot 1</p>
              <p>Plot 2</p>
            </div>
          ) : (
            <p>You have no garden plots saved</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfilePage;