import { OnboardingPage } from "./pages/onboarding";
import { useAuth } from "./hooks/useAuth";
import { useEffect } from "react";
import { getParties } from "./api/party";

const App = () => {
  const { isInitialized, isLoading } = useAuth();

  useEffect(() => {
    if (isInitialized) {
      getParties().then((res) => {
        console.log(res);
      });
    }
  }, [isInitialized, isLoading]);

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '16px'
      }}>
        앱을 로딩중입니다...
      </div>
    );
  }

  if (!isInitialized) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '16px',
        color: 'red'
      }}>
        앱 초기화에 실패했습니다. 페이지를 새로고침해주세요.
      </div>
    );
  }

  return <OnboardingPage />;
};

export default App;
