'use client';

import { useState, useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Text, TransformControls } from '@react-three/drei';
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
    isEditMode,
    updatePositionCoordinates,
  } = useWarehouseStore();
  
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef<THREE.Mesh>(null!);
  const transformControlsRef = useRef<any>(null!);
  const [ghostPosition, setGhostPosition] = useState<THREE.Vector3 | null>(null);

  const { id, type, position, rotation, dimensions, occupancyPercentage, status, code } = positionData;
  
  const isSelected = selectedPositionId === id;
  const showTransformControls = isEditMode && isSelected;

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
        const targetColor = new THREE.Color(isHovered ? '#06B6D4' : color);
        (ref.current.material as THREE.MeshStandardMaterial).color.lerp(targetColor, 0.1);
    }
  });
  
  const handleClick = (e: any) => {
    e.stopPropagation();
    selectPosition(id);
  };

  const handlePointerOver = (e: any) => {
    e.stopPropagation();
    setIsHovered(true);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = () => {
    setIsHovered(false);
    document.body.style.cursor = 'auto';
  };

  const handleObjectChange = () => {
    if (transformControlsRef.current) {
        const newPos = transformControlsRef.current.object.position;
        const halfFloor = floorSize / 2;
        const halfWidth = dimensions[0] / 2;
        const halfDepth = dimensions[2] / 2;
        
        const snappedX = Math.round(newPos.x / SNAP_GRID_SIZE) * SNAP_GRID_SIZE;
        const snappedZ = Math.round(newPos.z / SNAP_GRID_SIZE) * SNAP_GRID_SIZE;
        
        const clampedX = THREE.MathUtils.clamp(snappedX, -halfFloor + halfWidth, halfFloor - halfWidth);
        const clampedZ = THREE.MathUtils.clamp(snappedZ, -halfFloor + halfDepth, halfFloor - halfDepth);

        setGhostPosition(new THREE.Vector3(clampedX, newPos.y, clampedZ));
    }
  };

  const handleDraggingChanged = (isDragging: boolean) => {
    if (!isDragging && ghostPosition) {
        updatePositionCoordinates(id, [ghostPosition.x, ghostPosition.y, ghostPosition.z]);
        setGhostPosition(null);
    }
  };

  const structureElement = (
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
        >
            {code}
        </Text>
    </group>
  );

  return (
    <>
        {showTransformControls ? (
            <TransformControls
                ref={transformControlsRef}
                object={ref.current}
                mode="translate"
                showY={false}
                onObjectChange={handleObjectChange}
                onDraggingChanged={(e) => handleDraggingChanged(e.value)}
            >
                {structureElement}
            </TransformControls>
        ) : (
            structureElement
        )}
        {ghostPosition && (
            <Box position={ghostPosition} args={dimensions as [number, number, number]}>
                <meshStandardMaterial color="green" opacity={0.4} transparent />
            </Box>
        )}
    </>
  );
}
