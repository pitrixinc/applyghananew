import { useEffect, useState } from 'react';
import { logVisit } from '@/utils/logVisit';  // Import the logVisit function
import { FaTimes } from 'react-icons/fa';

const VisitorTracker = () => {
  const [location, setLocation] = useState({
    ipAddress: '',
    country: '',
    countryCode: '',
    city: '',
    flagUrl: '',
    loading: true
  });
  const [isVisible, setIsVisible] = useState(false);  // To control the visibility of details

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await fetch("https://api.ipgeolocation.io/ipgeo?apiKey=b44b38aa748e446f881128d1afa43579");
        const data = await response.json();
        
        setLocation({
          ipAddress: data.ip,
          countryCode: data.country_code2.toLowerCase(),
          country: data.country_name,
          city: data.city,
          flagUrl: `https://flagcdn.com/w80/${data.country_code2.toLowerCase()}.png`,
          loading: false
        });
        
        // Log the visit with the location data
        logVisit(window.location.href, {
          ipAddress: data.ip,
          country: data.country_name,
          countryCode: data.country_code2,
          city: data.city,
          flagUrl: `https://flagcdn.com/w80/${data.country_code2.toLowerCase()}.png`,
        });

      } catch (error) {
        console.error('Error fetching location:', error);
        setLocation(prev => ({ ...prev, loading: false }));
      }
    };

    fetchLocation();
  }, []); // Empty dependency array to only run once on mount

  if (location.loading) return <div>Loading visitor data...</div>;

  return (
     <div>
      {/* Flag at the bottom-right corner 
      
      <div className="fixed bottom-4 right-4 z-50">
        {!isVisible ? (
        <div
          className="cursor-pointer w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300 shadow-lg"
          onClick={() => setIsVisible(!isVisible)} // Toggle visibility on click
        >
          <img src={location.flagUrl} alt={location.country} className="w-full h-full object-cover" />
        </div>
): (
        
          <div className="mt-2 bg-white p-4 shadow-xl rounded-lg max-w-xs w-full shadow-md">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-semibold">Your Info</h3>
              <button
                className="text-red-500 hover:text-red-700"
                onClick={() => setIsVisible(false)} // Close the tracker when clicked
              >
                <FaTimes size={20} />
              </button>
            </div>
           {/*} <p><strong>IP Address:</strong> {location.ipAddress}</p> 
            <p className='text-sm'><strong>Country:</strong> {location.country}</p>
            <p className='text-sm'><strong>City:</strong> {location.city}</p>
            <img src={location.flagUrl} alt={location.country} className="w-10 h-10 mt-2 " />
          </div>
        )}
      </div> */}
    </div>
  );
};

export default VisitorTracker;
