import DashboardHeader from "@/components/dashboard/DashboardHeader"
import CourseCard from "@/components/dashboard/CourseCard"
import AnalyticsChart from "@/components/dashboard/AnalyticsChart"
import ProfileCard from "@/components/dashboard/ProfileCard"
import CalendarTimeline from "@/components/dashboard/CalendarTimeline"
import { courses } from "@/lib/constants"
import { getEvents } from "@/app/actions/events"

export default async function DashboardPage() {
  const initialEvents = await getEvents()

  return (
    <div className="flex flex-col gap-6 p-4 lg:flex-row lg:p-6">
      {/* Main Content Area */}
      <div className="flex flex-1 flex-col gap-6">
        <DashboardHeader />

        {/* Course Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              title={course.title}
              classes={course.classes}
              color={course.color}
              icon={course.icon}
              students={course.students}
            />
          ))}
        </div>

        {/* Bottom Section: Chart + Notes */}
        <div className="grid flex-1 grid-cols-1 gap-4 lg:grid-cols-2">
          <AnalyticsChart />

          {/* Notes / Add Text Area */}
          <div className="glass-green flex h-full flex-col justify-between rounded-2xl p-5">
            <h3 className="text-lg font-medium text-foreground">Add Text</h3>
            <div className="mt-4 flex-1">
              <textarea
                placeholder="Start typing your notes..."
                className="h-full w-full resize-none border-none bg-transparent text-sm text-muted-foreground outline-none placeholder:text-muted-foreground/50"
                aria-label="Notes input"
              />
            </div>
            <p className="mt-4 text-sm font-semibold text-green-4">
              MYTHICAL YASH
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex w-full flex-col gap-6 lg:w-72 xl:w-80">
        <ProfileCard />
        <CalendarTimeline initialEvents={initialEvents} />
      </div>
    </div>
  )
}
