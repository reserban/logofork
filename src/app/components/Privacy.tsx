import React, { useRef, useEffect, useCallback } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

const PrivacyPolicyModal: React.FC<{
  show: boolean;
  onClose: () => void;
}> = ({ show, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (show) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.body.style.overflow = "auto";
      };
    }
  }, [show, onClose, modalRef]);

  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-auto px-6">
      <div className="relative w-full max-w-3xl">
        <button
          onClick={onClose}
          className="absolute right-0 p-2 text-3xl text-white bg-white bg-opacity-20 rounded-tr-xl rounded-bl-xl -top-12 duration-500 hover:scale-105"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
        <div
          ref={modalRef}
          className="bg-black mt-3 border border-1 border-primary-500/20 p-8 rounded-tl-ct rounded-br-ct shadow-lg text-white max-h-[70vh] overflow-y-auto"
        >
          <h2 className="text-3xl font-bold text-primary-500">
            Privacy Policy
          </h2>
          <h3 className="text-lg mb-4 mt-1">Updated 05.07.2024</h3>
          <p>
            Personal data used on the website The operation of the website is
            ensured with the help of information systems and software modules
            that generally obtain some personal data; the transmission of this
            data is done implicitly so that online communication protocols
            return optimal results for the use of the website. This information
            is not collected to be associated with identified individuals, but
            due to their nature, they may allow, through processing and
            integration with certain data stored by third parties, the
            identification of users. This information includes IP addresses, the
            time of the request, the method used to send the request to the
            server, the size of the file obtained in response, as well as other
            parameters related to the user&apos;s operating system. To the
            extent that this information leads to the identification of a user,
            the provisions of this Privacy Policy become applicable.
          </p>
          <h2 className="text-xl font-bold text-primary-500 my-4">
            Processing Purpose
          </h2>
          <p>
            We use this data only to obtain anonymous statistical information
            about the use of the website and to verify its correct functioning.
            On the other hand, we process personal data to establish direct and
            accurate communication with those interested in the services we
            offer – a wide range of services in the field of graphic design and
            website development on a monthly basis for each client individually.
          </p>
          <h2 className="text-xl font-bold text-primary-500 my-4">
            Processing Basis
          </h2>
          <p>
            For the construction and functionality of the website, the legal
            basis for processing your data is provided by fulfilling legal
            obligations regarding the security aspects of our systems, according
            to art. 6 para. (1), lit. c) of Regulation (EU) 679/2016 and art.
            (3) of Law 506/2004; For the operation of the website, the legal
            basis for processing your personal data is constituted by the
            creation of an account according to art. 6 para. (1), lit. b) of
            Regulation (EU) 679/2016; For providing the latest updates on the
            products and services offered through our website, requesting
            additional information through the websites forms (e.g newsletter,
            sign-up), the legal basis for processing your personal data is
            fulfilled by obtaining your explicit, informed, and freely given
            consent in accordance with art. 6 para. (1), lit. a) and respecting
            the requirements for consent, set out in art. 7 and 8 of Regulation
            (EU) 679/2016.
          </p>
          <h2 className="text-xl font-bold text-primary-500 my-4">
            Contacting us and providing assistance
          </h2>
          <p>
            You have the option to contact us in various ways: by email, by
            phone, on social media. In this case, we may process the following
            personal data: name, surname, email, phone, and any other
            information you voluntarily provide when contacting us. We recommend
            providing only the information necessary for us to help you with
            your request. We use this information to respond to your request,
            including providing information about our services.
          </p>
          <h2 className="text-xl font-bold text-primary-500 my-4">
            Providing personal data
          </h2>
          <p>
            We are careful to maintain compliance with the principle of data
            minimization, but you should know that you can refuse to provide
            certain personal data (indicated above). However, in such a case,
            you may not be able to benefit from certain specific services within
            the contractual relationship described
          </p>
          <p>
            Your personal data will not be processed for the purpose of
            generating decisions based solely on automated processing that would
            produce legal effects on you or significantly affect you.
          </p>
          <h2 className="text-xl font-bold text-primary-500 my-4">
            Processing duration
          </h2>
          <p>
            As a rule, we will process your Personal Data for the duration of
            the website&apos;s existence unless you request their deletion. In
            certain circumstances, we may keep personal data for longer periods,
            for example, if we are required to do so in accordance with legal,
            regulatory, tax, or accounting requirements. At the same time, we
            may keep personal data for longer periods to have an accurate record
            of your relationships with us in case of any complaints or if we
            reasonably believe there is a prospect of litigation related to the
            processing of your personal data.
          </p>
          <h2 className="text-xl font-bold text-primary-500 my-4">
            Transfer of personal data
          </h2>
          <p>
            We may transfer personal data, to the extent necessary, to the
            following categories of recipients: contractual partners;
            subcontractors; payment processors; IT service companies; marketing
            companies; public authorities, courts, or arbitral tribunals, as
            well as competent authorities to investigate criminal offenses.
            These recipients may be located in the European Union and/or the
            European Economic Area. In case the recipients are located outside
            the European Union and the European Economic Area, including in
            countries that are not recognized as providing an adequate level of
            protection, the transfer of personal data is carried out only if
            there are adequate guarantees, in accordance with applicable law. In
            this regard, we rely on several guarantees, such as standard
            contractual clauses issued by the European Commission. You can
            receive from us a list of recipients from third countries, as well
            as a copy of the agreed provisions that ensure an adequate level of
            protection of personal data. For any such requests, please contact
            us at the contact details mentioned below.
          </p>
          <h2 className="text-xl font-bold text-primary-500 my-4">
            Security of personal data
          </h2>
          <p>
            The security of your personal data is important to us. Therefore,
            your personal data will be processed by applying reasonable
            technical and organizational measures to protect personal data, such
            as limiting access to personal data, encrypting or anonymizing
            personal data, storing on secure media. However, despite our
            efforts, we cannot always guarantee the effectiveness of the
            implemented security measures, and therefore, we cannot guarantee
            the security of personal data at all times.
          </p>
          <h2 className="text-xl font-bold text-primary-500 my-4">
            Your rights regarding the processing of personal data
          </h2>
          <p>
            In accordance with applicable law, you have the following rights:
          </p>
          <p className="my-4">
            Right of access: You have the right to obtain confirmation from us
            that your personal data is processed by us, as well as information
            about the specific processing, such as: the purpose, categories of
            personal data processed, recipients of personal data, the period for
            which personal data is retained, whether we transfer them abroad and
            how we protect them, your rights, the right to lodge a complaint
            with the supervisory authority, where we obtained personal data
            from.
          </p>
          <p className="my-4">
            Right to rectification: You have the possibility to request the
            rectification of your personal data, provided that legal
            requirements are met. In the event of errors, after notification, we
            will immediately correct your personal data.
          </p>
          <p className="my-4">
            Right to erasure: In certain cases, you have the possibility to
            request the erasure of personal data: (i) they are no longer
            necessary for the purposes for which we collected and processed
            them; (ii) you have withdrawn your consent for the processing of
            personal data, and we can no longer process personal data based on
            other legal grounds; (iii) personal data is processed unlawfully;
            (iv) you exercise a legal right to object. We will not be able to
            comply with your request for deletion if the processing of personal
            data is necessary to fulfill a legal obligation or to establish,
            exercise, or defend a legal right in court. There are also other
            circumstances where we are not obliged to comply with this request
            for deletion of personal data. Restriction of processing: You can
            request to restrict the processing of your personal data in the
            following situations: (i) if you contest the accuracy of personal
            data, for a period that allows us to verify the accuracy of the
            personal data in question; (ii) if the processing is unlawful, and
            you oppose the erasure of personal data, requesting instead the
            restriction of their use; (iii) if we no longer need personal data
            for the purpose of processing, but you request them for legal
            action; (iv) if you have objected to processing, for the time it is
            verified whether our legitimate rights as a data controller prevail
            over those of the data subject. We may continue to use personal data
            following a request for restriction if: (i) we have your consent;
            (ii) to establish, exercise, or ensure the defense of a legal right;
            or (iii) to protect the rights of another natural or legal person.
            Right to data portability: To the extent that personal data is
            processed based on your consent or for the performance of a contract
            and the processing is done by automated means, you have the right to
            have your personal data provided to you in a structured, commonly
            used, and machine-readable format and you have the right to transmit
            this personal data to another data controller. This right does not
            negatively affect the rights and freedoms of others.
          </p>
          <p className="my-4">
            Right to object: In certain situations, such as when we process your
            personal data based on a legitimate interest, you have the right to
            object to the processing of your personal data by us. In case of
            unjustified objection, Takameru SRL is entitled to continue
            processing personal data. Right to object to receiving commercial
            messages: You can also object to the processing of your personal
            data for the purpose of sending commercial messages. Withdrawal of
            consent: To the extent that we process your personal data based on
            your consent, you can withdraw your consent at any time without
            affecting the legality of the processing based on consent before its
            withdrawal. Right not to be subject to individual decisions: In
            certain circumstances, you have the right not to be subject to a
            decision based solely on automated processing, including profiling,
            which produces legal effects concerning you or similarly affects you
            to a significant extent. This right does not apply when the
            decision: (i) is necessary for the conclusion or performance of a
            contract between you and us; (ii) is authorized by law that provides
            for and provides adequate guarantees for your rights and freedoms;
            (iii) is based on your explicit consent.
          </p>
          <p className="my-4">
            Right to appeal to the supervisory authority: You have the right to
            lodge a complaint with the National Authority for the Supervision of
            Personal Data Processing (ANSPDCP) regarding any violation of your
            rights regarding the processing of your personal data. The contact
            details of ANSPDCP are: G-ral Blvd. Gheorghe Magheru 28-30, Sector
            1, postal code 010336 Bucharest, Romania; email:
            anspdcp@dataprotection.ro.
          </p>
          <h2 className="text-xl font-bold text-primary-500 my-4">
            Exercising your rights
          </h2>
          <p className="my-4">
            The Data Protection Officer (DPO) is responsible for facilitating
            communication between you, us, and the National Supervisory
            Authority (ANSPDCP), being an extension of the ANS in the processing
            of personal data of the data controller, for compliance with GDPR
            requirements. Feel free to rely on his expertise in defending your
            right to privacy and private life regarding the processing of your
            personal data, at the email address dpo@unzet.com
          </p>
          <p className="my-4">
            Identity verification: We pay the utmost attention to the
            confidentiality of all personal data and reserve the right to verify
            your identity if you make a request regarding personal data.
          </p>
          <p className="my-4">
            Fees: As a rule, you can exercise your rights for free. However, we
            reserve the right to request a reasonable fee if your requests are
            clearly unfounded or excessive, especially due to their repetitive
            nature.
          </p>
          <p className="my-4">
            Response time: We make every effort to respond to your requests
            within one month of receiving the request. This period may be
            extended by two months when necessary, taking into account the
            complexity and number of requests, in which case we will inform you
            of any such extension and the reasons for the delay.
          </p>
          <h2 className="text-xl font-bold text-primary-500 my-4">Contact</h2>
          <p>
            If you have any questions or concerns about this Privacy Policy or
            its implementation, you can contact us by email at we@unzet.com
          </p>
          <h2 className="text-xl font-bold text-primary-500 my-4">
            Updates to this privacy policy
          </h2>
          <p>
            We regularly review and, if necessary, periodically update this
            privacy policy when changes occur following the provision of
            services. If we want to use your personal data in a way that we have
            not identified before, we will contact you to provide information
            about it and, if necessary, to request your consent.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyModal;
