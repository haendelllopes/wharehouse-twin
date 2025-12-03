'use client';

import { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Instances, Instance, Text, Merged } from '@react-three/drei';
import * as THREE from 'three';
import { useWarehouseStore } from '@/store/warehouseStore';
import type { WarehousePosition } from '@/lib/types';
import { AlertIndicator } from './AlertIndicator';

interface InstancedStructureProps {
  positions: WarehousePosition[];
  floorSize: number;
}

const statusColors = {
  NORMAL: new THREE.Color('#3b82f6'), // blue-500
  ALERT: new THREE.Color('#ef4444'), // red-500
  EMPTY: new THREE.Color('#a0a0a0'), // neutral-400 for wireframe
  BLOCKED: new THREE.Color('#eab308'), // yellow-500
};
const hoverColor = new THREE.Color('#06b6d4'); // cyan-500
const selectedColor = new THREE.Color('#f59e0b'); // amber-500

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const rackMaterial = new THREE.MeshStandardMaterial({
  color: 'white',
  roughness: 0.5,
  metalness: 0.5,
});
const floorMaterial = new THREE.MeshStandardMaterial({
  color: 'white',
  roughness: 0.8,
  metalness: 0.2,
});
const emptyMaterial = new THREE.MeshBasicMaterial({ color: statusColors.EMPTY, wireframe: true });

const itemMaterial = new THREE.MeshStandardMaterial({ color: '#D2B48C', roughness: 0.7, metalness: 0.1 }); // Tan color for boxes
const itemGeometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);

export function InstancedStructure({ positions, floorSize }: InstancedStructureProps) {
  const { selectPosition, selectedPositionId } = useWarehouseStore();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const racks = useMemo(() => positions.filter(p => p.type === 'RACK'), [positions]);
  const floorBlocks = useMemo(() => positions.filter(p => p.type === 'FLOOR_BLOCK'), [positions]);
  
  const handlePointerOver = (id: string, e: any) => {
    e.stopPropagation();
    setHoveredId(id);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = (e: any) => {
    e.stopPropagation();
    setHoveredId(null);
    document.body.style.cursor = 'auto';
  };

  const handleClick = (id: string, e: any) => {
    e.stopPropagation();
    selectPosition(id);
  };
  
  return (
    <>
      <Instances
        geometry={boxGeometry}
        material={rackMaterial}
        castShadow
        receiveShadow
      >
        {racks.map(pos => (
          <RackInstance
            key={pos.id}
            positionData={pos}
            isSelected={selectedPositionId === pos.id}
            isHovered={hoveredId === pos.id}
            onClick={(e) => handleClick(pos.id, e)}
            onPointerOver={(e) => handlePointerOver(pos.id, e)}
            onPointerOut={handlePointerOut}
          />
        ))}
      </Instances>

       <Instances
        geometry={boxGeometry}
        material={floorMaterial}
        castShadow
        receiveShadow
      >
        {floorBlocks.map(pos => (
          <FloorBlockInstance
            key={pos.id}
            positionData={pos}
            isSelected={selectedPositionId === pos.id}
            isHovered={hoveredId === pos.id}
            onClick={(e) => handleClick(pos.id, e)}
            onPointerOver={(e) => handlePointerOver(pos.id, e)}
            onPointerOut={handlePointerOut}
          />
        ))}
      </Instances>

      {/* Items on Racks and Floor Blocks */}
      <Merged meshes={[new THREE.Mesh(itemGeometry)]}>
        {(ItemBox) => (
           <group>
             {positions.filter(p => p.status !== 'EMPTY').map(p => (
              <group key={`items-${p.id}`} position={p.position as [number, number, number]}>
                {generateItemBoxes(p).map((itemPos, i) => (
                  <ItemBox key={i} material={itemMaterial} position={itemPos} castShadow receiveShadow />
                ))}
              </group>
             ))}
           </group>
        )}
      </Merged>

      {/* Labels and Indicators */}
      {positions.map(pos => (
        <group key={`label-${pos.id}`} position={pos.position as [number, number, number]}>
          {pos.status === 'ALERT' && <AlertIndicator offset={[0, pos.dimensions[1] / 2 + 0.5, 0]} />}
          <Text
            position={[0, pos.dimensions[1] / 2 + 0.5, 0]}
            fontSize={0.4}
            color="white"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.02}
            outlineColor="black"
          >
            {pos.code}
          </Text>
        </group>
      ))}
    </>
  );
}

function RackInstance({ positionData, isSelected, isHovered, ...props }: any) {
  const ref = useRef<THREE.InstancedMesh>(null!);
  const { id, position, dimensions, status } = positionData;

  const baseColor = status === 'EMPTY' ? statusColors.EMPTY : statusColors[status as keyof typeof statusColors] || statusColors.NORMAL;

  useFrame(() => {
    if (ref.current) {
        let targetColor = baseColor;
        if (isSelected) targetColor = selectedColor;
        else if (isHovered) targetColor = hoverColor;
        
        ref.current.color.lerp(targetColor, 0.1);
    }
  });

  if (status === 'EMPTY') {
    return (
        <group position={position} {...props}>
            <mesh geometry={boxGeometry} scale={dimensions} material={emptyMaterial} />
        </group>
    )
  }

  // Simplified rack structure with shelves
  const shelfHeight = 1.25;
  const numShelves = Math.floor(dimensions[1] / shelfHeight);
  const shelfPositions = Array.from({ length: numShelves }, (_, i) => [
    0,
    -dimensions[1] / 2 + i * shelfHeight + shelfHeight / 2,
    0,
  ]);
  const shelfDepth = 0.8;
  const supportWidth = 0.1;

  return (
    <group position={position} {...props}>
      {/* Main bounding box (for interaction) */}
      <Instance ref={ref} scale={dimensions} color={baseColor} />

      {/* Visual representation */}
      <group>
        {/* Shelves */}
        {shelfPositions.map((shelfPos, i) => (
          <mesh key={i} geometry={boxGeometry} scale={[dimensions[0], 0.05, shelfDepth]} position={shelfPos as [number, number, number]}>
            <meshStandardMaterial color="#888" roughness={0.5} metalness={0.7} />
          </mesh>
        ))}
        {/* Vertical Supports */}
        {[ -dimensions[0]/2 + supportWidth/2, dimensions[0]/2 - supportWidth/2 ].map(x => (
            [ -shelfDepth/2 + supportWidth/2, shelfDepth/2 - supportWidth/2 ].map(z => (
                <mesh key={`${x}-${z}`} geometry={boxGeometry} scale={[supportWidth, dimensions[1], supportWidth]} position={[x, 0, z]}>
                    <meshStandardMaterial color="#555" roughness={0.5} metalness={0.7} />
                </mesh>
            ))
        ))}
      </group>
    </group>
  );
}

function FloorBlockInstance({ positionData, isSelected, isHovered, ...props }: any) {
  const ref = useRef<THREE.InstancedMesh>(null!);
  const { position, dimensions, status } = positionData;

  const baseColor = status === 'EMPTY' ? statusColors.EMPTY : statusColors[status as keyof typeof statusColors] || statusColors.NORMAL;

  useFrame(() => {
    if (ref.current) {
        let targetColor = baseColor;
        if (isSelected) targetColor = selectedColor;
        else if (isHovered) targetColor = hoverColor;
        
        ref.current.color.lerp(targetColor, 0.1);
    }
  });

  if (status === 'EMPTY') {
    return (
        <group position={position} {...props}>
            <mesh geometry={boxGeometry} scale={dimensions} material={emptyMaterial} />
        </group>
    )
  }

  return <Instance ref={ref} position={position} scale={dimensions} color={baseColor} {...props} />;
}

// Helper to generate positions for item boxes
function generateItemBoxes(p: WarehousePosition): [number, number, number][] {
    const boxes: [number, number, number][] = [];
    if (p.status === 'EMPTY' || p.occupancyPercentage === 0) return boxes;

    const [width, height, depth] = p.dimensions;
    const boxSize = 0.8;
    const numX = Math.floor(width / boxSize);
    const numY = Math.floor(height / boxSize);
    const numZ = Math.floor(depth / (p.type === 'RACK' ? 0.8 : boxSize));

    const totalPossible = numX * numY * numZ;
    const numToCreate = Math.min(totalPossible, Math.ceil(totalPossible * (p.occupancyPercentage / 100)));

    let count = 0;
    for (let y = 0; y < numY && count < numToCreate; y++) {
        for (let x = 0; x < numX && count < numToCreate; x++) {
            for (let z = 0; z < numZ && count < numToCreate; z++) {
                const posX = -width / 2 + boxSize / 2 + x * boxSize;
                const posY = -height / 2 + boxSize / 2 + y * boxSize;
                const posZ = -depth / 2 + boxSize / 2 + z * boxSize;
                boxes.push([posX, posY, posZ]);
                count++;
            }
        }
    }
    return boxes;
}
