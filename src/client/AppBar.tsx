import { Link } from 'react-router-dom';

export const AppBar = () => {
  return (
    <nav style={{ display: 'flex', gap: 12, justifyContent: 'center', paddingBottom: 12}}>
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
    </nav>
  )
};