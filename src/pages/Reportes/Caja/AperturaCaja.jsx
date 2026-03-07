import { useState, useEffect } from "react";

const styles = `
.content {
  background-color: #ffffff;
  padding: 20px;
  color: #212529;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 13px;
}

.titulo-apertura {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 24px;
}

.titulo-apertura .icono-ayuda {
  width: 20px;
  height: 20px;
  background: #00A3E1;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: bold;
  font-size: 12px;
  cursor: pointer;
  flex-shrink: 0;
}

.apertura-center {
  display: flex;
  justify-content: center;
}

.apertura-form {
  width: 340px;
}

.apertura-tabla {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 16px;
}

.apertura-tabla tr td {
  padding: 10px 6px;
  vertical-align: middle;
}

.apertura-tabla .label-moneda {
  font-size: 16px;
  font-weight: bold;
  color: #212529;
  width: 40%;
  text-align: right;
  padding-right: 12px;
}

.apertura-tabla .campo-moneda {
  width: 60%;
}

.apertura-tabla .campo-moneda input {
  padding: 6px 8px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 13px;
  background: #fff;
  color: #212529;
  width: 120px;
  outline: none;
  transition: border-color .2s, box-shadow .2s;
}

.apertura-tabla .campo-moneda input:focus {
  border-color: #80bdff;
  box-shadow: 0 0 0 .2rem rgba(0,123,255,.25);
}

.apertura-tabla .campo-moneda .separador {
  margin-right: 6px;
  color: #555;
  font-size: 13px;
}

.btn-guardar {
  background-color: #00A3E1;
  border: 1px solid #00A3E1;
  color: #ffffff;
  padding: 7px 18px;
  cursor: pointer;
  font-size: 13px;
  font-weight: bold;
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.btn-guardar:hover {
  background-color: #0092c9;
  border-color: #0092c9;
}

.botones-apertura {
  display: flex;
  justify-content: center;
  margin-top: 4px;
}

/* Toast */
.toast {
  position: fixed;
  bottom: 24px;
  right: 24px;
  background: #28a745;
  color: #fff;
  padding: 12px 20px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: bold;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  z-index: 99999;
  animation: fadeInOut 3s forwards;
}

@keyframes fadeInOut {
  0%   { opacity: 0; transform: translateY(10px); }
  10%  { opacity: 1; transform: translateY(0); }
  80%  { opacity: 1; }
  100% { opacity: 0; }
}
`;

const IconFloppy = ({ size = 15, color = "#fff" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
    <path d="M17 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7l-4-4zm-5 16a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm5-10H7V7h10v2z" fill={color} />
  </svg>
);

const pad = (n) => String(n).padStart(2, "0");

const AperturaCaja = () => {
  const [soles, setSoles] = useState("");
  const [dolares, setDolares] = useState("");
  const [ahora, setAhora] = useState(new Date());
  const [toast, setToast] = useState(null);

  // Reloj en tiempo real
  useEffect(() => {
    const timer = setInterval(() => setAhora(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fechaStr = `${pad(ahora.getDate())}/${pad(ahora.getMonth() + 1)}/${ahora.getFullYear()}`;
  const horaStr  = `${pad(ahora.getHours())}:${pad(ahora.getMinutes())}`;

  const handleGuardar = (e) => {
    e.preventDefault();
    setToast(`Apertura guardada — S/ ${soles || "0"} | US$ ${dolares || "0"}`);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <>
      <style>{styles}</style>
      {toast && <div className="toast">{toast}</div>}

      <div className="content">
        <div className="titulo-apertura">
          <span className="icono-ayuda">?</span>
          Apertura de Caja &nbsp; Fecha : {fechaStr} &nbsp; Hora : {horaStr}
        </div>

        <div className="apertura-center">
          <div className="apertura-form">
            <form onSubmit={handleGuardar}>
              <table className="apertura-tabla">
                <tbody>
                  <tr>
                    <td className="label-moneda">S/</td>
                    <td className="campo-moneda">
                      <span className="separador">:</span>
                      <input
                        type="text"
                        value={soles}
                        onChange={(e) => setSoles(e.target.value)}
                        placeholder="0.00"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="label-moneda">US$</td>
                    <td className="campo-moneda">
                      <span className="separador">:</span>
                      <input
                        type="text"
                        value={dolares}
                        onChange={(e) => setDolares(e.target.value)}
                        placeholder="0.00"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="botones-apertura">
                <button type="submit" className="btn-guardar">
                  <IconFloppy /> Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AperturaCaja;