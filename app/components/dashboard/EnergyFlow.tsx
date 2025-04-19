"use client"

import { useEffect, useRef, useState } from "react"

interface EnergyFlowProps {
  solarWatts: number
  gridWatts: number
  homeWatts: number
}

export default function EnergyFlow({ solarWatts = 925, gridWatts = 286, homeWatts = 639 }: EnergyFlowProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number>(0)
  const animationTimeRef = useRef<number>(0)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  
  // Create refs for the SVG images
  const solarIconRef = useRef<HTMLImageElement | null>(null)
  const gridIconRef = useRef<HTMLImageElement | null>(null)
  const homeIconRef = useRef<HTMLImageElement | null>(null)
  
  // Load SVG images
  useEffect(() => {
    // Create and load Solar icon
    solarIconRef.current = new Image()
    solarIconRef.current.src = '/solar-energy-power.svg'
    
    // Create and load Grid icon
    gridIconRef.current = new Image()
    gridIconRef.current.src = '/power-line.svg'
    
    // Create and load Home icon
    homeIconRef.current = new Image()
    homeIconRef.current.src = '/home.svg'
  }, [])

  // Handle resize to make canvas responsive
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width } = containerRef.current.getBoundingClientRect()
        // Set height proportionally to maintain aspect ratio
        const height = Math.floor(width * 0.6) // 3:5 aspect ratio
        setDimensions({ width, height })
      }
    }

    // Initial size
    updateDimensions()

    // Add resize listener
    window.addEventListener('resize', updateDimensions)
    
    return () => {
      window.removeEventListener('resize', updateDimensions)
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || dimensions.width === 0) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = dimensions.width
    canvas.height = dimensions.height

    let animationTime = 0

    const animate = (timestamp: number) => {
      if (!animationTimeRef.current) {
        animationTimeRef.current = timestamp
      }

      const elapsed = timestamp - animationTimeRef.current
      animationTime = (elapsed / 1000) % 10 // Reset every 10 seconds

      // Clear canvas
      ctx.fillStyle = "#1a1a1a"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Calculate positions based on container size
      // Instead of scaling elements, we'll adjust their positions
      const centerX = canvas.width / 2
      const topY = canvas.height * 0.2 // Top position at 20% of height
      const bottomY = canvas.height * 0.7 // Bottom position at 70% of height
      const leftX = canvas.width * 0.25 // Left position at 25% of width
      const rightX = canvas.width * 0.75 // Right position at 75% of width

      // Define node positions using percentages
      const solarPos = { x: centerX, y: topY }
      const gridPos = { x: leftX, y: bottomY }
      const homePos = { x: rightX, y: bottomY }

      // Fixed node radius (not scaled) - CHANGE THIS VALUE TO ADJUST CIRCLE SIZE
      const nodeRadius = 30 // Changed from 50 to 40 to make circles smaller

      // Calculate connection points on the edges of nodes
      // For Grid to Home (straight line)
      const gridToHomeAngle = Math.atan2(homePos.y - gridPos.y, homePos.x - gridPos.x)
      const gridConnectionPoint = {
        x: gridPos.x + Math.cos(gridToHomeAngle) * nodeRadius,
        y: gridPos.y + Math.sin(gridToHomeAngle) * nodeRadius,
      }
      const homeConnectionPoint = {
        x: homePos.x + Math.cos(gridToHomeAngle + Math.PI) * nodeRadius,
        y: homePos.y + Math.sin(gridToHomeAngle + Math.PI) * nodeRadius,
      }

      // For Solar to Grid
      const solarToGridAngle = Math.atan2(gridPos.y - solarPos.y, gridPos.x - solarPos.x)
      const solarToGridPoint = {
        x: solarPos.x + Math.cos(solarToGridAngle) * nodeRadius,
        y: solarPos.y + Math.sin(solarToGridAngle) * nodeRadius,
      }

      // For Solar to Home
      const solarToHomeAngle = Math.atan2(homePos.y - solarPos.y, homePos.x - solarPos.x)
      const solarToHomePoint = {
        x: solarPos.x + Math.cos(solarToHomeAngle) * nodeRadius,
        y: solarPos.y + Math.sin(solarToHomeAngle) * nodeRadius,
      }

      // Draw connections
      // Solar to Grid - curved downward
      drawCurvedLine(ctx, solarToGridPoint, gridConnectionPoint, "#a855f7", (animationTime % 3) / 3, true, false)

      // Solar to Home - curved downward
      drawCurvedLine(ctx, solarToHomePoint, homeConnectionPoint, "#f97316", (animationTime % 2.5) / 2.5, true, false)

      // Grid to Home - straight line
      drawStraightLine(ctx, gridConnectionPoint, homeConnectionPoint, "#a855f7", (animationTime % 4) / 4)

      // Draw animated nodes
      const pulseScale = 1 + 0.05 * Math.sin(animationTime * 4)
      drawNode(ctx, solarPos, "#86efac", "#facc15", "Solar", `${solarWatts} W`, pulseScale)
      drawNode(ctx, gridPos, "#86efac", "#a855f7", "Grid", `<${gridWatts} W\n0 W→`, pulseScale)
      drawNode(ctx, homePos, "#86efac", "#f97316", "Home", `${homeWatts} W`, pulseScale)

      // Draw title - position at top left with fixed size
      ctx.font = "bold 24px sans-serif"
      ctx.fillStyle = "white"
      ctx.textAlign = "left"
      ctx.fillText("Energy Flow", 20, canvas.height * 0.1)

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [solarWatts, gridWatts, homeWatts, dimensions])

  // Function to draw a straight line between two points with a moving dot
  function drawStraightLine(
    ctx: CanvasRenderingContext2D,
    start: { x: number; y: number },
    end: { x: number; y: number },
    color: string,
    dotPosition = 0.5,
  ) {
    // Start drawing path
    ctx.beginPath()
    ctx.moveTo(start.x, start.y)
    ctx.lineTo(end.x, end.y)
    ctx.strokeStyle = color
    ctx.lineWidth = 3
    ctx.stroke()

    // Calculate dot position along the line
    const dotX = start.x + (end.x - start.x) * dotPosition
    const dotY = start.y + (end.y - start.y) * dotPosition

    // Draw dot on the line
    ctx.beginPath()
    ctx.arc(dotX, dotY, 8, 0, Math.PI * 2)
    ctx.fillStyle = color
    ctx.fill()
  }

  // Function to draw a curved line between two points
  function drawCurvedLine(
    ctx: CanvasRenderingContext2D,
    start: { x: number; y: number },
    end: { x: number; y: number },
    color: string,
    dotPosition = 0.5,
    visible = true,
    curveUp = false,
  ) {
    // Control point for the curve - direction based on curveUp parameter
    const midX = (start.x + end.x) / 2
    // Adjust curve height based on canvas height
    const curveHeight = ctx.canvas.height * 0.2
    const midY = curveUp ? Math.min(start.y, end.y) - curveHeight : Math.max(start.y, end.y) + curveHeight

    // Start drawing path
    ctx.beginPath()
    ctx.moveTo(start.x, start.y)
    ctx.quadraticCurveTo(midX, midY, end.x, end.y)
    ctx.strokeStyle = color
    ctx.lineWidth = 3
    ctx.stroke()

    // Draw dot on the line
    if (visible) {
      const t = dotPosition
      const dotX = (1 - t) * (1 - t) * start.x + 2 * (1 - t) * t * midX + t * t * end.x
      const dotY = (1 - t) * (1 - t) * start.y + 2 * (1 - t) * t * midY + t * t * end.y

      ctx.beginPath()
      ctx.arc(dotX, dotY, 8, 0, Math.PI * 2)
      ctx.fillStyle = color
      ctx.fill()
    }
  }

  // Function to draw a node with animation
  function drawNode(
    ctx: CanvasRenderingContext2D,
    pos: { x: number; y: number },
    bgColor: string,
    borderColor: string,
    label: string,
    value: string,
    scale = 1,
  ) {
    // Circle size - updated to match the nodeRadius value of 30
    const radius = 30 * scale

    // Draw glow effect
    const gradient = ctx.createRadialGradient(pos.x, pos.y, radius - 8, pos.x, pos.y, radius + 12)
    gradient.addColorStop(0, borderColor)
    gradient.addColorStop(1, "rgba(0,0,0,0)")
    ctx.beginPath()
    ctx.arc(pos.x, pos.y, radius + 12, 0, Math.PI * 2)
    ctx.fillStyle = gradient
    ctx.fill()

    // Draw outer circle
    ctx.beginPath()
    ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2)
    ctx.fillStyle = borderColor
    ctx.fill()

    // Draw inner circle
    ctx.beginPath()
    ctx.arc(pos.x, pos.y, radius - 4, 0, Math.PI * 2)
    ctx.fillStyle = bgColor
    ctx.fill()

    // Draw label above - smaller font and adjusted position
    ctx.font = "14px sans-serif"
    ctx.fillStyle = "#aaaaaa"
    ctx.textAlign = "center"
    ctx.fillText(label, pos.x, pos.y - 38)

    // Draw value - smaller font and adjusted position
    ctx.font = "12px sans-serif"
    ctx.fillStyle = "black"
    ctx.textAlign = "center"

    // Handle multi-line text with adjusted spacing
    if (value.includes("\n")) {
      const lines = value.split("\n")
      lines.forEach((line, i) => {
        ctx.fillText(line, pos.x, pos.y + (i === 0 ? 2 : 16))
      })
    } else {
      ctx.fillText(value, pos.x, pos.y + 2)
    }

    // Draw icon
    drawIcon(ctx, pos, label)
  }

  // Function to draw icon based on node type
  function drawIcon(ctx: CanvasRenderingContext2D, pos: { x: number; y: number }, type: string) {
    ctx.fillStyle = "black"
    ctx.strokeStyle = "black"
    ctx.lineWidth = 2

    if (type === "Solar") {
      // Draw Solar SVG icon if loaded
      if (solarIconRef.current && solarIconRef.current.complete) {
        const iconSize = 24;
        ctx.drawImage(
          solarIconRef.current, 
          pos.x - iconSize/2, 
          pos.y - 10 - iconSize/2, 
          iconSize, 
          iconSize
        );
      } else {
        // Fallback: Sun icon if SVG not loaded
        ctx.beginPath()
        ctx.arc(pos.x, pos.y - 10, 12, 0, Math.PI * 2)
        ctx.stroke()

        // Sun rays
        const rayLength = 6
        for (let i = 0; i < 8; i++) {
          const angle = (i * Math.PI) / 4
          const x1 = pos.x + Math.cos(angle) * 12
          const y1 = pos.y - 10 + Math.sin(angle) * 12
          const x2 = pos.x + Math.cos(angle) * (12 + rayLength)
          const y2 = pos.y - 10 + Math.sin(angle) * (12 + rayLength)

          ctx.beginPath()
          ctx.moveTo(x1, y1)
          ctx.lineTo(x2, y2)
          ctx.stroke()
        }
      }
    } else if (type === "Grid") {
      // Draw Grid SVG icon if loaded
      if (gridIconRef.current && gridIconRef.current.complete) {
        const iconWidth = 40;
        const iconHeight = 30;
        ctx.drawImage(
          gridIconRef.current, 
          pos.x - iconWidth/2, 
          pos.y - 5 - iconHeight/2, 
          iconWidth, 
          iconHeight
        );
      } else {
        // Fallback: Power grid tower if SVG not loaded
        ctx.beginPath()
        ctx.moveTo(pos.x - 15, pos.y - 20)
        ctx.lineTo(pos.x + 15, pos.y - 20)
        ctx.lineTo(pos.x + 8, pos.y + 10)
        ctx.lineTo(pos.x - 8, pos.y + 10)
        ctx.closePath()
        ctx.stroke()

        // Power lines
        ctx.beginPath()
        ctx.moveTo(pos.x - 20, pos.y - 15)
        ctx.lineTo(pos.x + 20, pos.y - 15)
        ctx.moveTo(pos.x - 20, pos.y - 10)
        ctx.lineTo(pos.x + 20, pos.y - 10)
        ctx.stroke()
      }
    } else if (type === "Home") {
      // Draw Home SVG icon if loaded
      if (homeIconRef.current && homeIconRef.current.complete) {
        const iconSize = 30;
        ctx.drawImage(
          homeIconRef.current, 
          pos.x - iconSize/2, 
          pos.y - 5 - iconSize/2, 
          iconSize, 
          iconSize
        );
      } else {
        // Fallback: House if SVG not loaded
        ctx.beginPath()
        ctx.moveTo(pos.x, pos.y - 20)
        ctx.lineTo(pos.x + 15, pos.y)
        ctx.lineTo(pos.x + 15, pos.y + 10)
        ctx.lineTo(pos.x - 15, pos.y + 10)
        ctx.lineTo(pos.x - 15, pos.y)
        ctx.closePath()
        ctx.stroke()

        // Door
        ctx.beginPath()
        ctx.rect(pos.x - 5, pos.y, 10, 10)
        ctx.stroke()
      }
    }
  }

  return (
    <div ref={containerRef} className="relative w-full h-full">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full" 
        style={{ background: "#1E1E1E" }} 
      />
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {/* This div is for accessibility - actual content is drawn on canvas */}
      </div>
    </div>
  )
}
