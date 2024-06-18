import { Outlet } from 'react-router-dom';

export default function DefaultLayout() {
  return (
    <>
      <nav className="flex justify-between">
        <p>
          <a href="/">logo</a>
        </p>
        <p>
          <a href="/teams">show all project</a>
        </p>
        <p>
          <a href="/setting">setting</a>
        </p>
        <p>
          <a href="/signin">logout</a>
        </p>
      </nav>
      <Outlet />
    </>
  );
}
