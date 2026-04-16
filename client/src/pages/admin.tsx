import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  LayoutDashboard,
  Calendar,
  FileText,
  DollarSign,
  Users,
  MessageSquare,
  UserCog,
  Image as ImageIcon,
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  AlertCircle,
  Eye,
  Mail,
  ClipboardList,
  Video,
} from "lucide-react";

interface AdminStats {
  totalDonations: number;
  totalEvents: number;
  totalBlogPosts: number;
  totalVolunteers: number;
  totalMessages: number;
  totalUsers: number;
  recentDonationsAmount: string;
}

const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "events", label: "Events", icon: Calendar },
  { key: "blog", label: "Blog Posts", icon: FileText },
  { key: "donations", label: "Donations", icon: DollarSign },
  { key: "volunteers", label: "Volunteers", icon: Users },
  { key: "messages", label: "Messages", icon: MessageSquare },
  { key: "users", label: "Users", icon: UserCog },
  { key: "registrations", label: "Event Registrations", icon: ClipboardList },
  { key: "newsletter", label: "Newsletter", icon: Mail },
  { key: "videos", label: "Videos", icon: Video },
];

function DashboardSection() {
  const { data: stats, isLoading } = useQuery<AdminStats>({
    queryKey: ["/api/admin/stats"],
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const cards = [
    { label: "Total Events", value: stats?.totalEvents ?? 0, icon: Calendar },
    { label: "Blog Posts", value: stats?.totalBlogPosts ?? 0, icon: FileText },
    { label: "Donations", value: stats?.totalDonations ?? 0, icon: DollarSign },
    { label: "Donation Total", value: `$${Number(stats?.recentDonationsAmount ?? 0).toLocaleString()}`, icon: DollarSign },
    { label: "Volunteers", value: stats?.totalVolunteers ?? 0, icon: Users },
    { label: "Messages", value: stats?.totalMessages ?? 0, icon: MessageSquare },
    { label: "Users", value: stats?.totalUsers ?? 0, icon: UserCog },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6" data-testid="heading-dashboard">Dashboard</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => (
          <Card key={card.label}>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{card.label}</CardTitle>
              <card.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid={`stat-${card.label.toLowerCase().replace(/\s/g, "-")}`}>
                {card.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function EventsSection() {
  const { toast } = useToast();
  const { data: events = [], isLoading } = useQuery<any[]>({ queryKey: ["/api/events"] });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [form, setForm] = useState({
    title: "", description: "", date: "", location: "", program: "",
    imageUrl: "", registrationFee: "0", maxAttendees: "", isActive: true,
  });

  const resetForm = () => {
    setForm({ title: "", description: "", date: "", location: "", program: "", imageUrl: "", registrationFee: "0", maxAttendees: "", isActive: true });
    setEditingEvent(null);
  };

  const openCreate = () => { resetForm(); setDialogOpen(true); };
  const openEdit = (ev: any) => {
    setEditingEvent(ev);
    setForm({
      title: ev.title || "",
      description: ev.description || "",
      date: ev.date ? new Date(ev.date).toISOString().slice(0, 16) : "",
      location: ev.location || "",
      program: ev.program || "",
      imageUrl: ev.imageUrl || "",
      registrationFee: ev.registrationFee || "0",
      maxAttendees: ev.maxAttendees?.toString() || "",
      isActive: ev.isActive ?? true,
    });
    setDialogOpen(true);
  };

  const createMutation = useMutation({
    mutationFn: async (data: any) => { await apiRequest("POST", "/api/events", data); },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      toast({ title: "Event created" });
      setDialogOpen(false);
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      await apiRequest("PUT", `/api/admin/events/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      toast({ title: "Event updated" });
      setDialogOpen(false);
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => { await apiRequest("DELETE", `/api/admin/events/${id}`); },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      toast({ title: "Event deleted" });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const handleSubmit = () => {
    const payload = {
      ...form,
      date: form.date ? new Date(form.date).toISOString() : undefined,
      registrationFee: form.registrationFee || "0",
      maxAttendees: form.maxAttendees ? parseInt(form.maxAttendees) : null,
    };
    if (editingEvent) {
      updateMutation.mutate({ id: editingEvent.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      deleteMutation.mutate(id);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        <h2 className="text-2xl font-bold" data-testid="heading-events">Events</h2>
        <Button onClick={openCreate} data-testid="button-create-event"><Plus className="h-4 w-4 mr-2" />Create Event</Button>
      </div>
      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Program</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(events as any[]).map((ev: any) => (
                <TableRow key={ev.id} data-testid={`row-event-${ev.id}`}>
                  <TableCell className="font-medium">{ev.title}</TableCell>
                  <TableCell>{ev.date ? new Date(ev.date).toLocaleDateString() : "-"}</TableCell>
                  <TableCell>{ev.location}</TableCell>
                  <TableCell>{ev.program?.replace(/_/g, " ") || "-"}</TableCell>
                  <TableCell>
                    <Badge variant={ev.isActive ? "default" : "secondary"}>{ev.isActive ? "Active" : "Inactive"}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button size="icon" variant="ghost" onClick={() => openEdit(ev)} data-testid={`button-edit-event-${ev.id}`}><Pencil className="h-4 w-4" /></Button>
                      <Button size="icon" variant="ghost" onClick={() => handleDelete(ev.id)} data-testid={`button-delete-event-${ev.id}`}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {(events as any[]).length === 0 && (
                <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No events found</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      )}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editingEvent ? "Edit Event" : "Create Event"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><label className="text-sm font-medium">Title</label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} data-testid="input-event-title" /></div>
            <div><label className="text-sm font-medium">Description</label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} data-testid="input-event-description" /></div>
            <div><label className="text-sm font-medium">Date</label><Input type="datetime-local" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} data-testid="input-event-date" /></div>
            <div><label className="text-sm font-medium">Location</label><Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} data-testid="input-event-location" /></div>
            <div>
              <label className="text-sm font-medium">Program</label>
              <Select value={form.program} onValueChange={(v) => setForm({ ...form, program: v })}>
                <SelectTrigger data-testid="select-event-program"><SelectValue placeholder="Select program" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="health_advancement">Health Advancement</SelectItem>
                  <SelectItem value="medical_aid_outreach">Medical Aid Outreach</SelectItem>
                  <SelectItem value="healthcare_professional_empowerment">Healthcare Professional Empowerment</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><label className="text-sm font-medium">Image URL</label><Input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} data-testid="input-event-image" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-sm font-medium">Registration Fee</label><Input type="number" step="0.01" value={form.registrationFee} onChange={(e) => setForm({ ...form, registrationFee: e.target.value })} data-testid="input-event-fee" /></div>
              <div><label className="text-sm font-medium">Max Attendees</label><Input type="number" value={form.maxAttendees} onChange={(e) => setForm({ ...form, maxAttendees: e.target.value })} data-testid="input-event-max" /></div>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox checked={form.isActive} onCheckedChange={(v) => setForm({ ...form, isActive: !!v })} id="event-active" data-testid="checkbox-event-active" />
              <label htmlFor="event-active" className="text-sm font-medium">Active</label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={isPending} data-testid="button-submit-event">
              {isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editingEvent ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function BlogSection() {
  const { toast } = useToast();
  const { data: posts = [], isLoading } = useQuery<any[]>({ queryKey: ["/api/blog"] });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [form, setForm] = useState({
    title: "", slug: "", content: "", excerpt: "", category: "",
    imageUrl: "", isPublished: false,
  });

  const resetForm = () => {
    setForm({ title: "", slug: "", content: "", excerpt: "", category: "", imageUrl: "", isPublished: false });
    setEditingPost(null);
  };

  const generateSlug = (title: string) => title.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-");

  const openCreate = () => { resetForm(); setDialogOpen(true); };
  const openEdit = (post: any) => {
    setEditingPost(post);
    setForm({
      title: post.title || "",
      slug: post.slug || "",
      content: post.content || "",
      excerpt: post.excerpt || "",
      category: post.category || "",
      imageUrl: post.imageUrl || "",
      isPublished: post.isPublished ?? false,
    });
    setDialogOpen(true);
  };

  const createMutation = useMutation({
    mutationFn: async (data: any) => { await apiRequest("POST", "/api/blog", data); },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
      toast({ title: "Blog post created" });
      setDialogOpen(false);
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      await apiRequest("PUT", `/api/admin/blog/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
      toast({ title: "Blog post updated" });
      setDialogOpen(false);
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => { await apiRequest("DELETE", `/api/admin/blog/${id}`); },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
      toast({ title: "Blog post deleted" });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const handleSubmit = () => {
    const payload: any = {
      ...form,
      slug: form.slug || generateSlug(form.title),
    };
    if (form.isPublished && !editingPost?.publishedAt) {
      payload.publishedAt = new Date().toISOString();
    }
    if (editingPost) {
      updateMutation.mutate({ id: editingPost.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this blog post?")) {
      deleteMutation.mutate(id);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        <h2 className="text-2xl font-bold" data-testid="heading-blog">Blog Posts</h2>
        <Button onClick={openCreate} data-testid="button-create-blog"><Plus className="h-4 w-4 mr-2" />Create Post</Button>
      </div>
      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Published</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(posts as any[]).map((post: any) => (
                <TableRow key={post.id} data-testid={`row-blog-${post.id}`}>
                  <TableCell className="font-medium">{post.title}</TableCell>
                  <TableCell>{post.category?.replace(/_/g, " ") || "-"}</TableCell>
                  <TableCell><Badge variant={post.isPublished ? "default" : "secondary"}>{post.isPublished ? "Yes" : "No"}</Badge></TableCell>
                  <TableCell>{post.createdAt ? new Date(post.createdAt).toLocaleDateString() : "-"}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button size="icon" variant="ghost" onClick={() => openEdit(post)} data-testid={`button-edit-blog-${post.id}`}><Pencil className="h-4 w-4" /></Button>
                      <Button size="icon" variant="ghost" onClick={() => handleDelete(post.id)} data-testid={`button-delete-blog-${post.id}`}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {(posts as any[]).length === 0 && (
                <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">No blog posts found</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      )}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editingPost ? "Edit Blog Post" : "Create Blog Post"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><label className="text-sm font-medium">Title</label><Input value={form.title} onChange={(e) => { setForm({ ...form, title: e.target.value, slug: editingPost ? form.slug : generateSlug(e.target.value) }); }} data-testid="input-blog-title" /></div>
            <div><label className="text-sm font-medium">Slug</label><Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} data-testid="input-blog-slug" /></div>
            <div><label className="text-sm font-medium">Content</label><Textarea rows={6} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} data-testid="input-blog-content" /></div>
            <div><label className="text-sm font-medium">Excerpt</label><Textarea rows={3} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} data-testid="input-blog-excerpt" /></div>
            <div>
              <label className="text-sm font-medium">Category</label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger data-testid="select-blog-category"><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="program_updates">Program Updates</SelectItem>
                  <SelectItem value="success_stories">Success Stories</SelectItem>
                  <SelectItem value="research">Research</SelectItem>
                  <SelectItem value="events">Events</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><label className="text-sm font-medium">Image URL</label><Input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} data-testid="input-blog-image" /></div>
            <div className="flex items-center gap-2">
              <Checkbox checked={form.isPublished} onCheckedChange={(v) => setForm({ ...form, isPublished: !!v })} id="blog-published" data-testid="checkbox-blog-published" />
              <label htmlFor="blog-published" className="text-sm font-medium">Published</label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={isPending} data-testid="button-submit-blog">
              {isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editingPost ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function DonationsSection() {
  const { data: donations = [], isLoading } = useQuery<any[]>({ queryKey: ["/api/donations"] });

  const statusColor = (status: string) => {
    if (status === "completed") return "default";
    if (status === "pending") return "secondary";
    return "destructive";
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6" data-testid="heading-donations">Donations</h2>
      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Donor Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Program</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Recurring</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(donations as any[]).map((d: any) => (
                <TableRow key={d.id} data-testid={`row-donation-${d.id}`}>
                  <TableCell className="font-medium">{d.donorName}</TableCell>
                  <TableCell>{d.donorEmail}</TableCell>
                  <TableCell>${Number(d.amount).toFixed(2)}</TableCell>
                  <TableCell>{d.program?.replace(/_/g, " ") || "-"}</TableCell>
                  <TableCell><Badge variant={statusColor(d.status)}>{d.status}</Badge></TableCell>
                  <TableCell>{d.isRecurring ? `Yes (${d.recurringFrequency || "-"})` : "No"}</TableCell>
                  <TableCell>{d.createdAt ? new Date(d.createdAt).toLocaleDateString() : "-"}</TableCell>
                </TableRow>
              ))}
              {(donations as any[]).length === 0 && (
                <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">No donations found</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}

function VolunteersSection() {
  const { toast } = useToast();
  const { data: volunteers = [], isLoading } = useQuery<any[]>({ queryKey: ["/api/volunteer-submissions"] });
  const [viewingVolunteer, setViewingVolunteer] = useState<any>(null);

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      await apiRequest("PUT", `/api/admin/volunteer-submissions/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/volunteer-submissions"] });
      toast({ title: "Status updated" });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const statusColor = (status: string): "default" | "secondary" | "outline" => {
    if (status === "confirmed") return "default";
    if (status === "contacted") return "secondary";
    return "outline";
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6" data-testid="heading-volunteers">Volunteer Submissions</h2>
      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(volunteers as any[]).map((v: any) => (
                <TableRow key={v.id} data-testid={`row-volunteer-${v.id}`}>
                  <TableCell className="font-medium">{v.name}</TableCell>
                  <TableCell>{v.email}</TableCell>
                  <TableCell>{v.type?.replace(/_/g, " ") || "-"}</TableCell>
                  <TableCell>
                    <Select value={v.status} onValueChange={(val) => statusMutation.mutate({ id: v.id, status: val })}>
                      <SelectTrigger className="w-32" data-testid={`select-volunteer-status-${v.id}`}>
                        <Badge variant={statusColor(v.status)} className="no-default-active-elevate">{v.status}</Badge>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="contacted">Contacted</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>{v.createdAt ? new Date(v.createdAt).toLocaleDateString() : "-"}</TableCell>
                  <TableCell>
                    <Button size="icon" variant="ghost" onClick={() => setViewingVolunteer(v)} data-testid={`button-view-volunteer-${v.id}`}><Eye className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
              {(volunteers as any[]).length === 0 && (
                <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No volunteer submissions found</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      )}
      <Dialog open={!!viewingVolunteer} onOpenChange={() => setViewingVolunteer(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Volunteer Details</DialogTitle></DialogHeader>
          {viewingVolunteer && (
            <div className="space-y-3 text-sm">
              <div><span className="font-medium">Name:</span> {viewingVolunteer.name}</div>
              <div><span className="font-medium">Email:</span> {viewingVolunteer.email}</div>
              <div><span className="font-medium">Phone:</span> {viewingVolunteer.phone || "-"}</div>
              <div><span className="font-medium">Type:</span> {viewingVolunteer.type?.replace(/_/g, " ")}</div>
              <div><span className="font-medium">Interests:</span> {viewingVolunteer.interests?.join(", ") || "-"}</div>
              <div><span className="font-medium">Availability:</span> {viewingVolunteer.availability || "-"}</div>
              <div><span className="font-medium">Message:</span> {viewingVolunteer.message || "-"}</div>
              <div><span className="font-medium">Donation Amount:</span> {viewingVolunteer.donationAmount ? `$${viewingVolunteer.donationAmount}` : "-"}</div>
              <div><span className="font-medium">Status:</span> <Badge variant={statusColor(viewingVolunteer.status)}>{viewingVolunteer.status}</Badge></div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function MessagesSection() {
  const { toast } = useToast();
  const { data: messages = [], isLoading } = useQuery<any[]>({ queryKey: ["/api/contact-messages"] });
  const [viewingMessage, setViewingMessage] = useState<any>(null);

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      await apiRequest("PUT", `/api/admin/contact-messages/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contact-messages"] });
      toast({ title: "Status updated" });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const statusColor = (status: string): "default" | "secondary" | "outline" => {
    if (status === "responded") return "default";
    if (status === "read") return "secondary";
    return "outline";
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6" data-testid="heading-messages">Contact Messages</h2>
      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(messages as any[]).map((m: any) => (
                <TableRow key={m.id} data-testid={`row-message-${m.id}`}>
                  <TableCell className="font-medium">{m.name}</TableCell>
                  <TableCell>{m.email}</TableCell>
                  <TableCell>{m.subject || "-"}</TableCell>
                  <TableCell>
                    <Select value={m.status} onValueChange={(val) => statusMutation.mutate({ id: m.id, status: val })}>
                      <SelectTrigger className="w-32" data-testid={`select-message-status-${m.id}`}>
                        <Badge variant={statusColor(m.status)} className="no-default-active-elevate">{m.status}</Badge>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="read">Read</SelectItem>
                        <SelectItem value="responded">Responded</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>{m.createdAt ? new Date(m.createdAt).toLocaleDateString() : "-"}</TableCell>
                  <TableCell>
                    <Button size="icon" variant="ghost" onClick={() => setViewingMessage(m)} data-testid={`button-view-message-${m.id}`}><Eye className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
              {(messages as any[]).length === 0 && (
                <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No messages found</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      )}
      <Dialog open={!!viewingMessage} onOpenChange={() => setViewingMessage(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Message Details</DialogTitle></DialogHeader>
          {viewingMessage && (
            <div className="space-y-3 text-sm">
              <div><span className="font-medium">From:</span> {viewingMessage.name} ({viewingMessage.email})</div>
              <div><span className="font-medium">Subject:</span> {viewingMessage.subject || "-"}</div>
              <div><span className="font-medium">Status:</span> <Badge variant={statusColor(viewingMessage.status)}>{viewingMessage.status}</Badge></div>
              <div><span className="font-medium">Date:</span> {viewingMessage.createdAt ? new Date(viewingMessage.createdAt).toLocaleString() : "-"}</div>
              <div className="pt-2 border-t">
                <span className="font-medium">Message:</span>
                <p className="mt-1 whitespace-pre-wrap text-muted-foreground">{viewingMessage.message}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function UsersSection() {
  const { toast } = useToast();
  const { data: users = [], isLoading } = useQuery<any[]>({ queryKey: ["/api/admin/users"] });

  const roleMutation = useMutation({
    mutationFn: async ({ id, role }: { id: string; role: string }) => {
      await apiRequest("PUT", `/api/admin/users/${id}/role`, { role });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({ title: "Role updated" });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const roleColor = (role: string): "default" | "secondary" | "outline" | "destructive" => {
    if (role === "admin") return "destructive";
    if (role === "board_member") return "default";
    if (role === "volunteer") return "secondary";
    return "outline";
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6" data-testid="heading-users">User Management</h2>
      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(users as any[]).map((u: any) => (
                <TableRow key={u.id} data-testid={`row-user-${u.id}`}>
                  <TableCell className="font-medium">{[u.firstName, u.lastName].filter(Boolean).join(" ") || "-"}</TableCell>
                  <TableCell>{u.email || "-"}</TableCell>
                  <TableCell>
                    <Select value={u.role || "user"} onValueChange={(val) => roleMutation.mutate({ id: u.id, role: val })}>
                      <SelectTrigger className="w-36" data-testid={`select-user-role-${u.id}`}>
                        <Badge variant={roleColor(u.role)} className="no-default-active-elevate">{u.role?.replace(/_/g, " ") || "user"}</Badge>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="volunteer">Volunteer</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="board_member">Board Member</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "-"}</TableCell>
                  <TableCell>
                    <Badge variant={roleColor(u.role)}>{u.role?.replace(/_/g, " ") || "user"}</Badge>
                  </TableCell>
                </TableRow>
              ))}
              {(users as any[]).length === 0 && (
                <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">No users found</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}

function EventRegistrationsSection() {
  const { data: registrations = [], isLoading } = useQuery<any[]>({ queryKey: ["/api/admin/event-registrations"] });

  const statusColor = (status: string): "default" | "secondary" | "outline" | "destructive" => {
    if (status === "confirmed") return "default";
    if (status === "pending") return "secondary";
    if (status === "cancelled") return "destructive";
    return "outline";
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6" data-testid="heading-registrations">Event Registrations</h2>
      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Attendees</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(registrations as any[]).map((r: any) => (
                <TableRow key={r.id} data-testid={`row-registration-${r.id}`}>
                  <TableCell className="font-medium">{r.attendeeName}</TableCell>
                  <TableCell>{r.attendeeEmail}</TableCell>
                  <TableCell>{r.numberOfAttendees || 1}</TableCell>
                  <TableCell>{r.totalAmount && r.totalAmount !== "0" ? `$${r.totalAmount}` : "Free"}</TableCell>
                  <TableCell><Badge variant={statusColor(r.status)}>{r.status}</Badge></TableCell>
                  <TableCell>{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "-"}</TableCell>
                </TableRow>
              ))}
              {(registrations as any[]).length === 0 && (
                <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No registrations yet</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}

function NewsletterSection() {
  const { toast } = useToast();
  const { data: subscribers = [], isLoading } = useQuery<any[]>({ queryKey: ["/api/admin/newsletter-subscribers"] });

  const deactivateMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admin/newsletter-subscribers/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/newsletter-subscribers"] });
      toast({ title: "Subscriber deactivated" });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const activeSubscribers = (subscribers as any[]).filter((s: any) => s.isActive);
  const inactiveSubscribers = (subscribers as any[]).filter((s: any) => !s.isActive);

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h2 className="text-2xl font-bold" data-testid="heading-newsletter">Newsletter Subscribers</h2>
        <Badge variant="secondary">{activeSubscribers.length} active</Badge>
      </div>
      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Subscribed</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeSubscribers.map((s: any) => (
                <TableRow key={s.id} data-testid={`row-subscriber-${s.id}`}>
                  <TableCell className="font-medium">{s.email}</TableCell>
                  <TableCell><Badge variant="default">Active</Badge></TableCell>
                  <TableCell>{s.createdAt ? new Date(s.createdAt).toLocaleDateString() : "-"}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deactivateMutation.mutate(s.id)}
                      data-testid={`button-deactivate-${s.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {inactiveSubscribers.map((s: any) => (
                <TableRow key={s.id} className="opacity-50" data-testid={`row-subscriber-inactive-${s.id}`}>
                  <TableCell className="font-medium">{s.email}</TableCell>
                  <TableCell><Badge variant="outline">Inactive</Badge></TableCell>
                  <TableCell>{s.createdAt ? new Date(s.createdAt).toLocaleDateString() : "-"}</TableCell>
                  <TableCell>-</TableCell>
                </TableRow>
              ))}
              {(subscribers as any[]).length === 0 && (
                <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">No subscribers yet</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}

const VIDEO_SECTIONS = [
  { value: "home", label: "Home Page" },
  { value: "programs", label: "Programs Page" },
  { value: "events", label: "Events Page" },
  { value: "general", label: "General / Other" },
];

function VideosSection() {
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingVideo, setEditingVideo] = useState<any>(null);
  const [form, setForm] = useState({ title: "", description: "", embedUrl: "", section: "general", displayOrder: "0" });

  const { data: videoList = [], isLoading } = useQuery<any[]>({ queryKey: ["/api/admin/videos"] });

  const resetForm = () => { setForm({ title: "", description: "", embedUrl: "", section: "general", displayOrder: "0" }); setEditingVideo(null); setShowForm(false); };

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      if (editingVideo) {
        return apiRequest("PUT", `/api/admin/videos/${editingVideo.id}`, data);
      }
      return apiRequest("POST", "/api/admin/videos", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/videos"] });
      queryClient.invalidateQueries({ queryKey: ["/api/videos"] });
      toast({ title: editingVideo ? "Video updated" : "Video added" });
      resetForm();
    },
    onError: () => toast({ title: "Failed to save video", variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/admin/videos/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/videos"] });
      queryClient.invalidateQueries({ queryKey: ["/api/videos"] });
      toast({ title: "Video deleted" });
    },
    onError: () => toast({ title: "Failed to delete video", variant: "destructive" }),
  });

  const handleEdit = (v: any) => {
    setEditingVideo(v);
    setForm({ title: v.title, description: v.description || "", embedUrl: v.embedUrl, section: v.section, displayOrder: String(v.displayOrder ?? 0) });
    setShowForm(true);
  };

  const handleSubmit = () => {
    if (!form.title.trim() || !form.embedUrl.trim()) {
      toast({ title: "Title and Embed URL are required", variant: "destructive" }); return;
    }
    saveMutation.mutate({ title: form.title, description: form.description, embedUrl: form.embedUrl, section: form.section, displayOrder: parseInt(form.displayOrder) || 0, isActive: true });
  };

  return (
    <div className="space-y-6" data-testid="section-videos">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Videos</h2>
        <Button onClick={() => { resetForm(); setShowForm(true); }} data-testid="button-add-video">
          <Plus className="h-4 w-4 mr-2" /> Add Video
        </Button>
      </div>

      <Dialog open={showForm} onOpenChange={(open) => { if (!open) resetForm(); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingVideo ? "Edit Video" : "Add Video"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-sm font-medium">Title *</label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Annual Gala Highlights 2025" />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Optional description" rows={2} />
            </div>
            <div>
              <label className="text-sm font-medium">Embed URL * <span className="text-xs text-muted-foreground">(YouTube or Vimeo embed URL)</span></label>
              <Input value={form.embedUrl} onChange={(e) => setForm({ ...form, embedUrl: e.target.value })} placeholder="https://www.youtube.com/embed/VIDEO_ID" />
            </div>
            <div>
              <label className="text-sm font-medium">Site Section</label>
              <Select value={form.section} onValueChange={(v) => setForm({ ...form, section: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {VIDEO_SECTIONS.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Display Order</label>
              <Input type="number" value={form.displayOrder} onChange={(e) => setForm({ ...form, displayOrder: e.target.value })} placeholder="0" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={resetForm}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={saveMutation.isPending}>{saveMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : (editingVideo ? "Save Changes" : "Add Video")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
      ) : (videoList as any[]).length === 0 ? (
        <Card><CardContent className="py-12 text-center text-muted-foreground">No videos yet. Click "Add Video" to get started.</CardContent></Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Section</TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(videoList as any[]).map((v: any) => (
                <TableRow key={v.id} data-testid={`row-video-${v.id}`}>
                  <TableCell>
                    <div className="font-medium">{v.title}</div>
                    {v.description && <div className="text-xs text-muted-foreground truncate max-w-xs">{v.description}</div>}
                  </TableCell>
                  <TableCell><Badge variant="outline">{VIDEO_SECTIONS.find((s) => s.value === v.section)?.label ?? v.section}</Badge></TableCell>
                  <TableCell>{v.displayOrder}</TableCell>
                  <TableCell><Badge variant={v.isActive ? "default" : "secondary"}>{v.isActive ? "Active" : "Hidden"}</Badge></TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(v)} data-testid={`button-edit-video-${v.id}`}><Pencil className="h-4 w-4" /></Button>
                      <Button size="sm" variant="outline" onClick={() => deleteMutation.mutate(v.id)} data-testid={`button-delete-video-${v.id}`}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}

export default function AdminPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You need to log in to access this page.",
        variant: "destructive",
      });
      setTimeout(() => { window.location.href = "/login"; }, 500);
    }
  }, [isAuthenticated, isLoading, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated || !user) return null;

  const isAdmin = (user as any).role === "admin" || (user as any).role === "board_member";

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-6">You need admin or board member access to view this page.</p>
          <Button onClick={() => (window.location.href = "/portal")} data-testid="button-back-portal">Back to Portal</Button>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard": return <DashboardSection />;
      case "events": return <EventsSection />;
      case "blog": return <BlogSection />;
      case "donations": return <DonationsSection />;
      case "volunteers": return <VolunteersSection />;
      case "messages": return <MessagesSection />;
      case "users": return <UsersSection />;
      case "registrations": return <EventRegistrationsSection />;
      case "newsletter": return <NewsletterSection />;
      case "videos": return <VideosSection />;
      default: return <DashboardSection />;
    }
  };

  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-card border-r flex-shrink-0 overflow-y-auto">
        <div className="p-4 border-b">
          <h1 className="font-bold text-lg" data-testid="heading-admin-panel">Admin Panel</h1>
          <p className="text-xs text-muted-foreground mt-1">{(user as any).firstName || (user as any).email}</p>
        </div>
        <nav className="p-2 space-y-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === item.key
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover-elevate"
              }`}
              data-testid={`nav-${item.key}`}
            >
              <item.icon className="h-4 w-4 flex-shrink-0" />
              {item.label}
            </button>
          ))}
          <button
            onClick={() => (window.location.href = "/admin/images")}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover-elevate"
            data-testid="nav-images"
          >
            <ImageIcon className="h-4 w-4 flex-shrink-0" />
            Images
          </button>
          <div className="pt-2 mt-2 border-t">
            <button
              onClick={() => (window.location.href = "/portal")}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover-elevate"
              data-testid="nav-back-to-site"
            >
              <ArrowLeft className="h-4 w-4 flex-shrink-0" />
              Back to Site
            </button>
          </div>
        </nav>
      </aside>
      <main className="flex-1 overflow-y-auto p-6" data-testid="admin-content">
        {renderContent()}
      </main>
    </div>
  );
}