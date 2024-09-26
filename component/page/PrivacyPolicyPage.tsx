import React from 'react'
import { P, H1, H2, H3, H4, A } from '~/component/Content'
import useScripts from '~/hook/useScripts'

export default function PrivacyPolicyPage({
  title,
  children,
}: {
  title: string
  children?: React.ReactNode
}) {
  useScripts(['code'])

  return (
    <div className="relative mt-64">
      <div className="py-16">
        <H1 className="text-center whitespace-pre-line uppercase scale-y-80 mb-0 tracking-wide-015">
          Privacy Policy{'\n'}for{'\n'}
          {title}
        </H1>
        <H2>Introduction</H2>
        <P>
          This Privacy Policy (hereinafter referred to as the
          &quot;Policy&quot;) establishes the data management framework
          for Our website, herein referred to as the
          &quot;Website,&quot; which constitutes an integral component
          of the suite of digital platforms (hereinafter referred to as
          the &quot;Digital Platform Network&quot;) operated and managed
          by TermSurf, herein referred to as the &quot;Company.&quot;
        </P>
        <P>
          The purpose of this Policy is to delineate the protocols and
          principles adhered to by the Company regarding the collection,
          utilization, safeguarding, and dissemination of personal
          information (hereinafter referred to as &quot;Personal
          Information&quot;) gathered from individuals, henceforth
          designated as &quot;Users&quot; or &quot;You,&quot; who engage
          with, access, or use the Website. This encompasses data
          procured directly through user interactions, submissions, or
          indirectly via technological means such as cookies and
          tracking technologies.
        </P>
        <P>
          Your access to, interaction with, and utilization of the
          Website signify your explicit acknowledgment, full acceptance,
          and unconditional consent to all the practices, terms, and
          conditions delineated in this Policy. It is incumbent upon
          You, the User, to review this Policy in its entirety to ensure
          a comprehensive understanding of how your Personal Information
          will be handled.
        </P>
        <P>
          By engaging with the Website, you hereby affirm your agreement
          to comply with, and be bound by, the data practices as
          outlined within this Policy. Furthermore, this Policy is
          intended to ensure compliance with applicable data protection
          and privacy laws and regulations. The Company reserves the
          right, at its sole discretion, to amend, modify, or update
          this Policy at any time without prior notice, and such
          amendments will take effect immediately upon posting to the
          Website. Continued use of the Website subsequent to any such
          changes constitutes your unequivocal acceptance of the revised
          Policy.
        </P>
        <P>
          It is the User&#39;s responsibility to periodically review
          this Policy for updates, and your continued use of the Website
          following the posting of amendments signifies your consent to
          those changes. If at any point you do not agree to any portion
          of the current version of this Policy, your sole recourse is
          to discontinue the use of the Website forthwith.
        </P>
        <H2>Information Collection and Use</H2>
        <H3>Collection of Personal Information</H3>
        <H4>User-Provided Data</H4>
        <P>
          The Website, is structured to collect Personal Information
          that Users voluntarily provide. This information, essential
          for the delivery and personalization of our services, may
          include, but is not limited to, identifiable details such as
          names, electronic mail addresses, postal addresses, and
          telephonic contact details.
        </P>
        <H4>Purpose and Usage</H4>
        <P>
          This Personal Information is collected for the primary purpose
          of providing, optimizing, and personalizing our services,
          fulfilling user requests, and facilitating user engagement and
          communication.
        </P>
        <H3>Collection of Service Usage Data</H3>
        <H4>Automatic Data Collection</H4>
        <P>
          As part of our service delivery, the Website automatically
          collects information related to your interaction with our
          services. This includes, but is not limited to, user
          preferences, usage patterns, language settings, and other data
          relevant to enhancing the user experience.
        </P>
        <H4>Service Personalization</H4>
        <P>
          This data aids in tailoring our services to meet your
          preferences and needs, providing a more personalized and
          effective user experience.
        </P>
        <H3>Data Sharing with TermSurf</H3>
        <H4>Inter-Platform Data Exchange</H4>
        <P>
          In the context of the TermSurf digital platform network, user
          data collected by our website may be shared with, or accessed
          from, <A href="https://term.surf">TermSurf</A>. This
          integration facilitates a unified service experience across
          all affiliated platforms.
        </P>
        <H4>Privacy Safeguards</H4>
        <P>
          Measures are implemented to ensure that personal identifying
          information is either anonymized or minimized to protect user
          privacy while enabling service integration.
        </P>
        <H3>Service Enhancement through Data Integration</H3>
        <H4>Utilization of Shared Information</H4>
        <P>
          The collaborative use of shared information with TermSurf
          contributes to the enhancement of service offerings, the
          development of new features, and the improvement of the
          overall user experience across the network.
        </P>
        <H4>Innovation and Development</H4>
        <P>
          The exchange of information between platforms underpins our
          commitment to innovation, allowing for the continuous
          improvement and evolution of services provided to our users.
        </P>
        <H2>Cookies and Tracking Technologies</H2>
        <H3>Utilization of Cookies and Similar Technologies</H3>
        <H4>Enhancement of User Experience</H4>
        <P>
          The Website employs cookies and similar tracking technologies
          to improve user experience by remembering user preferences,
          customizing content, and analyzing site traffic.
        </P>
        <H4>Analytical Insights</H4>
        <P>
          These technologies provide valuable insights into user
          behavior, enabling us to optimize our website design, content,
          and services based on user interactions and preferences.
        </P>
        <H3>User Control and Consent</H3>
        <H4>Browser Settings and User Consent</H4>
        <P>
          Users retain control over the implementation of cookies and
          tracking technologies through their web browser settings.
          Users can adjust their settings to accept, refuse, or delete
          cookies according to their preferences.
        </P>
        <H4>Informed Consent</H4>
        <P>
          By continuing to use the Website, users are deemed to consent
          to our deployment of cookies and similar tracking technologies
          as detailed in this Privacy Policy.
        </P>
        <H2>Sharing and Disclosure of Information</H2>
        <H3>Prohibition on Sale of Personal Information</H3>
        <H4>Sale of Personal Information</H4>
        <P>
          The Company categorically states that it does not engage in
          the sale of Personal Information collected from the Users of
          our website to third parties for any purpose, including
          advertising or marketing.
        </P>
        <H3>Conditions for Data Sharing</H3>
        <H4>Third-party Service Providers</H4>
        <P>
          User data may be shared with third-party service providers
          under contractual agreements to facilitate the enhancement of
          user experience, provision of services requested by Users, and
          other operational purposes aligned with our services.
        </P>
        <H4>Compliance and Legal Obligations</H4>
        <P>
          The Company may disclose User information when required by
          law, such as to comply with a subpoena, or similar legal
          process, or when the Company believes in good faith that
          disclosure is necessary to protect its rights, protect your
          safety or the safety of others, investigate fraud, or respond
          to a government request.
        </P>
        <H4>Data Protection Terms</H4>
        <P>
          Any sharing or disclosure of User information will be
          conducted under stringent data protection terms, ensuring that
          third-party service providers adhere to confidentiality and
          security standards equivalent to those employed by the
          Company.
        </P>
        <H2>Data Security</H2>
        <H3>Implementation of Security Measures</H3>
        <H4>Security Protocols</H4>
        <P>
          The Company employs a comprehensive array of security measures
          designed to protect User data against unauthorized access,
          alteration, disclosure, or destruction. These measures
          include, but are not limited to, encryption, firewalls, and
          secure server facilities.
        </P>
        <H4>User Vigilance</H4>
        <P>
          Users are encouraged to contribute to their own security by
          safeguarding their account information and using strong
          passwords.
        </P>
        <H3>Acknowledgement of Risks</H3>
        <P>
          Despite the rigorous security protocols in place, Users should
          acknowledge that no method of transmission over the internet,
          or method of electronic storage, is entirely secure. While the
          Company strives to protect personal information, absolute
          security cannot be guaranteed.
        </P>
        <H2>International Data Transfer</H2>
        <H3>Cross-border Information Transfer</H3>
        <H4>Transfer of Data</H4>
        <P>
          The personal information collected by the Company may be
          stored, processed, and transferred between any of the
          countries in which the Company operates, potentially involving
          the transfer of data outside the User&#39;s jurisdiction.
        </P>
        <H4>International Privacy Standards</H4>
        <P>
          Transfers of personal information are conducted in a manner
          that is consistent with legal requirements, ensuring an
          adequate level of protection and security.
        </P>
        <H3>User Consent to International Transfer</H3>
        <P>
          By utilizing the services provided, Users consent to the
          transfer of their information to countries outside their own,
          acknowledging that these countries may have different data
          protection laws than those from the User’s country of
          residence or citizenship.
        </P>
        <H2>Children&#39;s Privacy</H2>
        <H3>Age Limitations</H3>
        <H4>Intended Audience</H4>
        <P>
          The Websites operated by the Company, including our website,
          are not designed for, targeted at, or intended for use by
          children under the age of thirteen (13). The Company does not
          knowingly engage in the collection of personally identifiable
          information from children under this age threshold.
        </P>
        <H4>Parental Notice and Consent</H4>
        <P>
          In instances where the collection of personal information from
          children under the age of thirteen (13) is necessary for
          specific services, the Company will undertake to inform
          parents or legal guardians and obtain verifiable parental
          consent in accordance with applicable laws and regulations.
        </P>
        <H3>Removal of Children&#39;s Data</H3>
        <P>
          In the event that the Company becomes aware that it has
          inadvertently collected personal information from a child
          under the age of thirteen (13) without appropriate parental
          consent, immediate steps will be taken to delete such
          information from the Company&#39;s databases and to prevent
          the child’s participation in the relevant services.
        </P>
        <H2>Your Rights and Choices</H2>
        <H3>Personal Data Rights</H3>
        <H4>Access and Review</H4>
        <P>
          You, as a User, are entitled to request access to the personal
          information that the Company holds about you. You have the
          right to review your information and ensure it is accurate,
          complete, and up-to-date.
        </P>
        <H4>Correction and Deletion</H4>
        <P>
          You have the right to request the correction of inaccurate
          information or the deletion of your personal information from
          the Company’s systems and records, subject to certain
          exceptions prescribed by law.
        </P>
        <H4>Data Portability</H4>
        <P>
          Where applicable, you have the right to data portability,
          which allows you to obtain and reuse your personal data for
          your own purposes across different services.
        </P>
        <H3>Choice and Opt-Out</H3>
        <H4>Consent Withdrawal</H4>
        <P>
          You have the right to withdraw your consent at any time where
          the Company relied on your consent to process your personal
          information. However, this will not affect the lawfulness of
          any processing carried out before you withdraw your consent.
        </P>
        <H4>Opt-Out of Data Uses</H4>
        <P>
          You are entitled to opt-out of certain uses of your personal
          information, such as direct marketing communications or the
          sharing of your data with third-party services for their
          marketing purposes.
        </P>
        <H4>Account Modifications</H4>
        <P>
          Users can typically manage their preferences and provide or
          withdraw consents by logging into their account settings on
          the Website or by contacting the Company directly.
        </P>
        <H3>Exercising Your Rights</H3>
        <P>
          To exercise any of your rights related to your personal
          information, please contact the Company using the contact
          information provided in this policy. The Company will respond
          to your request within a reasonable timeframe and in
          accordance with applicable laws.
        </P>
        <H2>California Consumer Privacy Act (CCPA) Rights Clauses</H2>
        <H3>Right to Know</H3>
        <H4>Request for Information</H4>
        <P>
          California residents possess the statutory right to request
          and obtain disclosure regarding the Personal Information
          collected, utilized, disclosed, or sold by the Company over
          the preceding twelve months.
        </P>
        <H4>Details of Information</H4>
        <P>
          This includes the categories of Personal Information
          collected, the sources from which it was collected, the
          business purpose for collecting or selling the information,
          and the categories of third parties with whom the information
          is shared.
        </P>
        <H3>Right to Delete</H3>
        <H4>Deletion Request</H4>
        <P>
          California residents are entitled to request the deletion of
          their Personal Information held by the Company, subject to
          certain exceptions provided by law.
        </P>
        <H4>Obligation to Delete</H4>
        <P>
          Upon receipt of a verifiable request from the resident, the
          Company will delete the resident&#39;s Personal Information
          from its records and direct any service providers to do the
          same.
        </P>
        <H3>Right to Opt-Out</H3>
        <H4>Sale of Information</H4>
        <P>
          California residents have the unequivocal right to opt-out of
          the sale of their Personal Information by the Company.
        </P>
        <H4>Exercise of Right</H4>
        <P>
          Residents may exercise this right through a designated “Do Not
          Sell My Personal Information” link or mechanism provided on
          the Website.
        </P>
        <H3>Non-Discrimination</H3>
        <H4>Exercise of Rights</H4>
        <P>
          The Company assures that it will not discriminate against any
          consumer for exercising their rights under the California
          Consumer Privacy Act.
        </P>
        <H4>Request Process</H4>
        <P>
          California residents may submit requests to exercise their
          CCPA rights using the contact information provided within this
          policy.
        </P>
        <H4>Verification Process</H4>
        <P>
          The Company will undertake measures to verify the identity of
          the person making the request to ensure the security and
          privacy of user data.
        </P>
        <H2>Data Retention Policy</H2>
        <H3>Retention Practices</H3>
        <H4>Duration of Retention</H4>
        <P>
          The Company commits to retaining Personal Information no
          longer than is necessary to fulfill the specific purposes
          outlined in this Privacy Policy, except where a longer
          retention period is necessitated or sanctioned by law.
        </P>
        <H3>Post-Account Deletion</H3>
        <H4>Residual Data</H4>
        <P>
          Following the deletion of a user’s account, certain Personal
          Information may persist in the Company’s records to the extent
          required to fulfill legal obligations or to resolve disputes.
        </P>
        <H2>Data Breach Notification</H2>
        <H3>Breach Notification</H3>
        <H4>Notification Protocol</H4>
        <P>
          In the occurrence of a data breach materially affecting
          Personal Information, the Company commits to notifying
          affected Users in accordance with the timeframe mandated by
          applicable law.
        </P>
        <H4>Remedial Actions</H4>
        <P>
          Immediate steps will be undertaken to minimize harm and secure
          User data following a breach.
        </P>
        <H2>Third-party Data Collection</H2>
        <H3>Disclosure</H3>
        <H4>External Sites and Services</H4>
        <P>
          The Privacy Policy extends only to data collection practices
          directly associated with the Website; it does not encompass
          data collection practices by third-party websites and services
          linked from our websites.
        </P>
        <H4>User Responsibility</H4>
        <P>
          Users are advised to review the privacy policies and terms of
          third-party providers to understand their data collection
          practices.
        </P>
        <H2>Automated Decision-Making</H2>
        <H3>Automated Processes</H3>
        <H4>Automated Decision-Making</H4>
        <P>
          The Company utilizes automated processes and decision-making
          systems, including profiling, to enhance user experience,
          service personalization, and operational efficiency on the
          Website. These processes are based on the analysis of
          collected user data.
        </P>
        <H4>User Rights</H4>
        <P>
          Users maintain specific rights concerning automated
          decision-making and profiling as per applicable laws. Users
          have the right to be informed about the existence of any
          automated decision-making processes, to challenge decisions
          made solely by automated means, and to request human
          intervention or express their viewpoint regarding decisions
          affecting their legal rights or significantly impacting them.
        </P>
        <H2>Policy Updates Notification</H2>
        <H3>Notification Procedure</H3>
        <H4>Major Revisions</H4>
        <P>
          In the case of significant modifications or updates to this
          Privacy Policy, the Company will provide notification to Users
          through the Website or by direct email communication, ensuring
          Users are informed of changes affecting the handling of their
          personal information.
        </P>
        <H4>Review Recommendation</H4>
        <P>
          Users are encouraged to periodically review this Privacy
          Policy to stay informed about how the Company is protecting
          their information and to be aware of any updates or changes.
        </P>
        <H2>Changes to Privacy Policy</H2>
        <H3>Modification Rights</H3>
        <P>
          The Company reserves the unequivocal right to modify, amend,
          or update this Privacy Policy at any time and for any reason.
          Such modifications will become effective immediately upon
          their posting on the Website.
        </P>
        <H3>User Responsibility</H3>
        <P>
          It is the responsibility of the User to review this Privacy
          Policy periodically. The continued use of the Website
          following the posting of any changes constitutes acceptance of
          those changes by the User.
        </P>
        <H2>Contact Information</H2>
        <H3>Reaching Out</H3>
        <P>
          Should Users have any questions, concerns, or inquiries
          regarding this Privacy Policy or the data practices of the
          Company, contact can be made directly through the provided
          email address:{' '}
          <A href="mailto:base@term.surf">base@term.surf</A>.
        </P>
        <H3>Commitment to Address Concerns</H3>
        <P>
          The Company is committed to addressing User concerns and
          questions regarding privacy practices and data handling. We
          aim to ensure clarity, transparency, and the safeguarding of
          User privacy throughout the use of our website and services.
        </P>
      </div>
      {children}
    </div>
  )
}
