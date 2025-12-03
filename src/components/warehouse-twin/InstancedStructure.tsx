'use client';

import { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Instances, Instance, Text } from '@react-three/drei';
import * as THREE from 'three';
import { useWarehouseStore } from '@/store/warehouseStore';
import type { WarehousePosition } from '@/lib/types';
import { AlertIndicator } from './AlertIndicator';

interface InstancedStructureProps {
  positions: WarehousePosition[];
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
const palletGeometry = new THREE.BoxGeometry(1.2, 0.15, 1.2);

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
const palletMaterial = new THREE.MeshStandardMaterial({ color: '#D2B48C', roughness: 0.7, metalness: 0.1 });
const emptyMaterial = new THREE.MeshBasicMaterial({ color: statusColors.EMPTY, wireframe: true, transparent: true, opacity: 0.3 });

export function InstancedStructure({ positions }: InstancedStructureProps) {
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
    <group>
      {/* Racks Structures */}
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
      
      {/* Floor Blocks */}
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

      {/* Pallets for both Racks and Floor Blocks */}
      <Instances
        geometry={palletGeometry}
        material={palletMaterial}
        castShadow
        receiveShadow
      >
        {positions.filter(p => p.status !== 'EMPTY' && p.items.length > 0).map(p => {
          if (p.type === 'RACK') {
             return <Instance key={`pallet-${p.id}`} position={[p.position[0], p.position[1] - (p.dimensions[1]/2) + 0.15/2, p.position[2]]} />
          }
          if (p.type === 'FLOOR_BLOCK') {
            return p.items.map((item, index) => {
              const [width, , depth] = p.dimensions;
              const palletLength = 1.2;
              const posX = p.position[0] - width/2 + palletLength/2 + index * palletLength;
              const posY = p.position[1] + 0.15/2;
              const posZ = p.position[2];

              return <Instance key={`pallet-${p.id}-${index}`} position={[posX, posY, posZ]} rotation={p.rotation} />
            })
          }
          return null;
        })}
      </Instances>

      {/* Labels and Indicators */}
      {positions.map(pos => (
        <group key={`label-${pos.id}`} position={pos.position as [number, number, number]}>
          {pos.status === 'ALERT' && <AlertIndicator offset={[0, pos.dimensions[1] / 2 + 0.5, 0]} />}
          <Text
            position={[0, pos.dimensions[1] / 2 + 0.5, 0]}
            fontSize={0.3}
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
    </group>
  );
}

function RackInstance({ positionData, isSelected, isHovered, ...props }: any) {
  const groupRef = useRef<THREE.Group>(null!);
  const { position, dimensions, status } = positionData;

  const baseColor = statusColors[status as keyof typeof statusColors] || statusColors.NORMAL;

  const mainStructureMaterial = useRef(new THREE.MeshStandardMaterial({
    color: baseColor,
    metalness: 0.7,
    roughness: 0.5,
  })).current;

  useFrame(() => {
    let targetColor = baseColor;
    if (isSelected) targetColor = selectedColor;
    else if (isHovered) targetColor = hoverColor;
    mainStructureMaterial.color.lerp(targetColor, 0.1);
  });
  
  const [beamWidth, rackHeight, rackDepth] = dimensions;
  const uprightWidth = 0.1;

  // Clickable invisible box
  const interactionBox = <mesh {...props} visible={false}><boxGeometry args={dimensions} /></mesh>;

  if (status === 'EMPTY') {
    return (
        <group position={position} {...props}>
            <mesh geometry={boxGeometry} scale={dimensions} material={emptyMaterial} />
        </group>
    )
  }

  return (
    <group ref={groupRef} position={position} {...props}>
      {interactionBox}
      {/* Uprights (Pés) */}
      {[ -beamWidth / 2 + uprightWidth / 2, beamWidth / 2 - uprightWidth / 2 ].map(x => (
          [ -rackDepth / 2 + uprightWidth / 2, rackDepth / 2 - uprightWidth / 2 ].map(z => (
              <mesh key={`${x}-${z}`} castShadow receiveShadow material={mainStructureMaterial} position={[x, 0, z]}>
                  <boxGeometry args={[uprightWidth, rackHeight, uprightWidth]} />
              </mesh>
          ))
      ))}
      {/* Beams (Longarinas) */}
      {[-rackHeight/2 + 0.05, rackHeight/2 - 0.05].map(y => (
        [-rackDepth/2 + uprightWidth/2, rackDepth/2-uprightWidth/2].map(z => (
            <mesh key={`${y}-${z}`} castShadow receiveShadow material={mainStructureMaterial} position={[0, y, z]} >
              <boxGeometry args={[beamWidth, 0.1, 0.1]} />
            </mesh>
        ))
      ))}
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
