"use client"

import { useState } from "react"
import { MessageSquare, Phone, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

export function SupportOptions() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <LiveChatCard />
      <PhoneSupportCard />
      <EmailSupportCard />
    </div>
  )
}

function LiveChatCard() {
  const [chatOpen, setChatOpen] = useState(false)
  const { toast } = useToast()

  const startChat = () => {
    setChatOpen(false)
    toast({
      title: "Chat initiated",
      description: "A support agent will connect with you shortly.",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <MessageSquare className="mr-2 h-5 w-5" />
          Live Chat
        </CardTitle>
        <CardDescription>Chat with our support team in real-time</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <Dialog open={chatOpen} onOpenChange={setChatOpen}>
          <DialogTrigger asChild>
            <Button>Start Chat</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Start a Live Chat</DialogTitle>
              <DialogDescription>Please provide some information to help us assist you better.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Your name" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="issue">What can we help you with?</Label>
                <Textarea id="issue" placeholder="Describe your issue..." />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={startChat}>Connect with Support</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}

function PhoneSupportCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Phone className="mr-2 h-5 w-5" />
          Phone Support
        </CardTitle>
        <CardDescription>Call us at +1 (555) 123-4567</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <Button variant="outline" onClick={() => window.open("tel:+15551234567")}>
          Call Now
        </Button>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground text-center">
        Available Monday-Friday, 9am-5pm EST
      </CardFooter>
    </Card>
  )
}

function EmailSupportCard() {
  const [emailOpen, setEmailOpen] = useState(false)
  const { toast } = useToast()

  const sendEmail = () => {
    setEmailOpen(false)
    toast({
      title: "Email sent",
      description: "We'll respond to your inquiry within 24 hours.",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Mail className="mr-2 h-5 w-5" />
          Email Support
        </CardTitle>
        <CardDescription>We usually respond within 24 hours</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <Dialog open={emailOpen} onOpenChange={setEmailOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">Send Email</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Email Support</DialogTitle>
              <DialogDescription>Fill out this form and we'll get back to you via email.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Your Email</Label>
                <Input id="email" type="email" placeholder="email@example.com" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="Brief description of your issue" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" placeholder="Provide details about your issue..." />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={sendEmail}>Send Message</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}

