import { Button } from "@/components/ui/button";
import { Plus, Trash2, Edit2, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import {
  useNotices,
  useCreateNotice,
  useDeleteNotice,
  useUpdateNotice,
} from "@/lib/hooks";
import { TableSkeleton, EmptyState } from "@/components/shared/LoadingStates";

export default function NoticesPage() {
  const { data: notices = [], isLoading } = useNotices();
  const { mutate: createNotice } = useCreateNotice();
  const { mutate: deleteNotice } = useDeleteNotice();
  const { mutate: updateNotice } = useUpdateNotice();

  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { toast } = useToast();
  const { register, handleSubmit, reset } = useForm<any>();

  const filteredNotices = notices.filter((notice: any) =>
    notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    notice.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onSubmit = (data: any) => {
    const currentUser = "Admin";

    if (editingId) {
      updateNotice(
        { id: editingId, data },
        {
          onSuccess: () => {
            toast({ title: "Notice Updated" });
            setDialogOpen(false);
            setEditingId(null);
            reset();
          },
        }
      );
    } else {
      createNotice(
        { ...data, author: currentUser },
        {
          onSuccess: () => {
            toast({ title: "Notice Posted Successfully" });
            setDialogOpen(false);
            reset();
          },
        }
      );
    }
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this notice?")) return;
    deleteNotice(id, {
      onSuccess: () => toast({ title: "Notice Deleted" }),
    });
  };

  const handleEdit = (notice: any) => {
    setEditingId(notice._id);
    reset({
      title: notice.title,
      content: notice.content,
      priority: notice.priority,
      audience: notice.audience,
    });
    setDialogOpen(true);
  };

  if (isLoading) {
    return <TableSkeleton rows={5} columns={1} />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between gap-4 lg:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notices</h1>
          <p className="text-muted-foreground mt-1">
            School announcements and updates
          </p>
        </div>

        <div className="flex gap-3 items-center">
          <Input
            placeholder="Search notices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-[220px]"
          />

          <Dialog
            open={dialogOpen}
            onOpenChange={(open) => {
              setDialogOpen(open);
              if (!open) {
                setEditingId(null);
                reset();
              }
            }}
          >
            <DialogTrigger asChild>
              <Button onClick={() => setEditingId(null)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Notice
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[520px]">
              <DialogHeader>
                <DialogTitle>
                  {editingId ? "Edit Notice" : "Create Notice"}
                </DialogTitle>
              </DialogHeader>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-5 pt-4"
              >
                <div>
                  <Label>Title</Label>
                  <Input {...register("title", { required: true })} />
                </div>

                <div>
                  <Label>Content</Label>
                  <Textarea
                    rows={4}
                    {...register("content", { required: true })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Priority</Label>
                    <select
                      {...register("priority")}
                      className="h-10 w-full rounded-md border px-3 text-sm"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <div>
                    <Label>Audience</Label>
                    <select
                      {...register("audience")}
                      className="h-10 w-full rounded-md border px-3 text-sm"
                    >
                      <option value="all">Everyone</option>
                      <option value="teachers">Teachers</option>
                      <option value="students">Students</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingId ? "Update" : "Publish"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Notices Cards */}
      {filteredNotices.length === 0 ? (
        <EmptyState
          icon={<Plus className="h-12 w-12 opacity-20" />}
          title="No Notices Yet"
          description="Create your first announcement."
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredNotices.map((notice: any) => (
            <div
              key={notice._id}
              className="rounded-xl border bg-card p-5 shadow-sm hover:shadow-md transition"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-lg">{notice.title}</h3>

                <Badge
                  variant={
                    notice.priority === "high"
                      ? "destructive"
                      : notice.priority === "medium"
                      ? "default"
                      : "secondary"
                  }
                  className="capitalize"
                >
                  {notice.priority}
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground mb-4 line-clamp-4">
                {notice.content}
              </p>

              <div className="text-xs text-muted-foreground flex items-center gap-2 mb-4">
                <Clock className="h-3 w-3" />
                {new Date(notice.date).toLocaleString()}
              </div>

              <div className="flex justify-between items-center">
                <Badge variant="outline" className="capitalize">
                  {notice.audience}
                </Badge>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEdit(notice)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(notice._id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
