'use client'

import { useState } from "react";

export interface AlertType 
{
    AlertText: string;
    AlertSeverity: number;
}

export default function Alerts({ImportAlerts}: {ImportAlerts: AlertType[]}) {
    const [ Alerts, setAlerts ] = useState<AlertType[]>(ImportAlerts);
    
    if (Alerts.length === 0) {
        return null;
    };

    return (
        <main className="h-[50vh] w-[30vw] text-center p-1 m-1 rounded right-0 absolute border bg-white z-1">
            <h3 className="h-[10%]">
                ALERTS
            </h3>
            <ul className="overflow-auto h-[90%] text-[0.75rem] divide-y bg-gray-100 p-1">
                {Alerts.map((alert: AlertType, index: number) => (
                    <li key={index}
                        className={`bg-red-${alert.AlertSeverity + 2 + "00"}`}
                    >
                        {alert.AlertText}
                    </li>
                ))}
            </ul>
        </main>
    )
}