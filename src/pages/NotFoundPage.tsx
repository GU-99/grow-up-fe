import { PiSmileySadFill } from 'react-icons/pi';
import { Link } from 'react-router-dom';
import Meta from '@components/common/Meta';
import Header from '@components/common/Header';

export default function NotFoundPage() {
  return (
    <>
      <Meta title="Grow Up: Not Found" />
      <Header />
      <section className="flex h-contents flex-col items-center justify-center">
        <span className="text-center text-regular tracking-tight text-emphasis">
          The page you are looking for doesn&#39;t exit or an other error occurred, go back to home page
        </span>
        <div className="m-12 flex items-center justify-center text-404 font-bold leading-none tracking-tighter">
          <div className="mr-12">
            <h3 className="text-main">Error 404</h3>
            <h3 className="text-emphasis">Page Not Found</h3>
          </div>
          <PiSmileySadFill className="size-75 text-main" />
        </div>
        <Link to="/" className="flex h-30 w-130 items-center justify-center rounded-sl bg-button hover:brightness-90">
          메인 페이지로 돌아가기
        </Link>
      </section>
    </>
  );
}
