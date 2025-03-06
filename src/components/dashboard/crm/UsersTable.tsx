
import React from "react";
import { MapPin, MoreHorizontal, Mail, MessageSquare, UserIcon } from "lucide-react";
import { User } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import UserAvatar from "@/components/UserAvatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

interface UsersTableProps {
  users: User[];
  selectedUsers: string[];
  onSelectUser: (userId: string) => void;
  onSelectAll: () => void;
  onEmailUser: (userId: string) => void;
  onSmsUser: (userId: string) => void;
}

const UsersTable = ({
  users,
  selectedUsers,
  onSelectUser,
  onSelectAll,
  onEmailUser,
  onSmsUser
}: UsersTableProps) => {
  const { toast } = useToast();

  return (
    <ScrollArea className="h-[500px]">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40px]">
              <Checkbox 
                checked={selectedUsers.length === users.length && users.length > 0}
                onCheckedChange={onSelectAll}
              />
            </TableHead>
            <TableHead>User</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Interests</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No users match your filter criteria.
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Checkbox 
                    checked={selectedUsers.includes(user.id)}
                    onCheckedChange={() => onSelectUser(user.id)}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <UserAvatar user={user} className="h-8 w-8" />
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-xs text-muted-foreground">
                        Joined: {user.signupDate || "N/A"}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {user.email || "No email"}
                    <div className="text-xs text-muted-foreground">
                      {user.phone || "No phone"}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center text-sm">
                    <MapPin className="mr-1 h-3 w-3 text-muted-foreground" />
                    {user.location?.city || "Unknown location"}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {user.interests && user.interests.length > 0 ? (
                      user.interests.slice(0, 2).map((interest) => (
                        <Badge variant="outline" key={interest} className="text-xs">
                          {interest}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-xs text-muted-foreground">No interests</span>
                    )}
                    {user.interests && user.interests.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{user.interests.length - 2} more
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => onEmailUser(user.id)}
                      >
                        <Mail className="mr-2 h-4 w-4" />
                        Email User
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onSmsUser(user.id)}
                      >
                        <MessageSquare className="mr-2 h-4 w-4" />
                        SMS User
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => {
                          console.log("View user profile:", user);
                          toast({
                            title: "User Profile",
                            description: `Viewing profile for ${user.name}`,
                          });
                        }}
                      >
                        <UserIcon className="mr-2 h-4 w-4" />
                        View Profile
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </ScrollArea>
  );
};

export default UsersTable;
