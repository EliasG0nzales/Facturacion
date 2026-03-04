import Navbar from "../components/navbar";
import Footer from "../components/Footer";

function TipoCambio() {
  return (
    <>
      <Navbar />

      <div className="content">
        <h2>TIPO DE CAMBIO</h2>

        <div className="box">
          <label>Venta:</label>
          <input defaultValue="3.830" />

          <label>Compra:</label>
          <input defaultValue="3.830" />

          <button>Actualizar</button>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default TipoCambio;