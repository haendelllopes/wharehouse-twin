'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box } from '@react-three/drei';
import * as THREE from 'three';
import { useWarehouseStore } from '@/store/warehouseStore';
import type { WarehousePosition } from '@/lib/types';
import { AlertIndicator } from './AlertIndicator';

const selectedColor = new THREE.Color('#f59e0b'); // amber-500

const palletMaterial = new THREE.MeshStandardMaterial({ color: '#D2B48C', roughness: 0.7, metalness: 0.1 });
const boxItemMaterial = new THREE.MeshStandardMaterial({ color: '#C19A6B', roughness: 0.8, metalness: 0.1 }); // Cor de papelão

interface InstancedStructureProps {
  positions: WarehousePosition[];
}

const heatmapColors = {
  NORMAL: new THREE.Color('#22c55e'), // green-500
  ALERT: new THREE.Color('#ef4444'), // red-500
  BLOCKED: new THREE.Color('#ef4444'), // red-500
  EMPTY: new THREE.Color('#ffffff'), // white
};

export function InstancedStructure({ positions }: InstancedStructureProps) {
  const { selectPosition, selectedPositionId, viewMode } = useWarehouseStore();
  
  const racks = useMemo(() => positions.filter(p => p.type === 'RACK'), [positions]);
  const floorBlocks = useMemo(() => positions.filter(p => p.type === 'FLOOR_BLOCK'), [positions]);
  
  const handleClick = (id: string, e: any) => {
    e.stopPropagation();
    selectPosition(id);
  };
  
  if (viewMode === 'heatmap') {
    return (
      <group>
        {positions.map(pos => (
          <HeatmapInstance
            key={pos.id}
            positionData={pos}
            isSelected={selectedPositionId === pos.id}
            onClick={(e) => handleClick(pos.id, e)}
          />
        ))}
      </group>
    );
  }

  return (
    <group>
      {racks.map(pos => (
        <RackInstance
          key={pos.id}
          positionData={pos}
          isSelected={selectedPositionId === pos.id}
          onClick={(e) => handleClick(pos.id, e)}
        />
      ))}
      
      {floorBlocks.map(pos => (
         <group key={pos.id} position={pos.position}>
          {pos.items.length > 0 && (
            <>
              <mesh
                castShadow
                receiveShadow
                material={palletMaterial}
                position={[0, -pos.dimensions[1] / 2 + 0.15 / 2, 0]}
              >
                <boxGeometry args={[pos.dimensions[0], 0.15, pos.dimensions[2]]} />
              </mesh>
              <mesh
                castShadow
                receiveShadow
                material={boxItemMaterial}
                position={[0, -pos.dimensions[1] / 2 + 0.15 + (pos.dimensions[1] - 0.15) / 2, 0]}
              >
                <boxGeometry args={[pos.dimensions[0] * 0.95, pos.dimensions[1] - 0.15, pos.dimensions[2] * 0.95]} />
              </mesh>
              {pos.status === 'ALERT' && <AlertIndicator offset={[0, pos.dimensions[1] / 2 + 0.5, 0]} />}
            </>
          )}
          <Box
            args={pos.dimensions}
            visible={false}
            onClick={(e) => handleClick(pos.id, e)}
           />
        </group>
      ))}

    </group>
  );
}

function HeatmapInstance({ positionData, isSelected, ...props }: any) {
  const { position, dimensions, status } = positionData;
  const materialRef = useRef<THREE.MeshStandardMaterial>(null!);

  const baseColor = heatmapColors[status as keyof typeof heatmapColors] || heatmapColors.EMPTY;

  useFrame(() => {
    if (materialRef.current) {
      const targetColor = isSelected ? selectedColor : baseColor;
      materialRef.current.color.lerp(targetColor, 0.1);
    }
  });

  return (
    <Box
      args={dimensions}
      position={position}
      {...props}
    >
      <meshStandardMaterial
        ref={materialRef}
        color={baseColor}
        opacity={status === 'EMPTY' ? 0.05 : 0.6}
        transparent
        metalness={0.1}
        roughness={0.7}
      />
    </Box>
  );
}

function RackInstance({ positionData, isSelected, ...props }: any) {
  const { position, dimensions, status, items } = positionData;

  const uprightsMaterial = useRef(new THREE.MeshStandardMaterial({ color: 'blue', metalness: 0.8, roughness: 0.4 })).current;
  const beamsMaterial = useRef(new THREE.MeshStandardMaterial({ color: 'orange', metalness: 0.6, roughness: 0.5 })).current;
  
  useFrame(() => {
    if (isSelected) {
      uprightsMaterial.color.lerp(selectedColor, 0.1);
      beamsMaterial.color.lerp(selectedColor, 0.1);
    } else {
      uprightsMaterial.color.lerp(new THREE.Color('blue'), 0.1);
      beamsMaterial.color.lerp(new THREE.Color('orange'), 0.1);
    }
  });

  return (
    <group position={position} {...props}>
      <RackStructure dimensions={dimensions} uprightsMaterial={uprightsMaterial} beamsMaterial={beamsMaterial}/>
      
      {items.length > 0 && (
        <group>
            <mesh 
              castShadow receiveShadow material={palletMaterial}
              position={[0, -dimensions[1]/2 + 0.15/2, 0]}
            >
              <boxGeometry args={[dimensions[0], 0.15, dimensions[2]]} />
            </mesh>
            <mesh 
              castShadow receiveShadow material={boxItemMaterial}
              position={[0, -dimensions[1]/2 + 0.15 + (dimensions[1]-0.15)/2, 0]}
            >
              <boxGeometry args={[dimensions[0]*0.95, dimensions[1]-0.15, dimensions[2]*0.95]} />
            </mesh>
            {status === 'ALERT' && <AlertIndicator offset={[0, dimensions[1] / 2 + 0.5, 0]} />}
        </group>
      )}

       <Box
        args={dimensions}
        visible={false} // Invisível, apenas para clique
      />
    </group>
  );
}

function RackStructure({ dimensions, uprightsMaterial, beamsMaterial }: any) {
    const [rackWidth, rackHeight, rackDepth] = dimensions;
    const uprightWidth = 0.1;
    const beamHeight = 0.1;
    const halfH = rackHeight / 2;
    const halfW = rackWidth / 2;
    const halfD = rackDepth / 2;

    return (
        <group>
            {/* Uprights (Pés) Azuis */}
            <mesh castShadow receiveShadow material={uprightsMaterial} position={[-halfW + uprightWidth/2, 0, -halfD + uprightWidth/2]}>
                <boxGeometry args={[uprightWidth, rackHeight, uprightWidth]} />
            </mesh>
            <mesh castShadow receiveShadow material={uprightsMaterial} position={[halfW - uprightWidth/2, 0, -halfD + uprightWidth/2]}>
                <boxGeometry args={[uprightWidth, rackHeight, uprightWidth]} />
            </mesh>
            <mesh castShadow receiveShadow material={uprightsMaterial} position={[-halfW + uprightWidth/2, 0, halfD - uprightWidth/2]}>
                <boxGeometry args={[uprightWidth, rackHeight, uprightWidth]} />
            </mesh>
            <mesh castShadow receiveShadow material={uprightsMaterial} position={[halfW - uprightWidth/2, 0, halfD - uprightWidth/2]}>
                <boxGeometry args={[uprightWidth, rackHeight, uprightWidth]} />
            </mesh>

            {/* Beams (Longarinas) Laranjas */}
            <group position={[0, -halfH + beamHeight/2, 0]}>
                {/* Frente e Trás */}
                <mesh castShadow receiveShadow material={beamsMaterial} position={[0, 0, -halfD]}>
                    <boxGeometry args={[rackWidth, beamHeight, uprightWidth]} />
                </mesh>
                 <mesh castShadow receiveShadow material={beamsMaterial} position={[0, 0, halfD]}>
                    <boxGeometry args={[rackWidth, beamHeight, uprightWidth]} />
                </mesh>
                {/* Lados */}
                <mesh castShadow receiveShadow material={beamsMaterial} position={[-halfW, 0, 0]}>
                    <boxGeometry args={[uprightWidth, beamHeight, rackDepth]} />
                </mesh>
                 <mesh castShadow receiveShadow material={beamsMaterial} position={[halfW, 0, 0]}>
                    <boxGeometry args={[uprightWidth, beamHeight, rackDepth]} />
                </mesh>
            </group>
        </group>
    )
}
