import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="w-64 h-full bg-gray-900 text-white">
      <button className="bg-blue-500 text-white p-2 m-4 rounded">New message</button>
      <nav className="mt-10">
        <NavLink to="/" className="block p-3 hover:bg-gray-700">All inboxes</NavLink>
        <NavLink to="/starred" className="block p-3 hover:bg-gray-700">Starred</NavLink>
        <NavLink to="/archive" className="block p-3 hover:bg-gray-700">Archive</NavLink>
        <NavLink to="/trash" className="block p-3 hover:bg-gray-700">Trash</NavLink>
        <NavLink to="/spam" className="block p-3 hover:bg-gray-700">Spam</NavLink>
        <NavLink to="/sent" className="block p-3 hover:bg-gray-700">Sent</NavLink>
        <NavLink to="/read-later" className="block p-3 hover:bg-gray-700">Read Later</NavLink>
        <NavLink to="/drafts" className="block p-3 hover:bg-gray-700">Drafts</NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
