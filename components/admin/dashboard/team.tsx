"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MoreHorizontal, Plus, User } from "lucide-react";
import { addTeamMember } from "@/app/actions/doc";
import { toast } from "sonner";
import { getAccessToken, getUserData } from "@/lib/getTokens";
import { backend_url } from "@/lib/utils";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  imageUrl: string;
  lastSignIn: string;
}

const members: any[] = [
  {
    id: "1",
    name: "Nell Sims",
    email: "email@example.com",
    imageUrl: "https://avatar.iran.liara.run/public/4",
  },
  {
    id: "2",
    name: "Bonnie Green",
    email: "email@example.com",
    imageUrl: "https://avatar.iran.liara.run/public/4",
  },
  {
    id: "3",
    name: "Nell Sims",
    email: "email@example.com",
    imageUrl: "https://avatar.iran.liara.run/public/4",
  },
  {
    id: "4",
    name: "Bonnie Green",
    email: "email@example.com",
    imageUrl: "https://avatar.iran.liara.run/public/4",
  },
  {
    id: "5",
    name: "Nell Sims",
    email: "email@example.com",
    imageUrl: "https://avatar.iran.liara.run/public/4",
  },
];

export default function TeamMembers() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const user = getUserData()
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const registerTeamMember = async (name: string, email: string) => {
    try {
      const response = await fetch(`${backend_url}/admin/team/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: "0a29e4ddcac85de100e6b3a9e416a32b",
          email,
          image: "",
          name,
          namespace: "",
          password: "adarsh1",
          response_type: "code",
          type: "team",
        }),
      });

      const data = await response.json();
      setTeamMembers(data)
      console.log("Registration successful:", data);
      return {success:"true"};
    } catch (error) {
      console.error("Error registering team member:", error);
    }
  };
  const fetchTeamMember = async () => {
    try {
      const response = await fetch(`${backend_url}/admin/team`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      console.log("Registration successful:", data);
      setTeamMembers(data);
    } catch (error) {
      console.error("Error registering team member:", error);
    }
  };
  useEffect(() => {
    fetchTeamMember();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if (!name || !email) {
      return alert("Please fill all fields");
    }
    try {
      const access_token = getAccessToken();
      const result = await registerTeamMember(name, email);

      if (result?.success) {
        toast.success("Team member has been invited");
        setOpen(false);
        setEmail("");
      } else {
        toast.error("Failed to add team member");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="w-full pr-3">
        <h2 className="mb-4 text-lg text-[#59748A] font-semibold">
          Active Team Members
        </h2>
        <div className="space-y-4">
          {teamMembers &&
            teamMembers.map((member) => (
              <div
                key={member._id}
                className="flex items-center justify-between gap-4 py-2"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={"https://avatar.iran.liara.run/public/4"}
                      alt={member.name}
                    />
                    <AvatarFallback>
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{member.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {member.email}
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">More options</span>
                </Button>
              </div>
            ))}
          {user?.type==="admin" && <Button
            className="w-full"
            variant="outline"
            onClick={() => setOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add member
          </Button>}
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add team member</DialogTitle>
            <DialogDescription>
              Enter the email address of the person you want to invite to your
              team.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="email">Name</Label>
                <Input
                  id="name"
                  type="name"
                  placeholder="Enter a Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter an email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading || !email}>
                {isLoading ? "Adding..." : "Add member"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
