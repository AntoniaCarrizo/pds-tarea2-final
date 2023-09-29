import '@/styles/globals.css'

// _app.js
import { UserProvider } from './usercontext';

function MyApp({ Component, pageProps }) {
  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  );
}

export default MyApp;
