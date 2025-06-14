import CPSAssessment from '../components/CPSAssessment';
import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>Perfil Innovador - Evaluación</title>
        <meta name="description" content="Descubre tu estilo único de resolución de problemas" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <CPSAssessment />
      </main>
    </>
  );
}