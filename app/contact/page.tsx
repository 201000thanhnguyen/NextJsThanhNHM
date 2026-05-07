import Link from "next/link"

import { PageHeader } from "@/components/shared/PageHeader"
import { Card, CardContent } from "@/components/ui/card"
import { Mail } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
      <PageHeader
        title="Contact"
        description="Reach the team for general inquiries about this site."
        icon={<Mail className="h-5 w-5 text-neutral-700" />}
      />
      <Card className="mt-6 border-neutral-200 shadow-sm">
        <CardContent className="p-6 text-sm text-neutral-700">
          <p>
            For product or account questions, use the contact channel your organization
            provides. This page is a lightweight placeholder for the public site.
          </p>
          <p className="mt-4">
            <span className="font-medium text-neutral-900">Email (example):</span>{" "}
            <Link
              href="mailto:hello@example.com"
              className="text-blue-600 underline-offset-2 hover:underline"
            >
              hello@example.com
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
