'use client';

import { Html } from "@react-three/drei";
import { AlertTriangle } from 'lucide-react';

interface AlertIndicatorProps {
    offset: [number, number, number];
}

export function AlertIndicator({ offset }: AlertIndicatorProps) {
    return (
        <Html position={offset} center>
            <div className="flex items-center justify-center p-1 bg-destructive/80 rounded-full animate-pulse">
                <AlertTriangle className="h-4 w-4 text-destructive-foreground" />
            </div>
        </Html>
    );
}
