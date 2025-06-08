import { OnboardingPage } from './pages/onboarding';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useMetadata } from './contexts/metadata-context/metadata-context';

const App = () => {
  const { status } = useMetadata();

  if (status === 'pending') {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          fontSize: '16px',
        }}
      >
        메타데이터를 로딩중입니다...
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          fontSize: '16px',
        }}
      >
        메타데이터 로딩 중 오류가 발생했습니다.
      </div>
    );
  }

  return (
    <>
      <OnboardingPage />
      <ReactQueryDevtools initialIsOpen={false} />
    </>
  );
};

export default App;
