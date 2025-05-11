'use client'

import { useState } from "react";

export interface AlertType 
{
    AlertText: string;
    AlertSeverity: number;
}

export default function Alerts({ImportAlerts}: {ImportAlerts: AlertType[]}) {
    const [ Alerts, setAlerts ] = useState<AlertType[]>(ImportAlerts);
    const [ see, setSee ] = useState<boolean>(false)

    if (Alerts.length === 0) {
        return null;
    };

    return (
        <main className={`${see ? "h-[50vh]" : "h-[5vh]"} w-[30vw] text-center p-1 m-1 rounded right-0 fixed border bg-white z-1 transition-all duration-500`}>
            <button className="w-full bg-gradient-to-br from-red-200 rounded border hover:from-red-400 hover:cursor-pointer"
                onClick={() => setSee(!see)}
            >
                ALERTS
            </button>
            <ul className={`${see ? "h-[90%]" : "invisible"} overflow-auto  text-[0.75rem] bg-gray-100 p-1`}>
                {Alerts.map((alert: AlertType, index: number) => (
                    <li key={index}
                        className={`bg-red-${String(alert.AlertSeverity)} m-1 p-1 rounded`}
                    >
                        {alert.AlertText}
                    </li>
                ))}
            </ul>
        </main>
    )
}