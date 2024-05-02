import React, { useState, useContext } from 'react';
import { serverURL } from '../../config';
import { ConnectionContext } from "../../contexts/ConnectionContext";
import './SSEManager.css';
import Button from '../Button';

interface SSEManagerProps {
    destination: string;
    onLog: (log: string) => void;
}

const SSEManager: React.FC<SSEManagerProps> = ({ destination, onLog }) => {
    const [source, setSource] = useState<EventSource | null>(null);
    const { isConnected, setConnected } = useContext(ConnectionContext);
    const mapping = {
        'etl': 'ETL',
        'populate': 'популяцію',
    }

    const connectToSSE = () => {
        const sseSource = new EventSource(`${serverURL}/python/${destination}/`);

        sseSource.onmessage = function (event) {
            onLog(`[${destination}] ${event.data}`);
        };

        sseSource.onerror = function (event) {
            onLog(`[${destination}] Finished executing.`);
            sseSource.close();
            setConnected(false);
        };

        setSource(sseSource);
        setConnected(true);
    };

    const closeConnection = () => {
        if (source) {
            source.close();
            setSource(null);
            setConnected(false);
        }
    };

    return (
        <div className='sse-manager-buttons-container'>
            <Button inverted onClick={connectToSSE} disabled={isConnected} width="20rem">
                Почати {mapping[destination as keyof typeof mapping]}
            </Button>
            <Button inverted onClick={closeConnection} disabled={source === null} width="20rem">
                Перервати {mapping[destination as keyof typeof mapping]}
            </Button>
        </div>
    );
};

export default SSEManager;