"use client"

import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import type { Device } from "@/types"

interface Node {
  id: string
  name: string
  type: string
  x: number
  y: number
  connections: string[]
}

interface Connection {
  from: string
  to: string
}

export default function AnalyticsPage() {
  const [nodes, setNodes] = useState<Node[]>([])
  const [connections, setConnections] = useState<Connection[]>([])
  const [draggedNode, setDraggedNode] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://intelvis.ai'
        const response = await fetch(`${API_URL}/api/devices`, {
          credentials: 'include'
        })
        
        if (!response.ok) {
          throw new Error('Failed to fetch devices')
        }
        
        const devices = await response.json()
        
        // Convert devices to nodes with positioning
        const deviceNodes: Node[] = devices.map((device: Device, index: number) => {
          // Arrange nodes in a circle for better visualization
          const angle = (index * 2 * Math.PI) / devices.length
          const radius = Math.min(150, devices.length * 30)
          const centerX = 400
          const centerY = 200
          
          const x = centerX + radius * Math.cos(angle)
          const y = centerY + radius * Math.sin(angle)
          
          return {
            id: device.id,
            name: device.alias || `Device ${device.nic?.mac?.slice(-4) || index + 1}`,
            type: device.status === 'active' ? 'active' : 'inactive',
            x: Math.max(50, Math.min(x, 750)),
            y: Math.max(50, Math.min(y, 350)),
            connections: [] // For now, we'll implement connections later based on network topology
          }
        })

        // If we have devices, create a simple star topology with the first device as hub
        if (deviceNodes.length > 1) {
          const hubNode = deviceNodes[0]
          hubNode.type = 'hub'
          hubNode.name = hubNode.name + ' (Hub)'
          
          // Connect hub to all other nodes
          hubNode.connections = deviceNodes.slice(1).map(node => node.id)
        }

        setNodes(deviceNodes)

        // Generate connections
        const nodeConnections: Connection[] = []
        deviceNodes.forEach(node => {
          node.connections.forEach(connectedId => {
            nodeConnections.push({ from: node.id, to: connectedId })
          })
        })
        setConnections(nodeConnections)
        
      } catch (error) {
        console.error('Error fetching devices:', error)
        
        // Fallback to mock data if API fails
        const mockNodes: Node[] = [
          { id: "1", name: "Main Hub", type: "hub", x: 400, y: 200, connections: ["2", "3"] },
          { id: "2", name: "Sensor Node A", type: "active", x: 200, y: 100, connections: [] },
          { id: "3", name: "Sensor Node B", type: "active", x: 600, y: 100, connections: [] }
        ]

        setNodes(mockNodes)

        const nodeConnections: Connection[] = [
          { from: "1", to: "2" },
          { from: "1", to: "3" }
        ]
        setConnections(nodeConnections)
      }
    }

    fetchDevices()
  }, [])

  const handleMouseDown = (e: React.MouseEvent, nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId)
    if (!node) return

    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return

    setDraggedNode(nodeId)
    setDragOffset({
      x: e.clientX - rect.left - node.x,
      y: e.clientY - rect.top - node.y
    })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggedNode || !containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const newX = e.clientX - rect.left - dragOffset.x
    const newY = e.clientY - rect.top - dragOffset.y

    setNodes(prevNodes =>
      prevNodes.map(node =>
        node.id === draggedNode
          ? { ...node, x: Math.max(50, Math.min(newX, rect.width - 50)), y: Math.max(50, Math.min(newY, rect.height - 50)) }
          : node
      )
    )
  }

  const handleMouseUp = () => {
    setDraggedNode(null)
    setDragOffset({ x: 0, y: 0 })
  }

  const getNodeColor = (type: string) => {
    switch (type) {
      case "hub": return "bg-blue-500"
      case "active": return "bg-green-500"
      case "inactive": return "bg-red-500"
      case "sensor": return "bg-green-500"
      case "logger": return "bg-yellow-500"
      case "display": return "bg-purple-500"
      default: return "bg-gray-500"
    }
  }

  const getArrowPath = (from: Node, to: Node) => {
    const dx = to.x - from.x
    const dy = to.y - from.y
    const length = Math.sqrt(dx * dx + dy * dy)
    
    // Adjust start and end points to be on the edge of the circles
    const radius = 25
    const unitX = dx / length
    const unitY = dy / length
    
    const startX = from.x + unitX * radius
    const startY = from.y + unitY * radius
    const endX = to.x - unitX * radius
    const endY = to.y - unitY * radius
    
    return `M ${startX} ${startY} L ${endX} ${endY}`
  }


  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Analytics</h1>
        <div className="text-sm text-muted-foreground">
          {nodes.length} nodes connected
        </div>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Network Topology</h2>
        <div 
          ref={containerRef}
          className="relative w-full h-96 bg-card rounded-lg border overflow-hidden cursor-crosshair"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* SVG for connections */}
          <svg
            ref={svgRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 1 }}
          >
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="9"
                refY="3.5"
                orient="auto"
              >
                <polygon
                  points="0 0, 10 3.5, 0 7"
                  fill="currentColor"
                  className="text-muted-foreground"
                />
              </marker>
            </defs>
            
            {connections.map((connection, index) => {
              const fromNode = nodes.find(n => n.id === connection.from)
              const toNode = nodes.find(n => n.id === connection.to)
              
              if (!fromNode || !toNode) return null
              
              return (
                <path
                  key={index}
                  d={getArrowPath(fromNode, toNode)}
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  markerEnd="url(#arrowhead)"
                  className="text-muted-foreground"
                />
              )
            })}
          </svg>

          {/* Nodes */}
          {nodes.map((node) => (
            <div
              key={node.id}
              className={`absolute w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xs cursor-grab active:cursor-grabbing shadow-lg ${getNodeColor(node.type)} ${
                draggedNode === node.id ? 'ring-2 ring-white ring-opacity-50' : ''
              }`}
              style={{
                left: node.x - 24,
                top: node.y - 24,
                zIndex: draggedNode === node.id ? 10 : 2
              }}
              onMouseDown={(e) => handleMouseDown(e, node.id)}
              title={`${node.name} (${node.type})`}
            >
              {node.name.charAt(0)}
            </div>
          ))}

          {/* Node labels */}
          {nodes.map((node) => (
            <div
              key={`label-${node.id}`}
              className="absolute text-xs font-medium text-center pointer-events-none"
              style={{
                left: node.x - 40,
                top: node.y + 35,
                width: 80,
                zIndex: 3
              }}
            >
              {node.name}
            </div>
          ))}
        </div>

        <div className="mt-4 flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Hub</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Online</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Offline</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
            <span>Unknown</span>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-4">
          <h3 className="font-semibold text-lg mb-2">Total Nodes</h3>
          <p className="text-3xl font-bold text-blue-500">{nodes.length}</p>
        </Card>
        
        <Card className="p-4">
          <h3 className="font-semibold text-lg mb-2">Active Connections</h3>
          <p className="text-3xl font-bold text-green-500">{connections.length}</p>
        </Card>
        
        <Card className="p-4">
          <h3 className="font-semibold text-lg mb-2">Network Health</h3>
          <p className="text-3xl font-bold text-yellow-500">98%</p>
        </Card>
      </div>
    </div>
  )
}