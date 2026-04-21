import { HomeClient } from '@/components/HomeClient';
import {
  fetchSchedule,
  getWorkingToday,
  getTodayShiftsRecord,
} from '@/lib/schedule';

// Revalidate every 30 minutes so IN TODAY badges pick up sheet edits
// without a redeploy.
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
