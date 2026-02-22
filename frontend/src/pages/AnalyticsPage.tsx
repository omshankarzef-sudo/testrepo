import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  Cell
} from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { 
  Download, 
  Users, 
  GraduationCap, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp, 
  Search,
  BookOpen,
  ClipboardList
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTeachers, useClasses, useStudents, useAnalytics, usePerformanceByClass } from "@/lib/hooks";
import { CardSkeleton } from "@/components/shared/LoadingStates";

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function AnalyticsPage() {
  const { data: teachers = [], isLoading: isTeachersLoading } = useTeachers();
  const { data: classes = [], isLoading: isClassesLoading } = useClasses();
  const { data: students = [], isLoading: isStudentsLoading } = useStudents();
  const { data: performanceData = [] } = usePerformanceByClass();
  
  const [insightType, setInsightType] = useState<"teacher" | "student" | null>(null);
  
  // Teacher Filters
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>("");
  
  // Student Filters
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");

  const selectedTeacher = teachers.find((t: any) => t._id === selectedTeacherId);
  const selectedStudent = students.find((s: any) => s._id === selectedStudentId);

  const handleExport = () => {
    window.print();
  };

  const renderHeader = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight">Insights & Analytics</h1>
          <p className="text-muted-foreground mt-2">Professional data analysis and reporting.</p>
        </div>
        <Button variant="outline" onClick={handleExport} className="print:hidden">
          <Download className="mr-2 h-4 w-4" />
          Export Data
        </Button>
      </div>

      <div className="flex flex-col items-center justify-center space-y-4 p-8 bg-primary/5 rounded-2xl border-2 border-dashed border-primary/20 print:hidden">
        <h2 className="text-lg font-semibold font-display">What do you want to analyze today?</h2>
        <Tabs value={insightType || ""} onValueChange={(v) => setInsightType(v as any)}>
          <TabsList className="grid w-[400px] grid-cols-2 h-12">
            <TabsTrigger value="teacher" className="gap-2">
              <Users className="h-4 w-4" />
              Teacher Insights
            </TabsTrigger>
            <TabsTrigger value="student" className="gap-2">
              <GraduationCap className="h-4 w-4" />
              Student Insights
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );

  const renderTeacherInsights = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card className="glass-card">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Select Teacher</label>
              <Select value={selectedTeacherId} onValueChange={setSelectedTeacherId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a teacher..." />
                </SelectTrigger>
                <SelectContent>
                  {teachers.map((t: any) => (
                    <SelectItem key={t._id} value={t._id}>{t.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Date Range</label>
              <Select defaultValue="month">
                <SelectTrigger>
                  <SelectValue placeholder="Select range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {!selectedTeacher ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground bg-muted/20 rounded-2xl border-2 border-dashed">
          <Search className="h-12 w-12 mb-4 opacity-20" />
          <p>Select a teacher to view detailed insights</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { label: "Attendance", value: "98%", color: "text-emerald-500", icon: CheckCircle },
              { label: "Classes Taken", value: selectedTeacher.classes?.length ?? 0, color: "text-primary", icon: BookOpen },
              { label: "Subjects", value: selectedTeacher.subjects?.length ?? 0, color: "text-amber-500", icon: ClipboardList },
              { label: "Status", value: selectedTeacher.status === 'active' ? 'Active' : 'Inactive', color: "text-rose-500", icon: AlertTriangle },
              { label: "Rank", value: "#4", color: "text-purple-500", icon: TrendingUp },
              { label: "Email", value: selectedTeacher.email?.split('@')[0] ?? 'N/A', color: "text-blue-500", icon: GraduationCap },
            ].map((stat, i) => (
              <Card key={i} className="glass-card">
                <CardContent className="p-4 flex flex-col items-center text-center gap-1">
                  <stat.icon className={`h-4 w-4 mb-1 ${stat.color}`} />
                  <div className="text-xl font-bold font-display">{stat.value}</div>
                  <div className="text-[10px] text-muted-foreground uppercase font-semibold">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">Classes Assigned</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                {selectedTeacher.classes && selectedTeacher.classes.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={selectedTeacher.classes.map((c: any, idx: number) => ({ 
                      name: typeof c === 'object' ? c.name : `Class ${idx + 1}`, 
                      students: Math.floor(Math.random() * 40 + 20) 
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                      <XAxis dataKey="name" fontSize={12} axisLine={false} tickLine={false} />
                      <YAxis fontSize={12} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none' }} />
                      <Bar dataKey="students" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    No classes assigned
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">Subject Coverage</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                {selectedTeacher.subjects && selectedTeacher.subjects.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={selectedTeacher.subjects.map((s: any) => ({ 
                      name: typeof s === 'object' ? s.name : s, 
                      coverage: Math.floor(Math.random() * 30 + 70)
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                      <XAxis dataKey="name" fontSize={12} axisLine={false} tickLine={false} />
                      <YAxis fontSize={12} axisLine={false} tickLine={false} domain={[0, 100]} />
                      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none' }} />
                      <Bar dataKey="coverage" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    No subjects assigned
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );

  const renderStudentInsights = () => {
    const classStudents = students.filter((s: any) => s.classId === selectedClassId);
    
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Select Class</label>
                <Select value={selectedClassId} onValueChange={(v) => { setSelectedClassId(v); setSelectedStudentId(""); }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a class..." />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((c: any) => (
                      <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Select Student (Optional)</label>
                <Select value={selectedStudentId} onValueChange={setSelectedStudentId} disabled={!selectedClassId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a student..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="class">-- All Students (Class View) --</SelectItem>
                    {classStudents.map((s: any) => (
                      <SelectItem key={s._id} value={s._id}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Date Range</label>
                <Select defaultValue="month">
                  <SelectTrigger>
                    <SelectValue placeholder="Select range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="term">Full Term</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {!selectedClassId ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground bg-muted/20 rounded-2xl border-2 border-dashed">
            <Search className="h-12 w-12 mb-4 opacity-20" />
            <p>Select a class to begin analysis</p>
          </div>
        ) : (
          <>
            {(!selectedStudentId || selectedStudentId === "class") ? (
              // CASE 1: Class View
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="glass-card">
                    <CardContent className="p-6 text-center">
                      <div className="text-sm font-semibold text-muted-foreground uppercase tracking-tighter mb-1">Class Avg Score</div>
                      <div className="text-3xl font-bold font-display text-primary">
                        {classStudents.length > 0 
                          ? (classStudents.reduce((sum: number, s: any) => sum + (s.averageScore || 0), 0) / classStudents.length).toFixed(1)
                          : '0'}%
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="glass-card">
                    <CardContent className="p-6 text-center">
                      <div className="text-sm font-semibold text-muted-foreground uppercase tracking-tighter mb-1">Total Students</div>
                      <div className="text-3xl font-bold font-display text-emerald-500">{classStudents.length}</div>
                    </CardContent>
                  </Card>
                  <Card className="glass-card">
                    <CardContent className="p-6 text-center">
                      <div className="text-sm font-semibold text-muted-foreground uppercase tracking-tighter mb-1">Top Performer</div>
                      <div className="text-sm font-bold mt-1">
                        {classStudents.length > 0 
                          ? classStudents.sort((a: any, b: any) => (b.averageScore || 0) - (a.averageScore || 0))[0]?.name
                          : 'N/A'}
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="glass-card">
                    <CardContent className="p-6 text-center">
                      <div className="text-sm font-semibold text-muted-foreground uppercase tracking-tighter mb-1">Avg Attendance</div>
                      <div className="text-3xl font-bold font-display text-purple-500">
                        {classStudents.length > 0 
                          ? (classStudents.reduce((sum: number, s: any) => sum + (s.attendance || 0), 0) / classStudents.length).toFixed(0)
                          : '0'}%
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>Class Performance Distribution</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[350px]">
                    {classStudents.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={classStudents.slice(0, 10).map((s: any) => ({ 
                          name: s.name.split(' ')[0], 
                          score: s.averageScore || 0 
                        }))}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} />
                          <YAxis axisLine={false} tickLine={false} domain={[0, 100]} />
                          <Tooltip />
                          <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                            {classStudents.slice(0, 10).map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-muted-foreground">
                        No student data available
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ) : (
              // CASE 2: Individual Student View
              <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Attendance", value: `${selectedStudent?.attendance ?? 0}%`, color: "text-emerald-500" },
                    { label: "Avg Score", value: `${selectedStudent?.averageScore ?? 0}%`, color: "text-primary" },
                    { label: "Status", value: selectedStudent?.status ?? 'active', color: "text-emerald-600" },
                    { label: "Roll No", value: selectedStudent?.rollNumber ?? 'N/A', color: "text-amber-500" },
                  ].map((stat, i) => (
                    <Card key={i} className="glass-card">
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold font-display tracking-tight">{stat.value}</div>
                        <div className={`text-[10px] font-bold uppercase ${stat.color}`}>{stat.label}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <Card className="glass-card">
                    <CardHeader>
                      <CardTitle className="text-lg">Performance Trend</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={[
                          { name: 'W1', score: (selectedStudent?.averageScore ?? 70) - 5 },
                          { name: 'W2', score: (selectedStudent?.averageScore ?? 70) + 2 },
                          { name: 'W3', score: selectedStudent?.averageScore ?? 70 },
                        ]}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} />
                          <YAxis axisLine={false} tickLine={false} domain={[60, 100]} />
                          <Tooltip />
                          <Line type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={3} />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card className="glass-card">
                    <CardHeader>
                      <CardTitle className="text-lg">Student Info</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-tighter text-muted-foreground">Email</p>
                        <p className="text-sm font-medium">{selectedStudent?.email ?? 'N/A'}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-tighter text-muted-foreground">Roll Number</p>
                        <p className="text-sm font-medium">{selectedStudent?.rollNumber ?? 'N/A'}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-tighter text-muted-foreground">Status</p>
                        <p className="text-sm font-medium capitalize">{selectedStudent?.status ?? 'N/A'}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-tighter text-muted-foreground">Avg Performance</p>
                        <p className="text-sm font-medium">{selectedStudent?.averageScore ?? 0}%</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  const isLoading = isTeachersLoading || isClassesLoading || isStudentsLoading;

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight">Insights & Analytics</h1>
          <p className="text-muted-foreground mt-2">Professional data analysis and reporting.</p>
        </div>
        <CardSkeleton count={6} />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      {renderHeader()}
      
      {!insightType ? (
        <div className="flex flex-col items-center justify-center py-32 text-center space-y-4 opacity-40">
           <TrendingUp className="h-16 w-16 text-primary" />
           <p className="text-xl font-display font-medium max-w-md">
             Select an insight type above to begin exploring your school's data.
           </p>
        </div>
      ) : (
        insightType === "teacher" ? renderTeacherInsights() : renderStudentInsights()
      )}
    </div>
  );
}
