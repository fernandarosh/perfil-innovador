import CPSAssessment from '../components/CPSAssessment';
import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        {/* Metadatos básicos */}
        <title>Evaluación de Perfil Innovador - Descubre tu Potencial de Innovación</title>
        <meta name="description" content="Evalúa tu perfil innovador con nuestra herramienta especializada. Descubre tus fortalezas creativas y recibe recomendaciones personalizadas para potenciar tu capacidad de innovación." />
        <meta name="keywords" content="perfil innovador, evaluación innovación, creatividad, emprendimiento, liderazgo innovador, transformación digital" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://perfil-innovador.blackbot.rocks/" />
        <meta property="og:title" content="Evaluación de Perfil Innovador - Descubre tu Potencial" />
        <meta property="og:description" content="Evalúa tu perfil innovador con nuestra herramienta especializada. Descubre tus fortalezas creativas y recibe recomendaciones personalizadas." />
        <meta property="og:image" content="https://perfil-innovador.blackbot.rocks/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="Perfil Innovador" />
        <meta property="og:locale" content="es_ES" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://perfil-innovador.blackbot.rocks/" />
        <meta name="twitter:title" content="Evaluación de Perfil Innovador - Descubre tu Potencial" />
        <meta name="twitter:description" content="Evalúa tu perfil innovador con nuestra herramienta especializada. Descubre tus fortalezas creativas y recibe recomendaciones personalizadas." />
        <meta name="twitter:image" content="https://perfil-innovador.blackbot.rocks/og-image.png" />

        {/* Metadatos adicionales */}
        <meta name="author" content="BlackBot" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="Content-Language" content="es" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://perfil-innovador.blackbot.rocks/" />
      </Head>
      
      <main>
        <CPSAssessment />
      </main>
    </>
  );
}
