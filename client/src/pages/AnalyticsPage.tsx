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
  PieChart,
  Pie,
  Cell
} from "recharts";
import { useStore } from "@/lib/store";
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
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function AnalyticsPage() {
  const { teachers, students, classes } = useStore();
  const [insightType, setInsightType] = useState<"teacher" | "student" | null>(null);
  
  // Teacher Filters
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>("");
  
  // Student Filters
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");

  const selectedTeacher = teachers.find(t => t.id === selectedTeacherId);
  const selectedStudent = students.find(s => s.id === selectedStudentId);

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
                  {teachers.map(t => (
                    <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
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
              { label: "Classes Taken", value: selectedTeacher.classes.length * 4, color: "text-primary", icon: BookOpen },
              { label: "Quizzes", value: selectedTeacher.totalQuizzes || 0, color: "text-amber-500", icon: ClipboardList },
              { label: "Leaves", value: "1", color: "text-rose-500", icon: AlertTriangle },
              { label: "Rank", value: "#4", color: "text-purple-500", icon: TrendingUp },
              { label: "Avg Score", value: "84%", color: "text-blue-500", icon: GraduationCap },
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
                <CardTitle className="text-lg">Attendance Trend</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[
                    { name: 'W1', value: 100 },
                    { name: 'W2', value: 95 },
                    { name: 'W3', value: 100 },
                    { name: 'W4', value: 98 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                    <XAxis dataKey="name" fontSize={12} axisLine={false} tickLine={false} />
                    <YAxis fontSize={12} axisLine={false} tickLine={false} domain={[80, 100]} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none' }} />
                    <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">Class Performance Comparison</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={classes.filter(c => c.teacherId === selectedTeacher.id).map(c => ({ name: c.name, score: 75 + Math.random() * 20 }))}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                    <XAxis dataKey="name" fontSize={12} axisLine={false} tickLine={false} />
                    <YAxis fontSize={12} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none' }} />
                    <Bar dataKey="score" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {selectedTeacher.totalQuizzes === 0 && (
            <Card className="border-amber-500/20 bg-amber-500/5">
              <CardContent className="p-4 flex items-center gap-3 text-amber-600">
                <AlertTriangle className="h-5 w-5" />
                <p className="text-sm font-medium">Warning: No quizzes created in the selected period.</p>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );

  const renderStudentInsights = () => {
    const classStudents = students.filter(s => s.classId === selectedClassId);
    
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
                    {classes.map(c => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
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
                    {classStudents.map(s => (
                      <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
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
                      <div className="text-3xl font-bold font-display text-primary">82.5%</div>
                    </CardContent>
                  </Card>
                  <Card className="glass-card">
                    <CardContent className="p-6 text-center">
                      <div className="text-sm font-semibold text-muted-foreground uppercase tracking-tighter mb-1">Class Attendance</div>
                      <div className="text-3xl font-bold font-display text-emerald-500">94.2%</div>
                    </CardContent>
                  </Card>
                  <Card className="glass-card">
                    <CardContent className="p-6 text-center">
                      <div className="text-sm font-semibold text-muted-foreground uppercase tracking-tighter mb-1">Top Performers</div>
                      <div className="text-sm font-bold mt-1">
                        {classStudents.sort((a,b) => b.averageScore - a.averageScore).slice(0, 3).map(s => s.name).join(", ")}
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="glass-card">
                    <CardContent className="p-6 text-center">
                      <div className="text-sm font-semibold text-muted-foreground uppercase tracking-tighter mb-1">Participation Rate</div>
                      <div className="text-3xl font-bold font-display text-purple-500">88%</div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>Subject-wise Class Performance</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[
                        { name: 'Math', score: 82 },
                        { name: 'Science', score: 78 },
                        { name: 'English', score: 88 },
                        { name: 'History', score: 72 },
                        { name: 'Arts', score: 94 },
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} />
                        <Tooltip />
                        <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                           {[0,1,2,3,4].map((i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            ) : (
              // CASE 2: Individual Student View
              <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Attendance", value: `${selectedStudent.attendance}%`, color: "text-emerald-500" },
                    { label: "Avg Score", value: `${selectedStudent.averageScore}%`, color: "text-primary" },
                    { label: "Highest Score", value: "98%", color: "text-emerald-600" },
                    { label: "Quizzes", value: "24", color: "text-amber-500" },
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
                          { name: 'T1', score: selectedStudent.averageScore - 5 },
                          { name: 'T2', score: selectedStudent.averageScore + 2 },
                          { name: 'T3', score: selectedStudent.averageScore },
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
                      <CardTitle className="text-lg">Subject breakdown</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {['Mathematics', 'Physics', 'History'].map((sub, i) => (
                        <div key={sub} className="space-y-2">
                          <div className="flex justify-between text-xs font-semibold uppercase tracking-tighter">
                            <span>{sub}</span>
                            <span>{80 + i * 5}%</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: `${80 + i * 5}%` }} />
                          </div>
                        </div>
                      ))}
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
