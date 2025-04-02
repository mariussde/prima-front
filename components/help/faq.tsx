"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqCategories = [
  {
    id: "general",
    name: "General",
    questions: [
      {
        question: "What is Prima?",
        answer:
          "Prima is a comprehensive dashboard application with user management, analytics, and reporting features designed to streamline your business operations.",
      },
      {
        question: "How do I get started with Prima?",
        answer:
          "After signing up, you'll be guided through a quick onboarding process. You can then customize your dashboard, add users, and start exploring the features.",
      },
      {
        question: "Is there a mobile app available?",
        answer:
          "Yes, Prima is available as a responsive web application and native mobile apps for iOS and Android platforms.",
      },
    ],
  },
  {
    id: "account",
    name: "Account Management",
    questions: [
      {
        question: "How do I create a new user account?",
        answer:
          "Navigate to the Users section, click 'Add User', fill in the required information, and click 'Create User'. The new user will receive an email with login instructions.",
      },
      {
        question: "How can I edit user permissions?",
        answer:
          "Go to the Users section, find the user you want to modify, click the edit icon, and adjust their role or specific permissions as needed.",
      },
      {
        question: "What do the different user roles mean?",
        answer:
          "Admin: Full system access, User: Standard access to assigned modules, Editor: Can modify content but not settings, Viewer: Read-only access to assigned modules.",
      },
    ],
  },
  {
    id: "billing",
    name: "Billing & Subscription",
    questions: [
      {
        question: "How do I update my billing information?",
        answer: "Go to Settings > Billing, click 'Edit Payment Method', and enter your new payment details.",
      },
      {
        question: "Can I change my subscription plan?",
        answer: "Yes, you can upgrade or downgrade your plan at any time from Settings > Billing > Subscription Plans.",
      },
      {
        question: "How do I get an invoice for my subscription?",
        answer:
          "All invoices are automatically generated and can be found in Settings > Billing > Invoice History. You can download them as PDF files.",
      },
    ],
  },
  {
    id: "technical",
    name: "Technical Support",
    questions: [
      {
        question: "What browsers are supported?",
        answer:
          "Prima supports the latest versions of Chrome, Firefox, Safari, and Edge. Internet Explorer is not supported.",
      },
      {
        question: "How do I report a bug?",
        answer:
          "You can report bugs through the Ticketing System in the Help Center. Please include steps to reproduce the issue and screenshots if possible.",
      },
      {
        question: "Is my data secure?",
        answer:
          "Yes, we use industry-standard encryption and security practices. All data is encrypted at rest and in transit, and we perform regular security audits.",
      },
    ],
  },
]

export function FrequentlyAskedQuestions() {
  const [activeCategory, setActiveCategory] = useState("general")

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {faqCategories.map((category) => (
          <Button
            key={category.id}
            variant={activeCategory === category.id ? "default" : "outline"}
            onClick={() => setActiveCategory(category.id)}
          >
            {category.name}
          </Button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{faqCategories.find((c) => c.id === activeCategory)?.name} FAQs</CardTitle>
          <CardDescription>
            Frequently asked questions about {faqCategories.find((c) => c.id === activeCategory)?.name.toLowerCase()}{" "}
            topics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqCategories
              .find((c) => c.id === activeCategory)
              ?.questions.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
          </Accordion>
        </CardContent>
      </Card>

      <div className="text-center mt-8">
        <p className="text-muted-foreground mb-2">Need more help? Check out our detailed documentation</p>
        <Button variant="outline">View Documentation</Button>
      </div>
    </div>
  )
}

