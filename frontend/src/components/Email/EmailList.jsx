import { NavLink } from 'react-router-dom';

const EmailList = ({ emails, loadMoreEmails }) => {
  return (
    <div className="p-4">
      {emails.map(email => (
        <NavLink to={`/email/${email._id}`} key={email._id} className="block p-4 border-b">
          <div>{email.subject}</div>
          <div>{email.sender}</div>
          <div>{email.body.substring(0, 100)}...</div>
        </NavLink>
      ))}
      <button onClick={loadMoreEmails} className="bg-blue-500 text-white p-2 rounded mt-4">
        Load More
      </button>
    </div>
  );
};

export default EmailList;
