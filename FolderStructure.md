# Asset-Manager Folder Structure

Below is the detailed structure of the `Asset-Manager` workspace folder.

```
Asset-Manager/
├── components.json
├── drizzle.config.ts
├── package.json
├── postcss.config.js
├── tsconfig.json
├── vite-plugin-meta-images.ts
├── vite.config.ts
├── backend/
│   ├── build.ts
│   ├── drizzle.config.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── index.ts
│       ├── routes.ts
│       ├── static.ts
│       ├── storage.ts
│       ├── vite.ts
│       ├── config/
│       │   └── db.ts
│       ├── controllers/
│       │   ├── analyticsController.ts
│       │   ├── attendanceController.ts
│       │   ├── authController.ts
│       │   ├── classController.ts
│       │   ├── marksController.ts
│       │   ├── noticeController.ts
│       │   ├── studentController.ts
│       │   ├── subjectController.ts
│       │   ├── teacherController.ts
│       │   └── timetableController.ts
│       ├── models/
│       │   ├── Attendance.ts
│       │   ├── Class.ts
│       │   ├── Marks.ts
│       │   ├── Notice.ts
│       │   ├── Student.ts
│       │   ├── Subject.ts
│       │   ├── Teacher.ts
│       │   └── Timetable.ts
│       ├── shared/
│       │   └── schema.ts
│       └── utils/
│           ├── response.ts
│           └── validators.ts
├── frontend/
│   ├── components.json
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tsconfig.json
│   ├── vite-plugin-meta-images.ts
│   ├── vite.config.ts
│   ├── public/
│   └── src/
│       ├── App.tsx
│       ├── index.css
│       ├── main.tsx
│       ├── components/
│       │   ├── dashboard/
│       │   │   ├── GenericTable.tsx
│       │   │   └── StatsCard.tsx
│       │   ├── shared/
│       │   │   └── LoadingStates.tsx
│       │   └── ui/
│       │       ├── accordion.tsx
│       │       ├── alert-dialog.tsx
│       │       ├── alert.tsx
│       │       ├── aspect-ratio.tsx
│       │       ├── avatar.tsx
│       │       ├── badge.tsx
│       │       ├── breadcrumb.tsx
│       │       ├── button-group.tsx
│       │       ├── button.tsx
│       │       ├── calendar.tsx
│       │       ├── card.tsx
│       │       ├── carousel.tsx
│       │       ├── chart.tsx
│       │       ├── checkbox.tsx
│       │       ├── collapsible.tsx
│       │       ├── command.tsx
│       │       ├── context-menu.tsx
│       │       ├── dialog.tsx
│       │       ├── drawer.tsx
│       │       ├── dropdown-menu.tsx
│       │       ├── empty.tsx
│       │       ├── field.tsx
│       │       ├── form.tsx
│       │       ├── hover-card.tsx
│       │       ├── input-group.tsx
│       │       ├── input-otp.tsx
│       │       ├── input.tsx
│       │       ├── item.tsx
│       │       ├── kbd.tsx
│       │       ├── label.tsx
│       │       ├── menubar.tsx
│       │       ├── navigation-menu.tsx
│       │       ├── pagination.tsx
│       │       ├── popover.tsx
│       │       ├── progress.tsx
│       │       ├── ...
│       ├── hooks/
│       │   ├── use-mobile.tsx
│       │   └── use-toast.ts
│       ├── layouts/
│       │   └── DashboardLayout.tsx
│       ├── lib/
│       │   ├── api.ts
│       │   ├── hooks.ts
│       │   ├── queryClient.ts
│       │   ├── store.ts
│       │   └── utils.ts
│       ├── pages/
│       │   ├── AnalyticsPage.tsx
│       │   ├── ApiExample.tsx
│       │   ├── ClassesPage.tsx
│       │   ├── Dashboard.tsx
│       │   ├── LoginPage.tsx
│       │   ├── not-found.tsx
│       │   ├── NoticesPage.tsx
│       │   ├── StudentsPage.tsx
│       │   ├── SubjectsPage.tsx
│       │   ├── TeachersPage.tsx
│       │   └── TimetablePage.tsx
│       └── shared/
│           └── schema.ts
```
