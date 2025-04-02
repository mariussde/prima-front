import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

type ActivityItem = {
  id: string
  user: {
    name: string
    avatar?: string
    initials: string
  }
  action: string
  target: string
  date: string
  type: "create" | "update" | "delete" | "login"
}

const activities: ActivityItem[] = [
  {
    id: "1",
    user: {
      name: "John Doe",
      initials: "JD",
    },
    action: "created",
    target: "New Project",
    date: "2 hours ago",
    type: "create",
  },
  {
    id: "2",
    user: {
      name: "Jane Smith",
      initials: "JS",
    },
    action: "updated",
    target: "User Profile",
    date: "3 hours ago",
    type: "update",
  },
  {
    id: "3",
    user: {
      name: "Mike Johnson",
      initials: "MJ",
    },
    action: "deleted",
    target: "Old Document",
    date: "5 hours ago",
    type: "delete",
  },
  {
    id: "4",
    user: {
      name: "Sarah Williams",
      initials: "SW",
    },
    action: "logged in",
    target: "",
    date: "6 hours ago",
    type: "login",
  },
  {
    id: "5",
    user: {
      name: "Alex Brown",
      initials: "AB",
    },
    action: "created",
    target: "New Task",
    date: "1 day ago",
    type: "create",
  },
]

export function RecentActivity() {
  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-center gap-4">
          <Avatar className="h-8 w-8">
            <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
            <AvatarFallback>{activity.user.initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">
              <span className="font-semibold">{activity.user.name}</span>{" "}
              <span className="text-muted-foreground">{activity.action}</span>
              {activity.target && <span className="font-medium"> {activity.target}</span>}
            </p>
            <p className="text-xs text-muted-foreground">{activity.date}</p>
          </div>
          <ActivityBadge type={activity.type} />
        </div>
      ))}
    </div>
  )
}

function ActivityBadge({ type }: { type: ActivityItem["type"] }) {
  switch (type) {
    case "create":
      return (
        <Badge
          variant="outline"
          className="border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-950 dark:text-green-400"
        >
          New
        </Badge>
      )
    case "update":
      return (
        <Badge
          variant="outline"
          className="border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-400"
        >
          Update
        </Badge>
      )
    case "delete":
      return (
        <Badge
          variant="outline"
          className="border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-400"
        >
          Delete
        </Badge>
      )
    case "login":
      return (
        <Badge
          variant="outline"
          className="border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-900 dark:bg-purple-950 dark:text-purple-400"
        >
          Login
        </Badge>
      )
    default:
      return null
  }
}

