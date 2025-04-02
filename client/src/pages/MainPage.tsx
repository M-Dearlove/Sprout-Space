import logo from "../assets/images/Logo.png";

function MainPage () {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <img 
        src={ logo } 
        alt="Logo" 
        className="w-40 h-40 object-contain"
      />
    </div>
  );
};

export default MainPage;