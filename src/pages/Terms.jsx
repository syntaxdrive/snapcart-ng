import React from 'react';

const Terms = () => {
    return (
        <div className="container mx-auto px-4 py-24 max-w-4xl">
            <h1 className="text-4xl font-bold mb-8">Terms and Conditions</h1>
            <div className="prose prose-lg">
                <p className="text-gray-600 mb-6">Last updated: {new Date().toLocaleDateString()}</p>

                <h2 className="text-2xl font-bold mt-8 mb-4">1. Acceptance of Terms</h2>
                <p>By accessing or using SnapCart, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service.</p>

                <h2 className="text-2xl font-bold mt-8 mb-4">2. Accounts</h2>
                <p>When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms.</p>

                <h2 className="text-2xl font-bold mt-8 mb-4">3. Seller Policy</h2>
                <p>Sellers are responsible for the accuracy of their product listings. SnapCart reserves the right to remove any listing or revoke seller privileges for violating our policies.</p>

                <h2 className="text-2xl font-bold mt-8 mb-4">4. User Conduct</h2>
                <p>You agree not to use the Service for any unlawful purpose or in any way that interrupts, damages, or impairs the service.</p>

                <h2 className="text-2xl font-bold mt-8 mb-4">5. Limitation of Liability</h2>
                <p>In no event shall SnapCart be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits.</p>
            </div>
        </div>
    );
};

export default Terms;
