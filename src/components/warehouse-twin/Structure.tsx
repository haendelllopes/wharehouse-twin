'use client';

import { useState, useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Text } from '@react-three/drei';
import * as THREE from 'three';
import { useWarehouseStore } from '@/store/warehouseStore';
import type { WarehousePosition } from '@/lib/types';
import { AlertIndicator } from './AlertIndicator';

interface StructureProps {
  positionData: WarehousePosition;
  floorSize: number;
}

const statusColors = {
  NORMAL: '#3b82f6',
  ALERT: '#ef4444',
  EMPTY: '#ffffff',
  BLOCKED: '#ef4444',
};

const SNAP_GRID_SIZE = 0.5;

export function Structure({ positionData, floorSize }: StructureProps) {
  const {
    selectPosition,
    selectedPositionId,
  } = useWarehouseStore();

  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef<THREE.Mesh>(null!);

  const { id, type, position, dimensions, status, code } = positionData;

  const isSelected = selectedPositionId === id;

  const color = status === 'EMPTY' ? statusColors.EMPTY : statusColors[status];
  const isWireframe = status === 'EMPTY';

  const material = useMemo(() => {
    if (isWireframe) {
      return new THREE.MeshBasicMaterial({ color: '#60a5fa', wireframe: true });
    }
    return new THREE.MeshStandardMaterial({
      color: 'white',
      transparent: true,
      opacity: 0.8,
    });
  }, [isWireframe]);

  useFrame(() => {
    if (ref.current && !isWireframe) {
      let targetColor;
      if (isSelected) {
        targetColor = new THREE.Color('#f59e0b'); // Amber for selected
      } else if (isHovered) {
        targetColor = new THREE.Color('#06B6D4'); // Cyan for hovered
      } else {
        targetColor = new THREE.Color(color);
      }
      (ref.current.material as THREE.MeshStandardMaterial).color.lerp(targetColor, 0.1);
    }
  });

  const handleClick = (e: any) => {
    e.stopPropagation();
    selectPosition(id);
  };

  const handlePointerOver = (e: any) => {
    e.stopPropagation();
    if (selectedPositionId !== id) {
      setIsHovered(true);
    }
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = () => {
    setIsHovered(false);
    document.body.style.cursor = 'auto';
  };

  return (
    <group position={position as [number, number, number]}>
      <Box
        ref={ref}
        args={dimensions as [number, number, number]}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        castShadow
        receiveShadow
        material={material}
      >
      </Box>
      {status === 'ALERT' && <AlertIndicator offset={[0, dimensions[1] / 2 + 0.5, 0]} />}
      <Text
        position={[0, dimensions[1] / 2 + (type === 'RACK' ? 0.3 : 0.5), 0]}
        fontSize={type === 'RACK' ? 0.4 : 0.6}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="black"
        font="/fonts/arial.ttf"
      >
        {code}
      </Text>
    </group>
  );
}
