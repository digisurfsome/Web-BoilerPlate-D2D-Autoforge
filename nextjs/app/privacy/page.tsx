import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Our privacy policy explains how we collect, use, and protect your personal information.'
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold tracking-tight text-foreground">
        Privacy Policy
      </h1>
      <p className="mt-4 text-muted-foreground">
        Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
      </p>

      <div className="mt-12 space-y-10">
        <section>
          <h2 className="text-2xl font-semibold text-foreground">
            What We Collect
          </h2>
          {/* TODO: Fill with actual policy */}
          <p className="mt-3 text-muted-foreground leading-relaxed">
            Describe the types of personal information you collect (e.g. name,
            email, usage data, device information).
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground">
            How We Use It
          </h2>
          {/* TODO: Fill with actual policy */}
          <p className="mt-3 text-muted-foreground leading-relaxed">
            Explain the purposes for which collected data is used (e.g. account
            management, service improvement, communications).
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground">Cookies</h2>
          {/* TODO: Fill with actual policy */}
          <p className="mt-3 text-muted-foreground leading-relaxed">
            Describe your use of cookies and similar tracking technologies,
            including types of cookies and how users can control them.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground">
            Third Parties
          </h2>
          {/* TODO: Fill with actual policy */}
          <p className="mt-3 text-muted-foreground leading-relaxed">
            List any third-party services that receive user data (e.g. analytics
            providers, payment processors, hosting services).
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground">
            Your Rights
          </h2>
          {/* TODO: Fill with actual policy */}
          <p className="mt-3 text-muted-foreground leading-relaxed">
            Explain user rights regarding their data (e.g. access, correction,
            deletion, data portability) and how to exercise them.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground">Contact</h2>
          {/* TODO: Fill with actual policy */}
          <p className="mt-3 text-muted-foreground leading-relaxed">
            Provide contact information for privacy-related inquiries (e.g.
            email address, physical address, data protection officer).
          </p>
        </section>
      </div>
    </div>
  );
}
