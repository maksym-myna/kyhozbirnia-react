import React, { useState } from 'react';
import "./Dashboard.css"
import Button from '../../components/Button';

const Dashboard: React.FC = () => {
    const [key, setKey] = useState(0);

    const refreshReport = () => {
        setKey(prevKey => prevKey + 1);
    };

    return (
        <div className='dashboard-container'>
            <iframe
                className='dashboard'
                title="Dashboard"
                key={key}
                src="https://lookerstudio.google.com/embed/reporting/43d034ca-7e61-4b66-be1c-3ec9a0d1784a/"
                style={{ border: '2px solid black' }}
                allowFullScreen
                sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
            ></iframe>
            <Button onClick={refreshReport} inverted>Refresh Report</Button>
        </div>
    );
}

export default Dashboard;