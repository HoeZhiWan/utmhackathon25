'use client'

import { Grid, HousePlug, Sun, UtilityPole } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'

function TestEnergyFlow() {
  const [position, setPosition] = useState(0);
  const sunDivRef = useRef<HTMLDivElement>(null);
  const utilityPoleDivRef = useRef<HTMLDivElement>(null);
  const housePlugDivRef = useRef<HTMLDivElement>(null);
  const [connectionPoints, setConnectionPoints] = useState({
    sun: { x: 0, y: 0 },
    utilityPole: { x: 0, y: 0 },
    housePlug: { x: 0, y: 0 }
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setPosition((prevPosition) => (prevPosition + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Function to calculate the center points of each div
    const calculateConnectionPoints = () => {
      if (sunDivRef.current && utilityPoleDivRef.current && housePlugDivRef.current) {
        const sunRect = sunDivRef.current.getBoundingClientRect();
        const utilityPoleRect = utilityPoleDivRef.current.getBoundingClientRect();
        const housePlugRect = housePlugDivRef.current.getBoundingClientRect();
        
        const containerRect = sunDivRef.current.parentElement?.parentElement?.getBoundingClientRect() || { left: 0, top: 0 };
        
        // Calculate positions relative to the parent container
        setConnectionPoints({
          sun: {
            x: sunRect.left + sunRect.width / 2 - containerRect.left,
            y: sunRect.top + sunRect.height / 2 - containerRect.top
          },
          utilityPole: {
            x: utilityPoleRect.left + utilityPoleRect.width / 2 - containerRect.left,
            y: utilityPoleRect.top + utilityPoleRect.height / 2 - containerRect.top
          },
          housePlug: {
            x: housePlugRect.left + housePlugRect.width / 2 - containerRect.left,
            y: housePlugRect.top + housePlugRect.height / 2 - containerRect.top
          }
        });
      }
    };

    // Calculate initial positions
    calculateConnectionPoints();
    
    // Recalculate on window resize
    window.addEventListener('resize', calculateConnectionPoints);
    
    return () => window.removeEventListener('resize', calculateConnectionPoints);
  }, []);

  // Calculate the radius of the circular divs (half the width)
  const divRadius = 45; // 90px width / 2

  // Add CSS classes for the animated glow effects with higher z-index
  const purpleGlowClass = "bg-purple-neon rounded-[100px] w-[90px] h-[90px] p-4 flex flex-col items-center border-2 border-primary-purple animate-glow-purple relative z-30";
  const orangeGlowClass = "bg-orange-neon rounded-[100px] w-[90px] h-[90px] p-4 flex flex-col items-center border-2 border-primary-orange animate-glow-orange relative z-30";

  return (
    <>
      <style jsx global>{`
        @keyframes glowPurple {
          0% { box-shadow: 0 0 10px rgba(168,85,247,0.5); }
          50% { box-shadow: 0 0 20px rgba(168,85,247,0.8); }
          100% { box-shadow: 0 0 10px rgba(168,85,247,0.5); }
        }
        
        @keyframes glowOrange {
          0% { box-shadow: 0 0 10px rgba(249,115,22,0.5); }
          50% { box-shadow: 0 0 20px rgba(249,115,22,0.8); }
          100% { box-shadow: 0 0 10px rgba(249,115,22,0.5); }
        }
        
        .animate-glow-purple {
          animation: glowPurple 2s infinite;
        }
        
        .animate-glow-orange {
          animation: glowOrange 2s infinite;
        }
      `}</style>
      <div className="text-[20px] font-semibold">Energy Flow</div>
      <div className="grid grid-cols-3 grid-rows-2 -translate-y-8 h-full relative">
        <div className="col-start-2 flex justify-center">
            <div ref={sunDivRef} className={purpleGlowClass}>
                <Sun />
                925W
            </div>

        </div>
        <div className="row-start-2 col-start-1">
        <div ref={utilityPoleDivRef} className={purpleGlowClass}>
                <UtilityPole />
                <div className="text-[12px]">{"<- 286 W"}</div>
                <div className="text-[12px]">{"0 W ->"}</div>
            </div>
        </div>
        <div className="row-start-2 col-start-3 flex justify-end">
        <div ref={housePlugDivRef} className={orangeGlowClass}>
                <HousePlug />
                639 W
            </div>
        </div>

        {/* Lines connecting the components */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ zIndex: 10 }}>
          <svg className="w-full h-full" style={{ position: 'absolute', top: 0, left: 0 }}>
            {/* Line from utility pole to house plug */}
            {connectionPoints.utilityPole.x > 0 && (
              <>
                <line 
                  x1={connectionPoints.utilityPole.x + divRadius * Math.cos(0)} 
                  y1={connectionPoints.utilityPole.y}
                  x2={connectionPoints.housePlug.x - divRadius * Math.cos(0)} 
                  y2={connectionPoints.housePlug.y}
                  stroke="#a855f7" 
                  strokeWidth="3" 
                />
                {/* Add a delay for the dot to prevent immediate reappearance */}
                {position > 10 && position < 90 && (
                  <circle 
                    cx={connectionPoints.utilityPole.x + (connectionPoints.housePlug.x - connectionPoints.utilityPole.x) * (position - 10) / 80}
                    cy={connectionPoints.housePlug.y}
                    r="5" 
                    fill="#a855f7" 
                    style={{ zIndex: -1 }}
                  />
                )}
              </>
            )}
            
            {/* Line from sun (left side) to utility pole */}
            {connectionPoints.sun.x > 0 && (
              <>
                <path
                  d={`M ${connectionPoints.sun.x - divRadius} ${connectionPoints.sun.y} 
                      Q ${(connectionPoints.sun.x + connectionPoints.utilityPole.x) / 2 - 50} 
                        ${(connectionPoints.sun.y + connectionPoints.utilityPole.y) / 2} 
                        ${connectionPoints.utilityPole.x} ${connectionPoints.utilityPole.y - divRadius}`}
                  stroke="#a855f7"
                  strokeWidth="3"
                  fill="transparent"
                />
                {/* Animated dot for sun to utility pole with keyTimes for delay */}
                <circle 
                  r="5"
                  fill="#a855f7"
                  style={{ zIndex: -1 }}
                >
                  <animateMotion 
                    dur="4s"
                    repeatCount="indefinite"
                    path={`M ${connectionPoints.sun.x - divRadius} ${connectionPoints.sun.y} 
                          Q ${(connectionPoints.sun.x + connectionPoints.utilityPole.x) / 2 - 50} 
                            ${(connectionPoints.sun.y + connectionPoints.utilityPole.y) / 2} 
                            ${connectionPoints.utilityPole.x} ${connectionPoints.utilityPole.y - divRadius}`}
                    keyTimes="0;0.4;0.6;1"
                    keyPoints="0;1;1;1"
                    calcMode="linear"
                  />
                  <animate 
                    attributeName="opacity" 
                    values="0;1;1;0" 
                    keyTimes="0;0.1;0.4;0.5" 
                    dur="4s" 
                    repeatCount="indefinite" 
                  />
                </circle>
              </>
            )}
            
            {/* Line from sun (right side) to house plug */}
            {connectionPoints.sun.x > 0 && (
              <>
                <path
                  d={`M ${connectionPoints.sun.x + divRadius} ${connectionPoints.sun.y} 
                      Q ${(connectionPoints.sun.x + connectionPoints.housePlug.x) / 2 + 50} 
                        ${(connectionPoints.sun.y + connectionPoints.housePlug.y) / 2} 
                        ${connectionPoints.housePlug.x} ${connectionPoints.housePlug.y - divRadius}`}
                  stroke="#f97316"
                  strokeWidth="3"
                  fill="transparent"
                />
                {/* Animated dot for sun to house plug with keyTimes for delay */}
                <circle 
                  r="5"
                  fill="#f97316"
                  style={{ zIndex: -1 }}
                >
                  <animateMotion 
                    dur="4.5s"
                    repeatCount="indefinite"
                    path={`M ${connectionPoints.sun.x + divRadius} ${connectionPoints.sun.y} 
                          Q ${(connectionPoints.sun.x + connectionPoints.housePlug.x) / 2 + 50} 
                            ${(connectionPoints.sun.y + connectionPoints.housePlug.y) / 2} 
                            ${connectionPoints.housePlug.x} ${connectionPoints.housePlug.y - divRadius}`}
                    keyTimes="0;0.4;0.6;1"
                    keyPoints="0;1;1;1"
                    calcMode="linear"
                  />
                  <animate 
                    attributeName="opacity" 
                    values="0;1;1;0" 
                    keyTimes="0;0.1;0.4;0.5" 
                    dur="4.5s" 
                    repeatCount="indefinite" 
                  />
                </circle>
              </>
            )}
          </svg>
        </div>
      </div>
    </>
  )
}

export default TestEnergyFlow
