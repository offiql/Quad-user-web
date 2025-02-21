import { Bell } from 'lucide-react'

const notifications = [
  {
    title: "Diabetes report has been uploaded",
    time: "12:20:00 PM",
    date: "16 Oct 2024",
  },
  {
    title: "Diabetes report has been uploaded",
    time: "12:20:00 PM",
    date: "16 Oct 2024",
  },
  {
    title: "Vaccination II",
    time: "12:20:00 PM",
    date: "16 Oct 2024",
  },
]

export default function Notifications() {
  return (
    <div className="py-6">
      <h3 className="mb-4 text-lg text-[#59748A] font-semibold">Notifications</h3>
      <div className="space-y-4">
        {notifications.map((notification, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="rounded-full bg-purple-100 p-2">
              <Bell className="h-4 w-4 text-purple-600" />
            </div>
            <div>
              <p className="font-medium ">{notification.title}</p>
              <div className="flex gap-2 text-sm text-muted-foreground">
                <span>{notification.time}</span>
                <span>{notification.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

