import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Our terms of service outline the rules and regulations for using our platform.'
};

export default function TermsOfServicePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold tracking-tight text-foreground">
        Terms of Service
      </h1>
      <p className="mt-4 text-muted-foreground">
        Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
      </p>

      <div className="mt-12 space-y-10">
        <section>
          <h2 className="text-2xl font-semibold text-foreground">Agreement</h2>
          {/* TODO: Fill with actual policy */}
          <p className="mt-3 text-muted-foreground leading-relaxed">
            Describe what constitutes acceptance of these terms (e.g. by
            accessing or using the service, the user agrees to be bound by these
            terms).
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground">
            Use License
          </h2>
          {/* TODO: Fill with actual policy */}
          <p className="mt-3 text-muted-foreground leading-relaxed">
            Define the scope of the license granted to users, including
            permitted and prohibited uses of the service and its content.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground">
            Disclaimer
          </h2>
          {/* TODO: Fill with actual policy */}
          <p className="mt-3 text-muted-foreground leading-relaxed">
            State that the service is provided &quot;as is&quot; without
            warranties of any kind, express or implied.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground">
            Limitations
          </h2>
          {/* TODO: Fill with actual policy */}
          <p className="mt-3 text-muted-foreground leading-relaxed">
            Define limitations of liability, including caps on damages and
            exclusions for indirect or consequential damages.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground">Revisions</h2>
          {/* TODO: Fill with actual policy */}
          <p className="mt-3 text-muted-foreground leading-relaxed">
            Explain how and when these terms may be updated, and how users will
            be notified of changes.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground">
            Governing Law
          </h2>
          {/* TODO: Fill with actual policy */}
          <p className="mt-3 text-muted-foreground leading-relaxed">
            Specify the jurisdiction whose laws govern these terms and where
            disputes will be resolved.
          </p>
        </section>
      </div>
    </div>
  );
}
