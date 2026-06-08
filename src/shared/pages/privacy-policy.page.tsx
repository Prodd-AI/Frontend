import { Link } from "react-router-dom";
import {
  ArrowLeft,
  BadgeCheck,
  Database,
  FileText,
  LockKeyhole,
  Mail,
  Scale,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import Logo from "@/shared/components/Logo.component";

const collectedData = [
  {
    title: "Account and identity data",
    text: "Name, email address, password credentials, role, authentication status, and account preferences.",
  },
  {
    title: "Organization and team data",
    text: "Company name, organization type, team names, team membership, work roles, invite details, and administrative settings.",
  },
  {
    title: "Productivity and wellbeing data",
    text: "Tasks, focus activity, mood check-ins, team sentiment signals, timesheet activity, goals, notes, and related workplace insights submitted in the product.",
  },
  {
    title: "Device, usage, and security data",
    text: "IP address, browser and device details, log events, feature usage, session activity, cookie or similar technology data, and security diagnostics.",
  },
  {
    title: "Support and communications",
    text: "Messages, requests, feedback, meeting or invitation metadata, and information you provide when contacting us.",
  },
];

const rights = [
  "Access a copy of personal data associated with your account.",
  "Correct inaccurate profile, organization, or workplace information.",
  "Request deletion of personal data, subject to account, legal, security, and contractual requirements.",
  "Export or receive portable account information where technically available.",
  "Object to or restrict certain processing, including optional analytics or non-essential communications.",
  "Withdraw consent where processing depends on consent.",
  "Appeal or complain to a privacy regulator where applicable law gives you that right.",
];

const securityMeasures = [
  "Use encrypted transport for supported application traffic.",
  "Apply role-based access controls for organization and team information.",
  "Limit internal access to people and service providers who need data to operate, support, secure, or improve Prodily.",
  "Monitor systems for abuse, unauthorized access, service disruption, and suspicious activity.",
  "Review data handling practices when adding integrations, vendors, or new product features.",
];

function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#F8F7FB] text-[#251F2D]">
      <header className="border-b border-[#E7E1EF] bg-white">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" aria-label="Prodily home">
            <Logo />
          </Link>
          <Link
            to="/auth/login"
            className="text-sm font-semibold text-[#6619DE] transition-colors hover:text-[#5915c7]"
          >
            Login
          </Link>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <Link
          to="/auth/register"
          className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-[#6619DE] hover:text-[#5915c7]"
        >
          <ArrowLeft className="size-4" />
          Back to registration
        </Link>

        <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div className="flex flex-col gap-5">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#D8C8F2] bg-white px-3 py-1 text-sm font-semibold text-[#6619DE]">
              <ShieldCheck className="size-4" />
              Privacy notice
            </div>
            <div className="flex flex-col gap-4">
              <h1 className="text-4xl font-bold leading-tight text-[#251F2D] sm:text-5xl">
                Privacy Policy
              </h1>
              <p className="max-w-3xl text-base leading-7 text-[#3A404D] sm:text-lg">
                This policy explains how Prodily collects, uses, shares,
                protects, and retains personal information when people use our
                productivity, team management, mood, and workplace insight
                tools.
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-[#E7E1EF] bg-white p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <FileText className="mt-1 size-5 text-[#6619DE]" />
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-[#6B7280]">
                  Last updated
                </p>
                <p className="mt-1 text-lg font-semibold">June 8, 2026</p>
                <p className="mt-3 text-sm leading-6 text-[#4B5563]">
                  This page is intended as a general product privacy notice and
                  should be reviewed by counsel before production legal use.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: Database,
              title: "Data collection",
              text: "We describe the categories of information collected, why it is used, and when it may be shared.",
            },
            {
              icon: UserCheck,
              title: "User rights",
              text: "We explain how users can access, correct, delete, export, restrict, or object to certain processing.",
            },
            {
              icon: LockKeyhole,
              title: "Security policy",
              text: "We outline safeguards for access, encryption, monitoring, vendors, and incident response.",
            },
          ].map(({ icon: Icon, title, text }) => (
            <article
              key={title}
              className="rounded-lg border border-[#E7E1EF] bg-white p-5 shadow-sm"
            >
              <Icon className="size-5 text-[#6619DE]" />
              <h2 className="mt-4 text-lg font-semibold">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-[#4B5563]">{text}</p>
            </article>
          ))}
        </section>

        <section className="rounded-lg border border-[#E7E1EF] bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center gap-3">
            <Database className="size-6 text-[#6619DE]" />
            <h2 className="text-2xl font-bold">Data Collection</h2>
          </div>
          <p className="mt-4 max-w-4xl text-sm leading-6 text-[#4B5563] sm:text-base">
            We collect information that users provide directly, information
            generated while using Prodily, and limited technical information
            needed to operate and secure the service. We also may receive data
            from workplace integrations when an organization connects them.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {collectedData.map((item) => (
              <div key={item.title} className="rounded-lg bg-[#F8F7FB] p-4">
                <h3 className="font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#4B5563]">
                  {item.text}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            <div>
              <h3 className="font-semibold">How we use data</h3>
              <p className="mt-2 text-sm leading-6 text-[#4B5563]">
                To provide accounts, onboarding, team management, task tracking,
                mood insights, analytics, support, product improvement,
                security, fraud prevention, compliance, and service
                communications.
              </p>
            </div>
            <div>
              <h3 className="font-semibold">How we share data</h3>
              <p className="mt-2 text-sm leading-6 text-[#4B5563]">
                With organization administrators, authorized team members,
                service providers, connected integrations, legal authorities
                when required, and parties involved in a business transfer. We
                do not sell personal information.
              </p>
            </div>
            <div>
              <h3 className="font-semibold">How long we keep data</h3>
              <p className="mt-2 text-sm leading-6 text-[#4B5563]">
                We keep information while an account or organization is active
                and as needed for product operation, security, audit, legal, tax,
                dispute, backup, and legitimate business purposes.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-[#E7E1EF] bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center gap-3">
            <UserCheck className="size-6 text-[#6619DE]" />
            <h2 className="text-2xl font-bold">User Rights</h2>
          </div>
          <p className="mt-4 max-w-4xl text-sm leading-6 text-[#4B5563] sm:text-base">
            Depending on where you live and how your organization uses Prodily,
            you may have the following privacy rights. We may need to verify
            your identity and, for workplace accounts, coordinate with your
            employer or organization administrator.
          </p>

          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {rights.map((right) => (
              <div key={right} className="flex gap-3 rounded-lg bg-[#F8F7FB] p-4">
                <BadgeCheck className="mt-0.5 size-5 shrink-0 text-[#6619DE]" />
                <p className="text-sm leading-6 text-[#3A404D]">{right}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-[#E7E1EF] bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center gap-3">
            <LockKeyhole className="size-6 text-[#6619DE]" />
            <h2 className="text-2xl font-bold">Security Policy</h2>
          </div>
          <p className="mt-4 max-w-4xl text-sm leading-6 text-[#4B5563] sm:text-base">
            No online service can guarantee perfect security, but Prodily uses
            administrative, technical, and organizational safeguards designed to
            protect personal information from unauthorized access, misuse,
            disclosure, alteration, and loss.
          </p>

          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {securityMeasures.map((measure) => (
              <div
                key={measure}
                className="flex gap-3 rounded-lg border border-[#E7E1EF] p-4"
              >
                <ShieldCheck className="mt-0.5 size-5 shrink-0 text-[#6619DE]" />
                <p className="text-sm leading-6 text-[#3A404D]">{measure}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-lg bg-[#251F2D] p-5 text-white">
            <h3 className="font-semibold">Incident handling</h3>
            <p className="mt-2 text-sm leading-6 text-[#F3F4F6]">
              If we identify a security incident affecting personal
              information, we assess scope and risk, take containment steps,
              preserve evidence, notify affected organizations or users when
              required, and improve controls based on findings.
            </p>
          </div>
        </section>

        <section className="rounded-lg border border-[#E7E1EF] bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center gap-3">
            <Scale className="size-6 text-[#6619DE]" />
            <h2 className="text-2xl font-bold">Contact and Legal</h2>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-lg bg-[#F8F7FB] p-5">
              <Mail className="size-5 text-[#6619DE]" />
              <h3 className="mt-4 font-semibold">Privacy requests</h3>
              <p className="mt-2 text-sm leading-6 text-[#4B5563]">
                Email privacy requests, security concerns, or questions about
                this policy to:
              </p>
              <a
                href="mailto:privacy@prodily.com"
                className="mt-3 inline-flex break-all font-semibold text-[#6619DE] hover:text-[#5915c7]"
              >
                privacy@prodily.com
              </a>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <h3 className="font-semibold">Legal basis</h3>
                <p className="mt-2 text-sm leading-6 text-[#4B5563]">
                  We process data to perform contracts, operate the service,
                  protect users and systems, comply with law, support legitimate
                  business interests, and honor consent where required.
                </p>
              </div>
              <div>
                <h3 className="font-semibold">Workplace accounts</h3>
                <p className="mt-2 text-sm leading-6 text-[#4B5563]">
                  If your account is provided by an employer or organization,
                  that organization may control some data and settings. Contact
                  your administrator for organization-specific requests.
                </p>
              </div>
              <div>
                <h3 className="font-semibold">Children</h3>
                <p className="mt-2 text-sm leading-6 text-[#4B5563]">
                  Prodily is not intended for children under 13, and we do not
                  knowingly collect personal information from children.
                </p>
              </div>
              <div>
                <h3 className="font-semibold">Policy changes</h3>
                <p className="mt-2 text-sm leading-6 text-[#4B5563]">
                  We may update this policy as the product, laws, or security
                  practices change. Material updates will be posted here or
                  communicated through appropriate product channels.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default PrivacyPolicyPage;
