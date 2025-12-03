'use client';

import { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Instances, Instance, Box, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { useWarehouseStore } from '@/store/warehouseStore';
import type { WarehousePosition } from '@/lib/types';
import { AlertIndicator } from './AlertIndicator';

interface InstancedStructureProps {
  positions: WarehousePosition[];
}

const selectedColor = new THREE.Color('#f59e0b'); // amber-500

const palletMaterial = new THREE.MeshStandardMaterial({ color: '#D2B48C', roughness: 0.7, metalness: 0.1 });
const boxItemMaterial = new THREE.MeshStandardMaterial({ color: '#A0522D', roughness: 0.8, metalness: 0.1 });
const floorLineMaterial = new THREE.LineBasicMaterial({ color: 'yellow' });

export function InstancedStructure({ positions }: InstancedStructureProps) {
  const { selectPosition, selectedPositionId } = useWarehouseStore();
  
  const racks = useMemo(() => positions.filter(p => p.type === 'RACK'), [positions]);
  const floorBlocks = useMemo(() => positions.filter(p => p.type === 'FLOOR_BLOCK'), [positions]);
  
  const handleClick = (id: string, e: any) => {
    e.stopPropagation();
    selectPosition(id);
  };
  
  return (
    <group>
      {/* Estruturas dos Racks */}
      {racks.map(pos => (
        <RackInstance
          key={pos.id}
          positionData={pos}
          isSelected={selectedPositionId === pos.id}
          onClick={(e) => handleClick(pos.id, e)}
        />
      ))}
      
      {/* Itens nos Racks e Blocados (Pallet + Caixa) */}
      {positions
        .filter(p => p.status !== 'EMPTY' && p.items.length > 0)
        .map(p => (
        <group key={`item-${p.id}`} position={p.position}>
            <mesh 
              castShadow receiveShadow material={palletMaterial}
              position={[0, -p.dimensions[1]/2 + 0.15/2, 0]}
            >
              <boxGeometry args={[p.dimensions[0], 0.15, p.dimensions[2]]} />
            </mesh>
            <mesh 
              castShadow receiveShadow material={boxItemMaterial}
              position={[0, -p.dimensions[1]/2 + 0.15 + (p.dimensions[1]-0.15)/2, 0]}
            >
              <boxGeometry args={[p.dimensions[0]*0.95, p.dimensions[1]-0.15, p.dimensions[2]*0.95]} />
            </mesh>
             {p.status === 'ALERT' && <AlertIndicator offset={[0, p.dimensions[1] / 2 + 0.5, 0]} />}
        </group>
      ))}

       {/* Clicável para Blocados (já que não tem estrutura) */}
      {floorBlocks.map(pos => (
        <Box
          key={`clickable-${pos.id}`}
          args={pos.dimensions}
          position={pos.position}
          visible={false} // Invisível, apenas para clique
          onClick={(e) => handleClick(pos.id, e)}
        />
      ))}

    </group>
  );
}

function RackInstance({ positionData, isSelected, ...props }: any) {
  const { position, dimensions, status } = positionData;

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

  if (status === 'EMPTY') {
    // Apenas estrutura, sem "chão"
    return (
      <group position={position} {...props}>
         <RackStructure dimensions={dimensions} uprightsMaterial={uprightsMaterial} beamsMaterial={beamsMaterial}/>
      </group>
    );
  }
  
  // Estrutura com item (o item é renderizado no loop principal)
  return (
    <group position={position} {...props}>
      <RackStructure dimensions={dimensions} uprightsMaterial={uprightsMaterial} beamsMaterial={beamsMaterial}/>
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

    return (
        <group position={[0, -rackHeight/2, 0]}>
            {/* Uprights (Pés) Azuis */}
            {[ -rackWidth / 2 + uprightWidth / 2, rackWidth / 2 - uprightWidth / 2 ].map(x => (
                [ -rackDepth / 2 + uprightWidth / 2, rackDepth / 2 - uprightWidth / 2 ].map(z => (
                    <mesh key={`${x}-${z}`} castShadow receiveShadow material={uprightsMaterial} position={[x, rackHeight / 2, z]}>
                        <boxGeometry args={[uprightWidth, rackHeight, uprightWidth]} />
                    </mesh>
                ))
            ))}
            {/* Beams (Longarinas) Laranjas - Frente e Trás */}
            {[0, rackHeight - beamHeight].map(y => (
              <mesh key={`beam-z-${y}`} castShadow receiveShadow material={beamsMaterial} position={[0, y + beamHeight/2, 0]}>
                <boxGeometry args={[rackWidth, beamHeight, uprightWidth]} />
              </mesh>
            ))}
             {/* Beams (Longarinas) Laranjas - Lados */}
            {[0, rackHeight - beamHeight].map(y => (
              [ -rackWidth / 2, rackWidth / 2 - uprightWidth].map(x => (
                  <mesh key={`beam-x-${y}-${x}`} castShadow receiveShadow material={beamsMaterial} position={[x + uprightWidth/2, y + beamHeight/2, 0]} rotation={[0, Math.PI/2, 0]}>
                    <boxGeometry args={[rackDepth, beamHeight, uprightWidth]} />
                  </mesh>
              ))
            ))}
        </group>
    )
}
