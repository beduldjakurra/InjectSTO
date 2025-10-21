import React from 'react';
import { useHistory } from 'react-router-dom';
import './Dashboard.css'; // Assuming you will create a corresponding CSS file

const Dashboard: React.FC = () => {
    const history = useHistory();

    return (
        <div className="dashboard">
            <h1>STO Dashboard</h1>
            <button className="back-button" onClick={() => history.push('/')}>Back to Home</button>
            <div className="section stock-produksi">
                <h2>Stock Produksi</h2>
                {/* Add Stock Produksi content here */}
            </div>
            <div className="section perhitungan-box">
                <h2>Perhitungan Box</h2>
                {/* Add Perhitungan Box content here */}
            </div>
            <div className="section kekuatan-stock">
                <h2>Kekuatan Stock</h2>
                {/* Add Kekuatan Stock content here */}
            </div>
        </div>
    );
};

export default Dashboard;