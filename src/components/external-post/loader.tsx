import React from "react";

function Loader({
  fillColor,
  strokeColor,
}: {
  fillColor?: string;
  strokeColor?: string;
}) {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        backgroundColor: "white",
      }}
    >
      <style>{`
        .loader-path-1 {
          stroke-dasharray: 2200; /* Main big path */
          stroke-dashoffset: 2200;
          animation: strokeAnim1 8s ease-in-out infinite, fillAnim1 8s ease-in-out infinite;
          fill-opacity: 0;
        }

        .loader-path-2 {
          stroke-dasharray: 600; /* Smaller path */
          stroke-dashoffset: 600;
          animation: strokeAnim2 8s ease-in-out infinite, fillAnim2 8s ease-in-out infinite;
          fill-opacity: 0;
        }

        /* Stroke animations */
        @keyframes strokeAnim1 {
          0% { stroke-dashoffset: 2200; stroke-opacity: 1; }
          30% { stroke-dashoffset: 0; stroke-opacity: 1; }
          80% { stroke-opacity: 0; }
          100% { stroke-opacity: 0; }
        }

        // @keyframes strokeAnim2 {
        //   0% { stroke-dashoffset: 600; stroke-opacity: 1; }
        //   60% { stroke-dashoffset: 0; stroke-opacity: 1; }
        //   80% { stroke-opacity: 0; }
        //   100% { stroke-opacity: 0; }
        // }

        /* Fill animations */
        @keyframes fillAnim1 {
          0% { fill-opacity: 0; }
          25% { fill-opacity: 0; }
          35% { fill-opacity: 1; }
          95% { fill-opacity: 1; }
          100% { fill-opacity: 0; }
        }

        @keyframes fillAnim2 {
          0% { fill-opacity: 0; }
          25% { fill-opacity: 0; }
          35% { fill-opacity: 1; }
          95% { fill-opacity: 1; }
          100% { fill-opacity: 0; }
        }
      `}</style>

      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 500 500"
          style={{
            width: "60px",
          }}
        >
          <path
            className="loader-path-1"
            d="m387.97,404.05s-7.41,58.28-59.22,52.71c0,0-98.74-9.81-121.65.37-22.91,10.2,137.43-72.68,215.98-279.55-2.37,4.68-139.51,275.01-379.56,313.65,2.49-.7,82.9-23.63,119.95-67.99,0,0-6.15-88.45,36.81-147.28,0,0,2.04,37.14,23.73,68.01,0,0,21.36-79.27,22.56-100.14,0,0,152.54-10.7,187.45-215.4,0,0,86.2,219.17-79.08,388.56,0,0,8.18,10,33.03-12.95Z"
            fill={fillColor}
            stroke={strokeColor}
            strokeMiterlimit="10"
            strokeWidth="5"
          />
          <path
            className="loader-path-2"
            d="m385.11,8.76c-11.17,12.44-19.21,27.78-23.16,44.17-1.38,5.75-2.27,11.61-3.53,17.38-4.73,21.72-14.81,42.21-29.05,59.07,16.89-3.27,32.47-13.17,42.8-27.19,10.33-14.02,14.65-31.97,13.03-49.43l-.09-44.01Z"
            fill={fillColor}
            // stroke="#797979"
            // strokeMiterlimit="10"
            // strokeWidth="10"
          />
        </svg>
      </div>
    </div>
  );
}

export default Loader;
