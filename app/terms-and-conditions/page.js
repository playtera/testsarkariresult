'use client';

import React from 'react';

const TermsAndConditions = () => {
  const lastUpdated = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        <div className="glass p-8 md:p-12 rounded-2xl border border-white/10 shadow-2xl">
          <h1 className="text-4xl font-bold mb-4 text-white">Terms and Conditions</h1>
          <p className="text-gray-400 mb-8 border-b border-white/10 pb-4">Last Updated: {lastUpdated}</p>

          <div className="prose prose-invert max-w-none space-y-8 text-gray-300">
            <section>
              <p>Welcome to <strong>SarkariResultCorner.com</strong>!</p>
              <p>
                These terms and conditions outline the rules and regulations for the use of SarkariResultCorner.com's Website, located at <a href="https://sarkariresultcorner.com" className="text-blue-400">https://sarkariresultcorner.com</a>.
              </p>
              <p>
                By accessing this website we assume you accept these terms and conditions. Do not continue to use SarkariResultCorner.com if you do not agree to take all of the terms and conditions stated on this page.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Cookies</h2>
              <p>
                We employ the use of cookies. By accessing SarkariResultCorner.com, you agreed to use cookies in agreement with the SarkariResultCorner.com's Privacy Policy.
              </p>
              <p>
                Most interactive websites use cookies to let us retrieve the user's details for each visit. Cookies are used by our website to enable the functionality of certain areas to make it easier for people visiting our website. Some of our affiliate/advertising partners may also use cookies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">License</h2>
              <p>
                Unless otherwise stated, SarkariResultCorner.com and/or its licensors own the intellectual property rights for all material on SarkariResultCorner.com. All intellectual property rights are reserved. You may access this from SarkariResultCorner.com for your own personal use subjected to restrictions set in these terms and conditions.
              </p>
              <p className="font-bold text-white mt-4">You must not:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Republish material from SarkariResultCorner.com</li>
                <li>Sell, rent or sub-license material from SarkariResultCorner.com</li>
                <li>Reproduce, duplicate or copy material from SarkariResultCorner.com</li>
                <li>Redistribute content from SarkariResultCorner.com</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Hyperlinking to our Content</h2>
              <p>
                The following organizations may link to our Website without prior written approval:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Government agencies;</li>
                <li>Search engines;</li>
                <li>News organizations;</li>
                <li>Online directory distributors may link to our Website in the same manner as they hyperlink to the Websites of other listed businesses; and</li>
                <li>System wide Accredited Businesses except soliciting non-profit organizations, charity shopping malls, and charity fundraising groups which may not hyperlink to our Web site.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Content Liability</h2>
              <p>
                We shall not be hold responsible for any content that appears on your Website. You agree to protect and defend us against all claims that is rising on your Website. No link(s) should appear on any Website that may be interpreted as libelous, obscene or criminal, or which infringes, otherwise violates, or advocates the infringement or other violation of, any third party rights.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Reservation of Rights</h2>
              <p>
                We reserve the right to request that you remove all links or any particular link to our Website. You approve to immediately remove all links to our Website upon request. We also reserve the right to amen these terms and conditions and it’s linking policy at any time. By continuously linking to our Website, you agree to be bound to and follow these linking terms and conditions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Removal of links from our website</h2>
              <p>
                If you find any link on our Website that is offensive for any reason, you are free to contact and inform us any moment. We will consider requests to remove links but we are not obligated to or so or to respond to you directly.
              </p>
              <p>
                We do not ensure that the information on this website is correct, we do not warrant its completeness or accuracy; nor do we promise to ensure that the website remains available or that the material on the website is kept up to date.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
