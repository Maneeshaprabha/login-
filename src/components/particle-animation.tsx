"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Particle type definition
type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  color: string
  originalX?: number
  originalY?: number
  life: number
  maxLife: number
}

// Connection type definition
type Connection = {
  from: number
  to: number
  distance: number
}

export default function ParticleNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const particlesRef = useRef<Particle[]>([])
  const connectionsRef = useRef<Connection[]>([])
  const animationRef = useRef<number>(0)
  const mouseRef = useRef({ x: 0, y: 0, moved: false })

  // Initialize canvas and particles
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        const canvas = canvasRef.current
        const width = window.innerWidth
        const height = window.innerHeight
        canvas.width = width
        canvas.height = height
        setDimensions({ width, height })

        // Create particles
        const particleCount = Math.floor((width * height) / 8000) // More particles for denser effect
        const particles: Particle[] = []

        for (let i = 0; i < particleCount; i++) {
          const x = Math.random() * width
          const y = Math.random() * height
          particles.push({
            x,
            y,
            originalX: x,
            originalY: y,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            radius: Math.random() * 2.5 + 1,
            color: getRandomColor(),
            life: 100,
            maxLife: 100,
          })
        }

        particlesRef.current = particles
        updateConnections()
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(animationRef.current)
    }
  }, [])

  // Track mouse movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY,
        moved: true,
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  // Animation loop
  useEffect(() => {
    if (!canvasRef.current) return

    const animate = () => {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext("2d")
      if (!ctx) return

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      const particles = particlesRef.current
      const connections = connectionsRef.current
      const { x: mouseX, y: mouseY, moved: mouseMoved } = mouseRef.current

      // Update particle positions with magnetic effect
      particles.forEach((particle) => {
        // Natural movement
        particle.x += particle.vx
        particle.y += particle.vy

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.vx = -particle.vx
        }
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.vy = -particle.vy
        }

        // Apply magnetic effect if mouse has moved
        if (mouseMoved) {
          const dx = mouseX - particle.x
          const dy = mouseY - particle.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          // Magnetic attraction radius
          const magneticRadius = 200

          if (distance < magneticRadius) {
            // Calculate force based on distance (stronger when closer)
            const force = 0.9 * (1 - distance / magneticRadius)

            // Calculate angle to mouse
            const angle = Math.atan2(dy, dx)

            // Apply force toward mouse
            particle.vx += Math.cos(angle) * force * 0.2
            particle.vy += Math.sin(angle) * force * 0.2

            // Limit maximum velocity
            const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy)
            const maxSpeed = 3
            if (speed > maxSpeed) {
              particle.vx = (particle.vx / speed) * maxSpeed
              particle.vy = (particle.vy / speed) * maxSpeed
            }
          } else if (particle.originalX !== undefined && particle.originalY !== undefined) {
            // Gradually return to original position when out of magnetic range
            const returnForce = 0.01
            particle.vx += (particle.originalX - particle.x) * returnForce
            particle.vy += (particle.originalY - particle.y) * returnForce

            // Add some friction
            particle.vx *= 0.98
            particle.vy *= 0.98
          }
        }
      })

      // Draw connections first (behind particles)
      ctx.lineWidth = 0.3
      connections.forEach((connection) => {
        const p1 = particles[connection.from]
        const p2 = particles[connection.to]

        // Calculate opacity based on distance
        const maxDistance = 150
        const opacity = 1 - connection.distance / maxDistance

        if (opacity > 0) {
          ctx.beginPath()
          ctx.moveTo(p1.x, p1.y)
          ctx.lineTo(p2.x, p2.y)
          ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.2})`
          ctx.stroke()
        }
      })

      // Draw particles
      particles.forEach((particle) => {
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        ctx.fillStyle = particle.color
        ctx.fill()
      })

      // Update connections periodically
      if (Math.random() < 0.05) {
        updateConnections()
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationRef.current)
    }
  }, [dimensions])

  // Calculate connections between particles
  const updateConnections = () => {
    const particles = particlesRef.current
    const connections: Connection[] = []

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x
        const dy = particles[i].y - particles[j].y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < 150) {
          connections.push({
            from: i,
            to: j,
            distance,
          })
        }
      }
    }

    connectionsRef.current = connections
  }

  // Generate random color with blue/purple hues
  const getRandomColor = () => {
    const hue = Math.random() * 60 + 220 // Blue to purple range
    const saturation = Math.random() * 30 + 70
    const lightness = Math.random() * 20 + 50
    return `hsla(${hue}, ${saturation}%, ${lightness}%, 0.8)`
  }

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />

      <div className="relative z-10 flex items-center justify-center h-full">
        <motion.div
          className="max-w-md bg-black/60 backdrop-blur-sm p-6 rounded-lg border border-gray-800"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <motion.p
            className="text-white text-xl font-medium mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            Vue is crazy awesome! We should create every new project with Vue!
          </motion.p>

          <motion.div
            className="flex items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.5 }}
          >
            <Avatar className="h-10 w-10 mr-3 border-2 border-gray-700">
              <AvatarImage src="https://v0.dev/ovgIJ.png" alt="Profile" />
              <AvatarFallback>DK</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-white text-sm font-medium">@danielkellyio</p>
              <p className="text-gray-400 text-xs">Developer</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
