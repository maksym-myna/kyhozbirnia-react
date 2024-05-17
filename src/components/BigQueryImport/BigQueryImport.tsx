import React, { useRef, useState } from "react";
import SSEManager from "../SSEManager";
import { ConnectionContext } from "../../contexts/ConnectionContext";
import './BigQueryImport.css';

const BigQueryImport: React.FC = () => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [isConnected, setConnected] = useState(false);

    const handleLog = (log: string) => {
        if (textareaRef.current) {
            textareaRef.current.value = log + '\n' + textareaRef.current.value;
        }
    };

    return (
        <ConnectionContext.Provider value={{ isConnected, setConnected }}>
            <div className="big-query-imports-container">
                <textarea className="text-field" ref={textareaRef} readOnly />
                <div className="big-query-sses-container">
                    <SSEManager destination="populate" onLog={handleLog} />
                    <SSEManager destination="etl" onLog={handleLog} />
                </div>
            </div>
        </ConnectionContext.Provider>
    )
}

export default BigQueryImport;