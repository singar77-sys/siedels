import { HomeClient } from '@/components/HomeClient';
import { fetchSchedule, getWorkingToday, getTodayShiftsRecord } from '@/lib/schedule';

// Revalidate the home page every 30 minutes so schedule edits in the sheet
// propagate without a redeploy.
export const revalidate = 1800;

export default async function Home() {
  const week = await fetchSchedule();
  const today = getWorkingToday(week);
  const todayShifts = getTodayShiftsRecord(week);
  return (
    <HomeClient
      scheduleToday={today}
      todayShifts={todayShifts}
      scheduleIsCurrent={week.isCurrent}
    />
  );
}
