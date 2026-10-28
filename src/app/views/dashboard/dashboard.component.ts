import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ChartData, ChartOptions } from 'chart.js';
import { ChartjsComponent } from '@coreui/angular-chartjs';
import { APIServiceService } from '../../../cores/services/apiservice.service';

/* ---------- Inline icons (24x24 stroke paths, no icon library needed) ---------- */
const ICONS = {
  book: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z',
  clock: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z M12 6v6l4 2',
  task: 'M9 11l3 3L22 4 M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11',
  star: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  checkCircle: 'M22 11.08V12a10 10 0 1 1-5.93-9.14 M22 4L12 14.01l-3-3',
  award: 'M12 1a7 7 0 1 0 0 14 7 7 0 0 0 0-14z M8.21 13.89L7 23l5-3 5 3-1.21-9.12',
  play: 'M5 3l14 9-14 9V3z'
};

/* ---------- Types ---------- */
type Period = 'Day' | 'Week' | 'Month';
type CourseFilter = 'all' | 'progress' | 'done';
type Tone = 'indigo' | 'teal' | 'amber' | 'rose';
type DueKind = 'quiz' | 'assignment' | 'live';

interface Course {
  id: number;
  title: string;
  initials: string;
  instructor: string;
  lessonsDone: number;
  lessonsTotal: number;
  progress: number;
  color: string;
}

interface Deadline {
  day: string;
  month: string;
  title: string;
  course: string;
  time: string;
  kind: DueKind;
  kindLabel: string;
}

interface Learner {
  name: string;
  initials: string;
  points: number;
  color: string;
  you?: boolean;
}

interface Achievement {
  title: string;
  description: string;
  icon: string;
  tone: Tone;
  unlocked: boolean;
}

interface Kpi {
  label: string;
  value: string;
  note: string;
  icon: string;
  tone: Tone;
}

@Component({
  selector: 'app-learning-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [ChartjsComponent]
})
export class DashboardComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly apiService = inject(APIServiceService);

  readonly icons = { play: ICONS.play };

  /* ---------- Header ---------- */
  // TODO: replace with the signed-in user from your auth service
  readonly studentName = 'Student';
  readonly streakDays = 7;
  readonly dueThisWeek = 4;

  readonly today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  get greeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }

  /* ---------- Continue learning ---------- */
  // TODO: load from your API (last accessed course)
  readonly current = {
    id: 3,
    title: 'Data Structures with TypeScript',
    lessonNo: 14,
    lesson: 'Binary search trees',
    progress: 68,
    done: 12,
    total: 18,
    minutesLeft: 95,
    upNext: [
      { title: 'Binary search trees', minutes: 18, now: true },
      { title: 'Tree traversal patterns', minutes: 14, now: false },
      { title: 'Balancing with AVL rotations', minutes: 22, now: false }
    ]
  };

  resumeCourse(): void {
    // TODO: this.router.navigate(['/courses', this.current.id]);
  }

  /* ---------- Weekly goal ---------- */
  private readonly studiedMinutes = signal(320);
  private readonly goalMinutes = 480;

  readonly goalPercent = computed(() =>
    Math.min(100, Math.round((this.studiedMinutes() / this.goalMinutes) * 100))
  );

  readonly studiedLabel = computed(() => this.formatMinutes(this.studiedMinutes()));
  readonly goalLabel = this.formatMinutes(this.goalMinutes);

  readonly weekDays = this.buildWeek([true, true, false, false, false, false, false]);

  /* ---------- KPI cards ---------- */
  readonly kpis: Kpi[] = [
    { label: 'Enrolled courses', value: '6', note: '2 added this month', icon: ICONS.book, tone: 'indigo' },
    { label: 'Hours learned', value: '48.5', note: '6 hours more than last month', icon: ICONS.clock, tone: 'teal' },
    { label: 'Assignments due', value: '4', note: 'Next one is due today', icon: ICONS.task, tone: 'amber' },
    { label: 'Average score', value: '87%', note: 'Up 3 points this month', icon: ICONS.star, tone: 'rose' }
  ];

  /* ---------- Questions chart (from API) ---------- */
  readonly periods: Period[] = ['Day', 'Week', 'Month'];
  readonly period = signal<Period>('Week');
  readonly loading = signal(false);

  readonly mainChart: {
    type: 'line';
    data: ChartData<'line'>;
    options: ChartOptions<'line'>;
  } = {
    type: 'line',
    data: { labels: [], datasets: [] },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#1e1b4b',
          padding: 10,
          cornerRadius: 8,
          displayColors: false
        }
      },
      scales: {
        x: {
          grid: { display: false },
          border: { display: false },
          ticks: { color: '#6b7280' }
        },
        y: {
          beginAtZero: true,
          grid: { color: '#eef0f6' },
          border: { display: false },
          ticks: { color: '#6b7280', precision: 0 }
        }
      }
    }
  };

  setTrafficPeriod(value: Period): void {
    this.period.set(value);
    this.loadChartData(value);
  }

  private loadChartData(period: Period): void {
    this.loading.set(true);

    this.apiService
      .getQuestionChart(period)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: { label: string; count: number }[]) => {
          this.applyQuestionData(res.map((r) => r.label), res.map((r) => r.count));
          this.loading.set(false);
        },
        error: () => {
          // Fall back to sample data so the dashboard never looks broken
          const sample = this.sampleQuestions(period);
          this.applyQuestionData(sample.labels, sample.counts);
          this.loading.set(false);
        }
      });
  }

  private applyQuestionData(labels: string[], counts: number[]): void {
    this.mainChart.data = {
      labels,
      datasets: [
        {
          label: 'Questions',
          data: counts,
          borderColor: '#6366f1',
          backgroundColor: 'rgba(99, 102, 241, 0.12)',
          borderWidth: 2.5,
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: '#6366f1',
          pointHoverBorderColor: '#fff',
          pointHoverBorderWidth: 2
        }
      ]
    };
  }

  private sampleQuestions(period: Period): { labels: string[]; counts: number[] } {
    switch (period) {
      case 'Day':
        return {
          labels: ['6am', '9am', '12pm', '3pm', '6pm', '9pm'],
          counts: [2, 9, 14, 11, 18, 7]
        };
      case 'Month':
        return {
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
          counts: [64, 82, 71, 96]
        };
      default:
        return {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          counts: [12, 19, 15, 24, 21, 9, 6]
        };
    }
  }

  /* ---------- Study time by subject ---------- */
  readonly subjects = [
    { name: 'Programming', hours: 18, color: '#6366f1' },
    { name: 'Mathematics', hours: 11, color: '#14b8a6' },
    { name: 'English', hours: 7, color: '#f59e0b' },
    { name: 'Science', hours: 5, color: '#fb7185' }
  ];

  readonly subjectChart: { data: ChartData<'doughnut'>; options: ChartOptions<'doughnut'> } = {
    data: {
      labels: this.subjects.map((s) => s.name),
      datasets: [
        {
          data: this.subjects.map((s) => s.hours),
          backgroundColor: this.subjects.map((s) => s.color),
          borderWidth: 3,
          borderColor: '#ffffff',
          hoverOffset: 4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '72%',
      plugins: {
        legend: { display: false },
        tooltip: { backgroundColor: '#1e1b4b', cornerRadius: 8 }
      }
    }
  };

  /* ---------- Courses ---------- */
  // TODO: replace with your courses API
  readonly courses: Course[] = [
    { id: 3, title: 'Data Structures with TypeScript', initials: 'DS', instructor: 'Dr. Hana Bekele', lessonsDone: 12, lessonsTotal: 18, progress: 68, color: '#6366f1' },
    { id: 4, title: 'Calculus for Engineers', initials: 'CE', instructor: 'Prof. Daniel Tesfaye', lessonsDone: 9, lessonsTotal: 24, progress: 38, color: '#14b8a6' },
    { id: 5, title: 'Academic Writing in English', initials: 'AW', instructor: 'Ms. Selam Girma', lessonsDone: 14, lessonsTotal: 16, progress: 88, color: '#f59e0b' },
    { id: 6, title: 'Introduction to Databases', initials: 'DB', instructor: 'Mr. Yonas Alemu', lessonsDone: 20, lessonsTotal: 20, progress: 100, color: '#fb7185' }
  ];

  readonly courseFilters: { label: string; value: CourseFilter }[] = [
    { label: 'All', value: 'all' },
    { label: 'In progress', value: 'progress' },
    { label: 'Completed', value: 'done' }
  ];

  readonly courseFilter = signal<CourseFilter>('all');

  readonly filteredCourses = computed(() => {
    const filter = this.courseFilter();
    if (filter === 'progress') return this.courses.filter((c) => c.progress < 100);
    if (filter === 'done') return this.courses.filter((c) => c.progress === 100);
    return this.courses;
  });

  /* ---------- Upcoming ---------- */
  readonly deadlines: Deadline[] = [
    { day: '27', month: 'Oct', title: 'Trees and graphs quiz', course: 'Data Structures', time: '6:00 PM', kind: 'quiz', kindLabel: 'Quiz' },
    { day: '29', month: 'Oct', title: 'Essay draft submission', course: 'Academic Writing', time: '11:59 PM', kind: 'assignment', kindLabel: 'Assignment' },
    { day: '30', month: 'Oct', title: 'Live class: Integrals', course: 'Calculus', time: '4:00 PM', kind: 'live', kindLabel: 'Live' },
    { day: '02', month: 'Nov', title: 'Schema design project', course: 'Databases', time: '9:00 AM', kind: 'assignment', kindLabel: 'Assignment' }
  ];

  /* ---------- Leaderboard ---------- */
  readonly leaderboard: Learner[] = [
    { name: 'Meron Haile', initials: 'MH', points: 1280, color: '#6366f1' },
    { name: 'Abel Tadesse', initials: 'AT', points: 1215, color: '#14b8a6' },
    { name: 'You', initials: 'YO', points: 1140, color: '#f59e0b', you: true },
    { name: 'Liya Mulugeta', initials: 'LM', points: 1065, color: '#fb7185' },
    { name: 'Samuel Kassa', initials: 'SK', points: 990, color: '#8b5cf6' }
  ];

  /* ---------- Achievements ---------- */
  readonly achievements: Achievement[] = [
    { title: 'Week warrior', description: 'Studied 7 days in a row', icon: ICONS.star, tone: 'amber', unlocked: true },
    { title: 'First course done', description: 'Finished Introduction to Databases', icon: ICONS.checkCircle, tone: 'teal', unlocked: true },
    { title: 'Quiz ace', description: 'Score 90% or more on 5 quizzes', icon: ICONS.award, tone: 'indigo', unlocked: false },
    { title: 'Deep focus', description: 'Study for 10 hours in one week', icon: ICONS.clock, tone: 'rose', unlocked: false }
  ];

  get unlockedCount(): number {
    return this.achievements.filter((a) => a.unlocked).length;
  }

  /* ---------- Lifecycle ---------- */
  ngOnInit(): void {
    this.loadChartData(this.period());
  }

  /* ---------- Helpers ---------- */
  private formatMinutes(total: number): string {
    const h = Math.floor(total / 60);
    const m = total % 60;
    return m ? `${h}h ${m}m` : `${h}h`;
  }

  private buildWeek(done: boolean[]): { label: string; done: boolean; today: boolean }[] {
    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const todayIndex = (new Date().getDay() + 6) % 7;
    return labels.map((label, i) => ({ label, done: done[i], today: i === todayIndex }));
  }
}