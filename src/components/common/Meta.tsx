import { Helmet } from 'react-helmet-async';
import logo from '@assets/logo.svg';

type MetaProps = {
  title?: string;
};

export default function Meta({ title = 'Grow up' }: MetaProps) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content="팀원과 함께 프로젝트를 진행하며 개인 역량을 성장시켜 보세요" />
      <meta property="og:title" content="Grow Up" />
      <meta property="og:description" content="팀원과 함께 프로젝트를 진행하며 개인 역량을 성장시켜 보세요" />
      <meta property="og:image" content={logo} />
      <meta property="og:url" content="https://www.growup.kr/" />
      <meta property="og:type" content="website" />
    </Helmet>
  );
}
