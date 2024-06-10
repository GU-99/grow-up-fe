import { Outlet, useParams } from 'react-router-dom';

export default function ProjectLayout() {
  return (
    <>
      <h3>Project Layout</h3>
      <Outlet />
    </>
  );
}
