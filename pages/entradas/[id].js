import { useRouter } from 'next/router';
import styles from './Entradas.module.css';

const Entrada = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div className={styles.container}>
      <style jsx global>{`
        body {
          background-color: #ffc0cb; /* Color de fondo rosado pastel */
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          width: 100%; /* Asegura que todo el contenido del body ocupe el 100% del ancho */
        }
      `}</style>
      <div style={{ padding: '16px' }}>
        <h1 style={{ fontSize: '2rem', textAlign: 'center' }}>👑 Gala Camelia Studio 2023 👑</h1>
        <h2 style={{ fontSize: '1.5rem' }}>Entrada n°: {id}</h2> {/* Aumentar el tamaño del h2 */}
        <br></br>
        <p className={styles.description}>
          Cada entrada es válida para un único asiento y cuenta con un código único que previene la falsificación. La admisión se realiza por orden de llegada, el número de entrada es solo un verificador.
        </p>
        <br></br>
        <img src="/imagenes/img.png" alt="Descripción de la imagen" style={{ width: '100%' }} />
      </div>
    </div>
  );
};

export default Entrada;
