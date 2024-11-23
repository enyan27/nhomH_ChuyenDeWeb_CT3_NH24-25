import React from 'react';
import Sidebar from '../components/admin/Sidebar';
import Header from '../components/admin/Header';
import Footer from '../components/admin/Footer';
import '../styles/admin.scss';
function Admin() {
    return (
        <div className="admin-layout">
            <Sidebar />
            <div className="main-content">
                <Header />
                <div className="content">
                    
                </div>
                <Footer />
            </div>
        </div>
    );
}

export default Admin;
