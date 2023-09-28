import '@/styles/globals.css'
import { PreguntaProvider } from 'pages/PreguntaContext.js'; // Asegúrate de que la capitalización coincida

export default function App({ Component, pageProps }) {
  return (
    <PreguntaProvider>
      <Component {...pageProps} />
    </PreguntaProvider>
  );
}
