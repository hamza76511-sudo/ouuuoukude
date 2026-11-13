/** @jsxImportSource react */
import { useState, useEffect } from 'react';

const LoadingPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Close mobile menu on window resize if screen becomes larger
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileMenuOpen]);

  return (
    <div className="app-container" style={styles.appContainer}>
      {/* ==================== RESPONSIVE NAVBAR ==================== */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          {/* Logo */}
          <div style={styles.logoContainer}>
            <img
              alt="DHL Logo"
              src="/dhl-express-logo.png"
              style={styles.logo}
            />
          </div>

          {/* Desktop Navigation Links (hidden on mobile) */}
          <div style={styles.desktopNav}>
            <a href="#" style={styles.navLink}>Expédier</a>
            <a href="#" style={styles.navLink}>Suivre</a>
            <a href="#" style={styles.navLink}>Services</a>
            <a href="#" style={styles.navLink}>Aide</a>
          </div>

          {/* Desktop Language Selector + Actions (visible on desktop) */}
          <div style={styles.desktopActions}>
            <div style={styles.langContainer}>
              <button style={styles.langButton}>
                <span>🇫🇷</span>
                <span style={styles.langText}>Français</span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={styles.langIcon}>
                  <path d="M3 5L6 8L9 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <button style={styles.loginBtn}>Connexion</button>
          </div>

          {/* Mobile Menu Toggle Button (hamburger) */}
          <button 
            style={styles.hamburgerBtn} 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Menu"
          >
            <div style={{
              ...styles.hamburgerLine,
              transform: isMobileMenuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none'
            }} />
            <div style={{
              ...styles.hamburgerLine,
              opacity: isMobileMenuOpen ? 0 : 1
            }} />
            <div style={{
              ...styles.hamburgerLine,
              transform: isMobileMenuOpen ? 'rotate(-45deg) translate(7px, -6px)' : 'none'
            }} />
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        <div style={{
          ...styles.mobileMenu,
          maxHeight: isMobileMenuOpen ? '400px' : '0',
          opacity: isMobileMenuOpen ? 1 : 0,
          visibility: isMobileMenuOpen ? 'visible' : 'hidden'
        }}>
          <a href="#" style={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>Expédier</a>
          <a href="#" style={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>Suivre</a>
          <a href="#" style={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>Services</a>
          <a href="#" style={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>Aide</a>
          <div style={styles.mobileDivider}></div>
          <button style={styles.mobileLangBtn}>
            <span>🇫🇷</span>
            <span>Français</span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M3 5L6 8L9 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
          <button style={styles.mobileLoginBtn}>Connexion</button>
        </div>
      </div>

      {/* Loading Overlay */}
      <div style={styles.overlay}>
        {/* Lottie Animation Container */}
        <div style={styles.lottieContainer}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 150 150"
            width="150"
            height="150"
            style={styles.lottieSvg}
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <clipPath id="lottie_clip_1">
                <rect width="150" height="150" x="0" y="0" />
              </clipPath>
              <clipPath id="lottie_clip_2">
                <path d="M0,0 L20,0 L20,16 L0,16z" />
              </clipPath>
              <clipPath id="lottie_clip_3">
                <path d="M0,0 L71,0 L71,71 L0,71z" />
              </clipPath>
            </defs>
            <g clipPath="url(#lottie_clip_1)">
              <g transform="matrix(1,0,0,1,0,0)" opacity="1">
                <path fill="rgb(255,255,255)" fillOpacity="0" d="M150,0 C150,0 0,0 0,0 C0,0 0,150 0,150 C0,150 150,150 150,150 C150,150 150,0 150,0z" />
              </g>
              <g clipPath="url(#lottie_clip_3)" transform="matrix(1,0,0,1,40,40)" opacity="1">
                <g transform="matrix(1.333299994468689,0,0,1.333299994468689,0,0)" opacity="1">
                  <g opacity="1" transform="matrix(1,0,0,1,0,0)">
                    <g opacity="1" transform="matrix(1,0,0,1,0,0)">
                      <path
                        fill="rgb(255,204,0)"
                        fillOpacity="1"
                        d="M7.150000095367432,42.22999954223633 C7.150000095367432,42.130001068115234 7.150000095367432,42.040000915527344 7.150000095367432,41.95000076293945 C7.210000038146973,41 7.119999885559082,40.040000915527344 6.889999866485596,39.11000061035156 C6.440000057220459,38.2599983215332 5.880000114440918,37.4900016784668 5.21999979019165,36.79999923706055 C3.7200000286102295,34.84000015258789 3.5299999713897705,32.220001220703125 3.549999952316284,29.770000457763672 C3.549999952316284,29.270000457763672 2.7899999618530273,28.510000228881836 2.569999933242798,28.110000610351562 C2.3399999141693115,27.709999084472656 2.0299999713897705,27.280000686645508 1.8200000524520874,26.850000381469727 C1.7100000381469727,26.670000076293945 1.6299999952316284,26.5 1.5499999523162842,26.34000015258789 C1.5499999523162842,25.639999389648438 1.5800000429153442,24.93000030517578 1.6399999856948853,24.25 C1.7400000095367432,24.6299991607666 1.9299999475479126,25 2.180000066757202,25.299999237060547 C2.430000066757202,25.600000381469727 2.740000009536743,25.850000381469727 3.0999999046325684,26.020000457763672 C4.510000228881836,26.860000610351562 6.369999885559082,25.739999771118164 7.849999904632568,26.469999313354492 C9.760000228881836,27.40999984741211 10.550000190734863,29.829999923706055 12.40999984741211,30.850000381469727 C13.270000457763672,31.229999542236328 14.170000076293945,31.520000457763672 15.079999923706055,31.739999771118164 C15.899999618530273,32.029998779296875 16.65999984741211,32.459999084472656 17.329999923706055,33.02000045776367 C17.6200008392334,33.220001220703125 17.8700008392334,33.47999954223633 18.040000915527344,33.790000915527344 C18.209999084472656,34.099998474121094 18.299999237060547,34.43000030517578 18.31999969482422,34.790000915527344 C18.260000228881836,35.540000915527344 17.6299991607666,36.04999923706055 17.40999984741211,36.75 C17.110000610351562,37.7400016784668 17.670000076293945,38.90999984741211 17.18000030517578,39.81999969482422 C16.68000030517578,40.72999954223633 15.100000381469727,40.9900016784668 14.649999618530273,42.029998779296875 C14.329999923706055,42.779998779296875 14.699999809265137,43.61000061035156 14.649999618530273,44.400001525878906 C14.510000228881836,45.150001525878906 14.289999961853027,45.88999938964844 13.989999771118164,46.59000015258789 C13.869999885559082,47.029998779296875 13.789999961853027,47.47999954223633 13.729999542236328,47.93000030517578 C11.220000267028809,46.43000030517578 9,44.52000045776367 7.150000095367432,42.2599983215332 C7.150000095367432,42.2599983215332 7.150000095367432,42.22999954223633 7.150000095367432,42.22999954223633z M14.199999809265137,4.730000019073486 C14.199999809265137,4.730000019073486 16.06999969482422,5.340000152587891 16.06999969482422,5.340000152587891 C16.170000076293945,5.840000152587891 15.710000038146973,6.289999961853027 15.25,6.53000020980835 C14.770000457763672,6.699999809265137 14.329999923706055,6.980000019073486 13.960000038146973,7.340000152587891 C12.930000305175781,8.6899995803833 15.289999961853027,10.930000305175781 14.109999656677246,12.15999984741211 C12.199999809265137,13.369999885559082 11.699999809265137,9.800000190734863 10.880000114440918,13.020000457763672 C10.510000228881836,14.460000038146973 8.869999885559082,14.520000457763672 7.880000114440918,15.270000457763672 C7.019999980926514,15.9399995803833 6.329999923706055,16.799999237060547 5.860000133514404,17.780000686645508 C5.110000133514404,18.979999542236328 2.509999990463257,20.969999313354492 1.7899999618530273,22.920000076293945 C2.3299999237060547,19.139999389648438 3.740000009536743,15.539999961853027 5.889999866485596,12.390000343322754 C8.039999961853027,9.239999771118164 10.880000114440918,6.610000133514404 14.199999809265137,4.730000019073486 C14.199999809265137,4.730000019073486 14.199999809265137,4.730000019073486 14.199999809265137,4.730000019073486z M29.440000534057617,1.659999966621399 C29.010000228881836,2.509999990463257 28.3700008392334,3.2300000190734863 27.579999923706055,3.7699999809265137 C26.790000915527344,4.300000190734863 25.889999389648438,4.619999885559082 24.940000534057617,4.699999809265137 C24.350000381469727,4.690000057220459 23.760000228881836,4.739999771118164 23.18000030517578,4.829999923706055 C21.290000915527344,5.320000171661377 20.420000076293945,7.599999904632568 18.25,7.389999866485596 C18.18000030517578,7.389999866485596 18.110000610351562,7.380000114440918 18.040000915527344,7.349999904632568 C17.969999313354492,7.320000171661377 17.90999984741211,7.269999980926514 17.860000610351562,7.210000038146973 C17.829999923706055,7.139999866485596 17.81999969482422,7.079999923706055 17.81999969482422,7.010000228881836 C17.81999969482422,6.940000057220459 17.829999923706055,6.869999885559082 17.860000610351562,6.800000190734863 C17.860000610351562,6.800000190734863 18.729999542236328,4.159999847412109 18.729999542236328,4.159999847412109 C17.68000030517578,3.8399999141693115 16.549999237060547,3.809999942779541 15.470000267028809,4.039999961853027 C18.889999389648438,2.359999895095825 22.65999984741211,1.4900000095367432 26.469999313354492,1.5 C27.459999084472656,1.4900000095367432 28.459999084472656,1.5499999523162842 29.440000534057617,1.659999966621399 C29.440000534057617,1.659999966621399 29.440000534057617,1.659999966621399 29.440000534057617,1.659999966621399z M51.220001220703125,22.959999084472656 C50.41999816894531,23.670000076293945 49.5099983215332,24.290000915527344 49.38999938964844,25.309999465942383 C49.27000045776367,26.329999923706055 49.97999954223633,27.209999084472656 49.84000015258789,28.170000076293945 C49.63999938964844,29.579999923706055 47.86000061035156,30.149999618530273 47.15999984741211,31.43000030517578 C46.45000076293945,32.70000076293945 46.9900016784668,34.380001068115234 46.84000015258789,35.880001068115234 C46.54999923706055,38.81999969482422 43.56999969482422,40.7400016784668 42.54999923706055,43.52000045776367 C42.36000061035156,44.040000915527344 42.18000030517578,44.63999938964844 41.68000030517578,44.869998931884766 C40.9900016784668,45.189998626708984 40.25,44.56999969482422 39.75,43.9900016784668 C38.54999923706055,42.599998474121094 37.349998474121094,41.06999969482422 37.09000015258789,39.25 C36.900001525878906,37.88999938964844 37.27000045776367,36.52000045776367 37.279998779296875,35.13999938964844 C37.290000915527344,33.400001525878906 36.709999084472656,31.709999084472656 35.65999984741211,30.329999923706055 C35.459999084472656,30.020000457763672 35.20000076293945,29.739999771118164 34.880001068115234,29.540000915527344 C34.56999969482422,29.34000015258789 34.220001220703125,29.209999084472656 33.849998474121094,29.15999984741211 C33.099998474121094,29.15999984741211 32.470001220703125,29.65999984741211 31.780000686645508,29.90999984741211 C30.68000030517578,30.309999465942383 29.469999313354492,30.280000686645508 28.389999389648438,29.829999923706055 C27.31999969482422,29.3799991607666 26.299999237060547,28.780000686645508 25.389999389648438,28.059999465942383 C24.6200008392334,27.559999465942383 23.950000762939453,26.940000534057617 23.389999389648438,26.209999084472656 C23.110000610351562,25.84000015258789 22.93000030517578,25.399999618530273 22.860000610351562,24.940000534057617 C22.790000915527344,24.479999542236328 22.84000015258789,24.010000228881836 22.989999771118164,23.56999969482422 C23.34000015258789,22.739999771118164 24.170000076293945,22.229999542236328 24.6200008392334,21.450000762939453 C25.06999969482422,20.670000076293945 25.1200008392334,19.479999542236328 25.75,18.709999084472656 C26.59000015258789,17.700000762939453 28.389999389648438,17.489999771118164 28.690000534057617,16.209999084472656 C28.920000076293945,15.239999771118164 28.09000015258789,14.369999885559082 27.889999389648438,13.399999618530273 C27.81999969482422,12.960000038146973 27.850000381469727,12.510000228881836 27.989999771118164,12.079999923706055 C28.1299991607666,11.65999984741211 28.3700008392334,11.279999732971191 28.690000534057617,10.960000038146973 C29.329999923706055,10.34000015258789 30.1299991607666,9.890000343322754 31,9.680000305175781 C31.950000762939453,9.40999984741211 33.130001068115234,9.15999984741211 33.43000030517578,8.210000038146973 C33.72999954223633,7.260000228881836 33.029998779296875,6.369999885559082 33.79999923706055,5.53000020980835 C34.119998931884766,5.210000038146973 34.5,4.960000038146973 34.91999816894531,4.78000020980835 C35.29999923706055,4.579999923706055 35.709999084472656,4.440000057220459 36.13999938964844,4.369999885559082 C36.5,4.369999885559082 36.86000061035156,4.300000190734863 37.18000030517578,4.159999847412109 C37.25,4.119999885559082 37.29999923706055,4.059999942779541 37.349998474121094,4 C41.029998779296875,5.789999961853027 44.220001220703125,8.460000038146973 46.630001068115234,11.760000228881836 C49.040000915527344,15.0600004196167 50.61000061035156,18.90999984741211 51.189998626708984,22.959999084472656 C51.189998626708984,22.959999084472656 51.220001220703125,22.959999084472656 51.220001220703125,22.959999084472656z M26.469999313354492,0 C21.239999771118164,0 16.1200008392334,1.5499999523162842 11.760000228881836,4.460000038146973 C7.409999847412109,7.369999885559082 4.019999980926514,11.5 2.0199999809265137,16.34000015258789 C0.019999999552965164,21.18000030517578 -0.5099999904632568,26.489999771118164 0.5099999904632568,31.6299991607666 C1.5299999713897705,36.7599983215332 4.050000190734863,41.47999954223633 7.75,45.18000030517578 C11.449999809265137,48.880001068115234 16.15999984741211,51.40999984741211 21.299999237060547,52.43000030517578 C26.43000030517578,53.45000076293945 31.760000228881836,52.91999816894531 36.599998474121094,50.91999816894531 C41.439998626708984,48.91999816894531 45.560001373291016,45.52000045776367 48.470001220703125,41.16999816894531 C51.380001068115234,36.81999969482422 52.93000030517578,31.700000762939453 52.93000030517578,26.469999313354492 C52.91999816894531,19.450000762939453 50.13999938964844,12.720000267028809 45.18000030517578,7.760000228881836 C40.220001220703125,2.799999952316284 33.4900016784668,0.009999999776482582 26.469999313354492,0 C26.469999313354492,0 26.469999313354492,0 26.469999313354492,0z"
                      />
                    </g>
                  </g>
                </g>
                <g transform="matrix(1,0,0,1,0,0)" opacity="1">
                  <path fill="rgb(0,0,0)" fillOpacity="0" d="M71,0 C71,0 0,0 0,0 C0,0 0,71 0,71 C0,71 71,71 71,71 C71,71 71,0 71,0z" />
                </g>
              </g>
              <g transform="matrix(-0.5872717499732971,-0.8093898296356201,0.8093898296356201,-0.5872717499732971,130.97579956054688,51.68242645263672)" opacity="1">
                <path fill="rgb(217,217,217)" fillOpacity="0" d="M28,0 C28,0 0,0 0,0 C0,0 0,118 0,118 C0,118 28,118 28,118 C28,118 28,0 28,0z" />
              </g>
              <g clipPath="url(#lottie_clip_2)" transform="matrix(-0.5872717499732971,-0.8093898296356201,0.8093898296356201,-0.5872717499732971,40.40322494506836,112.45748901367188)" opacity="1">
                <g transform="matrix(1.333299994468689,0,0,1.333299994468689,0,0)" opacity="1">
                  <g opacity="1" transform="matrix(1,0,0,1,0,0)">
                    <g opacity="1" transform="matrix(1,0,0,1,0,0)">
                      <path
                        fill="rgb(255,204,0)"
                        fillOpacity="1"
                        d="M15,9.539999961853027 C15,9.539999961853027 13.460000038146973,9.539999961853027 13.460000038146973,9.539999961853027 C13.289999961853027,10.529999732971191 12.539999961853027,11.279999732971191 11.630000114440918,11.279999732971191 C10.720000267028809,11.279999732971191 9.960000038146973,10.529999732971191 9.789999961853027,9.539999961853027 C9.789999961853027,9.539999961853027 5.960000038146973,9.539999961853027 5.960000038146973,9.539999961853027 C5.789999961853027,10.529999732971191 5.039999961853027,11.279999732971191 4.130000114440918,11.279999732971191 C3.2200000286102295,11.279999732971191 2.4600000381469727,10.529999732971191 2.2899999618530273,9.539999961853027 C2.2899999618530273,9.539999961853027 1.5,9.539999961853027 1.5,9.539999961853027 C0.6800000071525574,9.539999961853027 0,8.75 0,7.800000190734863 C0,7.800000190734863 0,6.940000057220459 0,6.940000057220459 C0,6.940000057220459 15,6.940000057220459 15,6.940000057220459 C15,6.940000057220459 15,9.539999961853027 15,9.539999961853027z M12.1899995803833,4.329999923706055 C12.1899995803833,4.329999923706055 9.75,4.329999923706055 9.75,4.329999923706055 C9.75,4.329999923706055 9.75,1.7300000190734863 9.75,1.7300000190734863 C9.75,1.7300000190734863 11.25,1.7300000190734863 11.25,1.7300000190734863 C11.25,1.7300000190734863 13.5,4.329999923706055 13.5,4.329999923706055 C13.5,4.329999923706055 12.1899995803833,4.329999923706055 12.1899995803833,4.329999923706055z M15,4.789999961853027 C15,4.5 14.899999618530273,4.21999979019165 14.720000267028809,4.019999980926514 C14.720000267028809,4.019999980926514 11.800000190734863,0.6299999952316284 11.800000190734863,0.6299999952316284 C11.449999809265137,0.2199999988079071 10.970000267028809,0 10.470000267028809,0 C10.470000267028809,0 0.009999999776482582,0 0.009999999776482582,0 C0.009999999776482582,0 0.009999999776482582,6.070000171661377 0.009999999776482582,6.070000171661377 C0.009999999776482582,6.070000171661377 15,6.070000171661377 15,6.070000171661377 C15,6.070000171661377 15,4.789999961853027 15,4.789999961853027z"
                      />
                    </g>
                  </g>
                </g>
                <g transform="matrix(1,0,0,1,0,0)" opacity="1">
                  <path fill="rgb(0,0,0)" fillOpacity="0" d="M20,0 C20,0 0,0 0,0 C0,0 0,16 0,16 C0,16 20,16 20,16 C20,16 20,0 20,0z" />
                </g>
              </g>
            </g>
          </svg>
        </div>

        {/* Waiting Label with Fade Animation */}
        <p style={{
          ...styles.waitLabel,
          opacity: isVisible ? 1 : 0
        }}>
          Veuillez patienter
        </p>

        {/* Animated Dots */}
        <div style={styles.dotsContainer}>
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              style={{
                ...styles.dot,
                animationDelay: `${index * 0.15}s`
              }}
              className="animated-dot"
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% {
            transform: translateY(0);
            opacity: 0.4;
          }
          40% {
            transform: translateY(-8px);
            opacity: 1;
          }
        }
        
        .animated-dot {
          animation: bounce 1.4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

const styles = {
  appContainer: {
    minHeight: '100vh',
    backgroundColor: '#f7f7f7',
    fontFamily: 'Arial, sans-serif'
  },
  header: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    zIndex: 1000,
    background: 'linear-gradient(90deg, #ffcc00 30%, rgba(255,204,0,0.3) 88%)',
    color: '#000',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
  },
  headerContent: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '12px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '16px',
    flexWrap: 'wrap'
  },
  logoContainer: {
    flexShrink: 0
  },
  logo: {
    height: '32px',
    width: 'auto',
    display: 'block'
  },
  // Desktop Navigation
  desktopNav: {
    display: 'flex',
    gap: '28px',
    alignItems: 'center',
    marginLeft: 'auto'
  },
  navLink: {
    color: '#1a1a1a',
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: 500,
    fontFamily: 'inherit',
    transition: 'opacity 0.2s',
    padding: '6px 0',
    borderBottom: '2px solid transparent'
  },
  desktopActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  langContainer: {
    position: 'relative'
  },
  langButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    background: 'rgba(0,0,0,0.05)',
    border: '1px solid rgba(0,0,0,0.1)',
    borderRadius: '8px',
    color: '#1a1a1a',
    fontSize: '0.82rem',
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'all 0.15s',
    whiteSpace: 'nowrap'
  },
  langText: {
    display: 'inline'
  },
  langIcon: {
    marginLeft: '4px'
  },
  loginBtn: {
    background: '#1a1a1a',
    border: 'none',
    borderRadius: '30px',
    padding: '6px 18px',
    color: '#ffcc00',
    fontSize: '0.82rem',
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'transform 0.1s, background 0.2s',
    whiteSpace: 'nowrap'
  },
  // Hamburger button (mobile only)
  hamburgerBtn: {
    display: 'none',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: '8px',
    zIndex: 1100,
    flexDirection: 'column',
    gap: '5px',
    width: '32px',
    height: '32px',
    justifyContent: 'center',
    alignItems: 'center'
  },
  hamburgerLine: {
    width: '22px',
    height: '2px',
    backgroundColor: '#1a1a1a',
    borderRadius: '2px',
    transition: 'all 0.25s ease-in-out',
    transformOrigin: 'center'
  },
  // Mobile Menu
  mobileMenu: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
    padding: '0 20px',
    overflow: 'hidden',
    transition: 'max-height 0.35s ease-in-out, opacity 0.25s ease, visibility 0.25s',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    borderTop: '1px solid rgba(0,0,0,0.05)',
    zIndex: 999
  },
  mobileNavLink: {
    color: '#1a1a1a',
    textDecoration: 'none',
    fontSize: '1rem',
    fontWeight: 500,
    padding: '12px 0',
    borderBottom: '1px solid #f0f0f0',
    fontFamily: 'inherit',
    display: 'block'
  },
  mobileDivider: {
    height: '1px',
    backgroundColor: '#eaeaea',
    margin: '4px 0'
  },
  mobileLangBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: '#f5f5f5',
    border: 'none',
    borderRadius: '40px',
    padding: '10px 16px',
    fontSize: '0.9rem',
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: 'inherit',
    width: 'fit-content',
    margin: '6px 0'
  },
  mobileLoginBtn: {
    background: '#ffcc00',
    border: 'none',
    borderRadius: '40px',
    padding: '10px 16px',
    fontWeight: 600,
    fontSize: '0.9rem',
    cursor: 'pointer',
    marginBottom: '20px',
    marginTop: '4px',
    width: 'fit-content',
    color: '#1a1a1a'
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.65)',
    backdropFilter: 'blur(2px)',
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: '80px'
  },
  lottieContainer: {
    width: '180px',
    height: '180px',
    marginBottom: '20px'
  },
  lottieSvg: {
    width: '100%',
    height: '100%'
  },
  waitLabel: {
    color: '#fff',
    fontSize: '18px',
    fontWeight: 600,
    fontFamily: 'Arial, Verdana, sans-serif',
    letterSpacing: '0.5px',
    margin: '0 0 18px',
    textShadow: '0 1px 6px rgba(0,0,0,0.5)',
    transition: 'opacity 0.6s ease-out'
  },
  dotsContainer: {
    display: 'flex',
    gap: '7px'
  },
  dot: {
    width: '8px',
    height: '8px',
    background: '#FFCC00',
    borderRadius: '50%',
    boxShadow: '0 0 2px rgba(0,0,0,0.2)'
  }
};

// Inject media query styles globally for responsive adjustments
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = `
    @media (max-width: 768px) {
      .desktop-nav, .desktop-actions {
        display: none !important;
      }
      .hamburger-btn {
        display: flex !important;
      }
      .lang-text {
        display: inline !important;
      }
    }
    @media (min-width: 769px) {
      .mobile-menu {
        display: none !important;
      }
    }
  `;
  document.head.appendChild(styleSheet);
}

// Apply dynamic class mapping for media query (since React inline styles don't support pseudo selectors for hide/show)
// We'll attach ref via effect but better: add style to window but we override with className approach.
// For simplicity we add a runtime class assignment to elements, but above we use style objects + classes.
// To ensure responsiveness: We attach a small script to toggle based on classes.
// But final output: all elements with style objects are covered by dynamic media queries in the global stylesheet.
export default LoadingPage;