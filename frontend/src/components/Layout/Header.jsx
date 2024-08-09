const Header = () => {
    return (
      <header className="flex justify-between items-center p-4 bg-white shadow">
        <input type="text" placeholder="Search for messages..." className="p-2 rounded border" />
        <div className="flex items-center">
          <img src="/path/to/profile.jpg" alt="Profile" className="w-8 h-8 rounded-full" />
        </div>
      </header>
    );
  };
  
  export default Header;
  