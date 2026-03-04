import React from 'react';

const footerStyles = `
  .subpie {
    background-color: #1a6a9a;
    padding: 30px 0 20px 0;
    color: #fff;
  }

  .pie {
    background-color: #155a85;
    padding: 14px 0;
    color: #fff;
  }

  .wrapper {
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 20px;
  }

  .subpie_p {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 40px;
  }

  .lili {
    flex: 1;
    min-width: 180px;
  }

  .lili h2 {
    font-size: 15px;
    font-weight: bold;
    color: #ffffff;
    margin-bottom: 12px;
    font-family: Arial, Helvetica, sans-serif;
  }

  .lili p {
    font-size: 13px;
    line-height: 2;
    font-family: Arial, Helvetica, sans-serif;
  }

  .lili p a {
    color: #cce8f8;
    text-decoration: none;
    display: block;
    transition: color 0.2s;
  }

  .lili p a:hover {
    color: #ffffff;
    text-decoration: underline;
  }

  .pie_p {
    font-size: 13px;
    color: #cce8f8;
    font-family: Arial, Helvetica, sans-serif;
    text-align: center;
  }

  .footer-logo {
    color: #fff !important;
    font-size: 15px;
    font-family: Arial, Tahoma, sans-serif;
    letter-spacing: -2px;
    text-decoration: none;
    font-style: italic;
  }

  .footer-logo-bold {
    font-family: 'Arial Black', Arial, sans-serif;
    font-style: italic;
    font-size: 15px;
  }
`;

const Footer = () => {
  return (
    <>
      <style>{footerStyles}</style>

      {/* SUBPIE - Links */}
      <div className="subpie no_imprimir_">
        <div className="wrapper">
          <ul className="subpie_p">

            {/* Ayuda */}
            <li className="lili">
              <h2>Ayuda</h2>
              <p>
                <a href="http://www.inteligente.pe/manual-del-usuario/" target="_blank" rel="noreferrer">Manual del usuario</a>
                <a href="http://www.inteligente.pe/listado-de-excel/" target="_blank" rel="noreferrer">Listado de Excel</a>
                <a href="http://e-consulta.sunat.gob.pe/ol-ti-itconsvalicpe/ConsValiCpe.htm" target="_blank" rel="noreferrer">Sunat s/clave SOL</a>
                <a href="http://www2.sunat.gob.pe/cpe/padronobligados.html" target="_blank" rel="noreferrer">Padron Obligado</a>
                <a href="http://inteligente.pe/codigo-producto-sunat-unspsc/" target="_blank" rel="noreferrer">codigo producto - SUNAT</a>
              </p>
            </li>

            {/* RED INTELIGENTE */}
            <li className="lili">
              <h2>RED INTELIGENTE</h2>
              <p>
                <a href="http://www.linealapp.com/" target="_blank" rel="noreferrer">linealapp.com</a>
                <a href="http://www.diseñowebperu.com" target="_blank" rel="noreferrer">diseñowebperu.com</a>
                <a href="http://www.fac-tura.com" target="_blank" rel="noreferrer">fac-tura.com</a>
                <a href="http://www.inteligente.pe/" target="_blank" rel="noreferrer">inteligente.pe</a>
              </p>
            </li>

            {/* Contáctenos */}
            <li className="lili">
              <h2>Contactenos</h2>
              <p>
                <a href="http://www.inteligente.pe/contacto/" target="_blank" rel="noreferrer">Soporte</a>
                <a href="http://www.inteligente.pe/contacto/" target="_blank" rel="noreferrer">Ventas</a>
                <a href="https://www.inteligente.pe/franquicia/" target="_blank" rel="noreferrer">Distribuidor</a>
                <span>0.050356864929199</span>
              </p>
            </li>

          </ul>
          <div style={{ clear: 'both' }}></div>
        </div>
      </div>

      {/* PIE - Copyright */}
      <div className="pie no_imprimir">
        <div className="wrapper">
          <div className="pie_p">
            &copy; 2009 - 2026{' '}
            <a href="http://www.inteligente.pe" className="footer-logo">
              <i>INTELI<span className="footer-logo-bold">GENTE</span></i>
            </a>
            . Todos los derechos reservados
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;