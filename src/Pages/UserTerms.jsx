import React from "react";
import { Link } from "react-router-dom";

const UserTerms = () => {
  return (
    <div className="user-terms pt-20 pb-10">
      <div className="bg-gradient-to-r from-amber-500 to-[#1f2020] text-black text-center py-16 px-6 w-full hover">
        <h1 className="text-4xl font-bold mb-4 cursor-pointer">
          User Terms And Conditions
        </h1>
      </div>
      <div className="p-14 pt-6">
      <section>
        <p>
          <strong>
            THIS AGREEMENT CONTAINS A MANDATORY ARBITRATION PROVISION, WAIVER OF
            JURY TRIAL & CLASS ACTION.
          </strong>{" "}
          PLEASE REVIEW ALL PROVISIONS CONTAINED HEREIN. If you do not agree to
          these provisions, do not use this platform/site or services. By
          accessing, browsing or using this platform/site and its services,
          through any direct or indirect means, or by using the goods or
          services provided and offered in or through this platform, by any
          alternative methods (including, for example, telephone, mail, text,
          email, or facsimile), you accept and agree to be bound by this
          Agreement, these Services, and our <Link to="/privacyPolicy" className="text-blue-400 underline">Privacy Policy</Link>, which is
          incorporated by reference.
        </p>
        <p>
          thecontractornow.com, a Pennsylvania limited liability company and its
          affiliates and subsidiaries, (collectively “thecontractornow.com”,
          “we”, “us”, “our”, or “Company”) encourages all users of this platform
          and service to review this Terms of Use Agreement (“Agreement”).
        </p>
      </section>

      <h2>Platform/Services</h2>
      <section>
        <p>
          This platform offers a combination of marketing and technology
          services which are utilized by small to large brands for marketing
          purposes, consent management, and client acquisition/retention
          (collectively “Services”). Services through this platform/site are for
          the benefit of Third Parties only. This platform/service is intended
          for United States residents only.
        </p>
        <p>
          You understand and agree that if you provide an inquiry for additional
          information on this platform, the information you provided will be
          purchased by the client network, affiliates, and/or vendors in order
          to provide such services. Some business partners include companies who
          provide business services for us or on our behalf in order to deliver
          marketing services to you.
        </p>
        <p>
          Prior to submitting your inquiry, you will give prior expressed
          written consent to share the information you have provided in order to
          receive autodialed or prerecorded calls and texts as well as emails
          from us and/or our client network, affiliates, and vendors to the
          phone numbers (including mobile numbers) and email addresses you
          provide to the platform.
        </p>
        <p>
          We will share your personal information with our network of clients
          including but not limited to: mortgage bankers, mortgage brokers,
          credit consultants, insurance brokers, or any other business in our
          client network that may be related to the service or product you have
          expressed interest in. As a result, different businesses may contact
          you.
        </p>
        <p>
          We do not charge you a fee to use this platform and its Services. We
          are not a lender, debt service, debt settlement, real estate company,
          insurance agent, auto sales company, automotive warranty organization,
          or home service provider. All requirements to qualify for financial
          products are made by the client network, and we do not endorse,
          warrant, or guarantee such results.
        </p>
      </section>

      <h2>Prohibited Use</h2>
      <section>
        <p>
          You shall not use this platform/service for any illegal purpose or for
          the transmission of any unlawful material or material that is abusive,
          harmful, harassing, libelous, racially or ethnically offensive,
          invasive of another's privacy, obscene, threatening, vulgar, sexually
          explicit, tortious, defamatory, or that infringes or may infringe on
          the intellectual property or rights of another, or in a reasonable
          person’s view objectionable. Other prohibited activities include but
          are not limited to:
        </p>
        <ul>
          <li>
            Interfering with the proper working of this platform system, site,
            or service.
          </li>
          <li>
            Using any robot, spider, or other automated devices to monitor or
            copy our web pages or content without prior written permission.
          </li>
          <li>
            Uploading, posting, transmitting, or making available data or
            content you do not have the right to distribute.
          </li>
          <li>Conducting fraud or misrepresenting your identity.</li>
        </ul>
      </section>

      <h2>Copyright and Trademark Notice</h2>
      <section>
        <p>
          Our platform/services contain intellectual property owned by us and
          other parties. Except as otherwise specifically provided in this
          Agreement, you may not download or save a copy of the
          platform/services content for any purpose other than personal,
          non-commercial use.
        </p>
      </section>

      <h2>No Warranty</h2>
      <section>
        <p>
          THE CONTENT AND ALL SERVICES ASSOCIATED WITH OUR PLATFORMS ARE
          PROVIDED TO YOU ON AN "AS-IS" AND "AS AVAILABLE" BASIS. WE MAKE NO
          REPRESENTATIONS OR WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, AS TO
          THE OPERATION OF OUR SERVICES OR THE INFORMATION, CONTENT, MATERIALS,
          OR SERVICES INCLUDED ON OR ASSOCIATED WITH OUR SERVICES.
        </p>
      </section>

      <h2>Limitation of Liability and Damages</h2>
      <section>
        <p>
          IN NO EVENT WILL WE OR OUR AFFILIATES BE LIABLE TO ANY PARTY FOR ANY
          INDIRECT, DIRECT, SPECIAL, PUNITIVE, INCIDENTAL, OR CONSEQUENTIAL
          DAMAGES ARISING IN ANY WAY OUT OF THE USE OR INABILITY TO USE THE
          PLATFORM/SERVICES.
        </p>
      </section>

      <h2>Arbitration Agreement</h2>
      <section>
        <p>
          All disputes or claims arising between you and us shall be resolved
          exclusively through final and binding arbitration. You agree to waive
          your right to participate in any class action lawsuit or class-wide
          arbitration.
        </p>
      </section>

      <h2>Indemnification</h2>
      <section>
        <p>
          You agree to indemnify and hold TheContractorNow.com and its
          affiliates harmless from any claim or demand arising out of your use
          of this platform or violation of this Agreement.
        </p>
      </section>

      <h2>Termination</h2>
      <section>
        <p>
          We may terminate or suspend this platform/service at any time for any
          reason without notice to you.
        </p>
      </section>

      <h2>Entire Agreement</h2>
      <section>
        <p>
          This Agreement constitutes the entire terms of use agreement between
          you and us, superseding any prior agreements.
        </p>
      </section>
      </div>
    </div>
  );
};

export default UserTerms;
