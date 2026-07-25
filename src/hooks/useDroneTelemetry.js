import { useEffect, useState, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import toast from 'react-hot-toast';

export const useDroneTelemetry = (initialDrones = []) => {
    const [drones, setDrones] = useState(initialDrones);
    const [isConnected, setIsConnected] = useState(false);

    // Track drones that have already triggered a low battery alert
    const alertedDronesRef = useRef(new Set());

    useEffect(() => {
        const client = new Client({
            brokerURL: 'ws://localhost:8080/ws',
            reconnectDelay: 5000,
            onConnect: () => {
                console.log('✅ Connected to Drone WebSocket!');
                setIsConnected(true);

                client.subscribe('/topic/drones', (message) => {
                    if (message.body) {
                        const telemetry = JSON.parse(message.body);

                        // Check for critical low battery on active flying drones (< 20%)
                        if (telemetry.status === 'FLYING' && telemetry.batteryCapacity < 20) {
                            if (!alertedDronesRef.current.has(telemetry.id)) {
                                toast.error(
                                    `⚠️ LOW BATTERY ALARM!\n${telemetry.serialNumber || `Drone #${telemetry.id}`} is at ${telemetry.batteryCapacity}% battery during flight!`,
                                    {
                                        duration: 6000,
                                        icon: '🪫',
                                        style: {
                                            background: '#180a0a',
                                            color: '#f87171',
                                            border: '1px solid #ef4444',
                                            fontWeight: 'bold',
                                        },
                                    }
                                );
                                alertedDronesRef.current.add(telemetry.id);
                            }
                        } else if (telemetry.batteryCapacity >= 20) {
                            alertedDronesRef.current.delete(telemetry.id);
                        }

                        // Update live telemetry array state
                        setDrones((prevDrones) =>
                            prevDrones.map((drone) =>
                                drone.id === telemetry.id ? { ...drone, ...telemetry } : drone
                            )
                        );
                    }
                });
            },
            onDisconnect: () => {
                setIsConnected(false);
            },
            onStompError: (err) => {
                console.error('STOMP Error:', err);
            },
        });

        client.activate();

        // Fallback simulation loop: smoothly interpolate flying drones if WebSocket is offline or testing locally
        const simulationInterval = setInterval(() => {
            setDrones((prevDrones) =>
                prevDrones.map((drone) => {
                    if (drone.status === 'FLYING') {
                        // Smoothly glide latitude/longitude toward destination (e.g. Aitoro Hospital approx 6.5244, 3.3792)
                        const targetLat = 6.5244;
                        const targetLng = 3.3792;

                        const latDiff = targetLat - drone.latitude;
                        const lngDiff = targetLng - drone.longitude;

                        // If close to destination, loop back or hover, otherwise glide forward
                        if (Math.abs(latDiff) < 0.0001 && Math.abs(lngDiff) < 0.0001) {
                            return drone;
                        }

                        return {
                            ...drone,
                            latitude: drone.latitude + latDiff * 0.05,
                            longitude: drone.longitude + lngDiff * 0.05,
                            altitude: 120,
                            speed: 45
                        };
                    }
                    return drone;
                })
            );
        }, 1000);

        return () => {
            client.deactivate();
            clearInterval(simulationInterval);
        };
    }, []);

    return { drones, isConnected };
};