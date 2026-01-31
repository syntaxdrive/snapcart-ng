import React from 'react';

const PrivacyPolicy = () => {
    return (
        <div className="container mx-auto px-4 py-24 max-w-4xl">
            <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
            <div className="prose prose-lg">
                <p className="text-gray-600 mb-6">Last updated: {new Date().toLocaleDateString()}</p>

                <h2 className="text-2xl font-bold mt-8 mb-4">1. Information We Collect</h2>
                <p>We collect information you provide directly to us when you create an account, create a profile, become a seller, or communicate with us.</p>

                <h2 className="text-2xl font-bold mt-8 mb-4">2. How We Use Your Information</h2>
                <p>We use the information we collect to provide, maintain, and improve our services, facilitate transactions, and communicate with you.</p>

                <h2 className="text-2xl font-bold mt-8 mb-4">3. Sharing of Information</h2>
                <p>We do not share your personal information with third parties except as described in this policy or with your consent.</p>

                <h2 className="text-2xl font-bold mt-8 mb-4">4. Security</h2>
                <p>We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access.</p>

                <h2 className="text-2xl font-bold mt-8 mb-4">5. Contact Us</h2>
                <p>If you have any questions about this Privacy Policy, please contact us at support@snapcart.com.</p>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
