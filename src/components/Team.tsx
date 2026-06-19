import { useState, useEffect } from 'react';
import { Plus, Users2, ClipboardList, Play, CheckCircle2, Clock, AlertCircle, ChevronDown, ChevronUp, Send, Activity, Search, Mail, Zap, Info, XCircle, RefreshCw, MapPin, Rocket, Globe2, Sparkles, Pencil, Trash2, Save, X } from 'lucide-react';
import { cn } from '../lib/utils';

interface Employee {
    id: number;
    name: string;
    role: string;
    capabilities: string;
    status: string;
    tasks_completed: number;
}

interface Task {
    id: number;
    title: string;
    description: string;
    type: string;
    status: string;
    priority: string;
    assignee: string;
    input: string;
    output: string;
    config: string | null;
    created_at: string;
    completed_at: string | null;
}

interface ActivityLog {
    id: number;
    task_id: number;
    action: string;
    message: string;
    details: string | null;
    created_at: string;
}

interface TaskStats {
    totalLeads: number;
    withEmail: number;
    emailsSent: number;
    contacted: number;
}

const TASK_TYPES = ['content_creation', 'outreach', 'research', 'community', 'seo', 'analysis', 'other'];
const PRIORITIES = ['low', 'medium', 'high', 'urgent'];

const REGIONS = [
    { value: '', label: 'All Regions (Global)' },
    { value: 'dubai', label: '🇦🇪 Dubai, UAE' },
    { value: 'abu dhabi', label: '🇦🇪 Abu Dhabi, UAE' },
    { value: 'riyadh', label: '🇸🇦 Riyadh, Saudi Arabia' },
    { value: 'new york', label: '🇺🇸 New York, US' },
    { value: 'los angeles', label: '🇺🇸 Los Angeles, US' },
    { value: 'san francisco', label: '🇺🇸 San Francisco, US' },
    { value: 'london', label: '🇬🇧 London, UK' },
    { value: 'toronto', label: '🇨🇦 Toronto, Canada' },
    { value: 'sydney', label: '🇦🇺 Sydney, Australia' },
    { value: 'singapore', label: '🇸🇬 Singapore' },
    { value: 'mumbai', label: '🇮🇳 Mumbai, India' },
    { value: 'berlin', label: '🇩🇪 Berlin, Germany' },
    { value: 'paris', label: '🇫🇷 Paris, France' },
    { value: 'amsterdam', label: '🇳🇱 Amsterdam, Netherlands' },
];

const DEFAULT_EMPLOYEES: Employee[] = [
    { id: 1, name: "Emma (AI Content)", role: "ContentWriter", capabilities: "Generates 1,500+ word blog posts using custom-tailored layouts, SEO integrations, and stippled geometric diagrams.", status: "active", tasks_completed: 12 },
    { id: 2, name: "Olivia (AI Outreach)", role: "OutreachAgent", capabilities: "Discovers leads by scraping domains and executes highly contextual email outreach campaigns.", status: "active", tasks_completed: 45 },
    { id: 3, name: "Alex (AI Researcher)", role: "ResearchAnalyst", capabilities: "Performs real-time web scraping and research briefs using SearXNG and Firecrawl.", status: "active", tasks_completed: 8 },
    { id: 4, name: "Liam (AI Community)", role: "CommunityManager", capabilities: "Monitors and responds to social media interactions on Twitter and LinkedIn based on Julian's persona voice.", status: "active", tasks_completed: 27 },
    { id: 5, name: "Sophia (AI SEO)", role: "SEOSpecialist", capabilities: "Conducts keyword mapping, competitor meta scrapes, and builds interactive SEO reports.", status: "active", tasks_completed: 19 }
];

const DEFAULT_TASKS: Task[] = [
    {
        id: 46,
        title: "How to write an engaging Instagram Bio",
        description: "Write a high-converting bio guide for creators based on clarity, discoverability, and conversion signals.",
        type: "content_creation",
        status: "completed",
        priority: "high",
        assignee: "ContentWriter",
        input: "Research Brief:\n--- Source: Instagram Bio Guide (analyzeinsta.com) ---\nThis guide covers the three pillars of a high-converting bio:\n1. Clarity (what you do)\n2. Discoverability (keywords in username/name)\n3. Conversion (clear CTA link to your funnel).\nMake sure to emphasize whitespace and Julian's voice rules.",
        output: "Successfully published post_46_content.html to the blog repository database.",
        config: null,
        created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
        completed_at: new Date(Date.now() - 3600000 * 23).toISOString()
    },
    {
        id: 45,
        title: "Instagram Ghost Followers: The Silent Growth Killer",
        description: "An article dissecting the damage caused by ghost followers on engagement algorithms and how to run a vetting shield audit.",
        type: "content_creation",
        status: "queued",
        priority: "urgent",
        assignee: "ContentWriter",
        input: "",
        output: "",
        config: null,
        created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
        completed_at: null
    },
    {
        id: 44,
        title: "Dubai Region Lead Generation and Outreach Campaign",
        description: "Discover e-commerce leads in Dubai, gather domain emails, and send personalized onboarding templates.",
        type: "outreach",
        status: "completed",
        priority: "medium",
        assignee: "OutreachAgent",
        input: "",
        output: "Processed 120 target leads in Dubai region. Found 89 valid email contacts. Executed 89 personalized outreach emails. Conversion track active.",
        config: JSON.stringify({ region: "dubai" }),
        created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
        completed_at: new Date(Date.now() - 3600000 * 10).toISOString()
    },
    {
        id: 43,
        title: "Competitor keyword mapping for analyzeinsta.com launch",
        description: "Scrape target keywords and compare index levels with competing analytics tools.",
        type: "seo",
        status: "completed",
        priority: "low",
        assignee: "SEOSpecialist",
        input: "",
        output: "SEO mapping finished. Target keywords: 'instagram engagement calculator', 'instagram bot check'. Competitor gaps highlighted in /seo research report.",
        config: null,
        created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
        completed_at: new Date(Date.now() - 3600000 * 47).toISOString()
    }
];

const DEFAULT_TASK_STATS: Record<number, TaskStats> = {
    44: {
        totalLeads: 120,
        withEmail: 89,
        emailsSent: 89,
        contacted: 89
    }
};

const DEFAULT_ACTIVITY_LOGS: Record<number, ActivityLog[]> = {
    44: [
        { id: 1, task_id: 44, action: "discover", message: "Discovered 120 target domain profiles in Dubai region", details: JSON.stringify({ leads_count: 120 }), created_at: new Date(Date.now() - 3600000 * 11.5).toISOString() },
        { id: 2, task_id: 44, action: "hunt_email", message: "Found 89 emails with active MX records", details: JSON.stringify({ emails_found: 89 }), created_at: new Date(Date.now() - 3600000 * 11.2).toISOString() },
        { id: 3, task_id: 44, action: "enrich", message: "Enriched contacts with CEO name and social metadata", details: null, created_at: new Date(Date.now() - 3600000 * 11).toISOString() },
        { id: 4, task_id: 44, action: "send_email", message: "Dispatched 89 customized email introductions", details: JSON.stringify({ emails_sent: 89 }), created_at: new Date(Date.now() - 3600000 * 10.5).toISOString() },
        { id: 5, task_id: 44, action: "complete", message: "Task completed successfully. Leads active.", details: null, created_at: new Date(Date.now() - 3600000 * 10).toISOString() }
    ]
};

export function Team() {
    // ── LocalStorage Initialization ──
    const [employees, setEmployees] = useState<Employee[]>(() => {
        const saved = localStorage.getItem('ai_team_employees');
        return saved ? JSON.parse(saved) : DEFAULT_EMPLOYEES;
    });

    const [tasks, setTasks] = useState<Task[]>(() => {
        const saved = localStorage.getItem('ai_team_tasks');
        return saved ? JSON.parse(saved) : DEFAULT_TASKS;
    });

    const [taskStats, setTaskStats] = useState<Record<number, TaskStats>>(() => {
        const saved = localStorage.getItem('ai_team_task_stats');
        return saved ? JSON.parse(saved) : DEFAULT_TASK_STATS;
    });

    const [activityLogs, setActivityLogs] = useState<Record<number, ActivityLog[]>>(() => {
        const saved = localStorage.getItem('ai_team_activity_logs');
        return saved ? JSON.parse(saved) : DEFAULT_ACTIVITY_LOGS;
    });

    const [isLoading, setIsLoading] = useState(true);
    const [activeView, setActiveView] = useState<'team' | 'tasks' | 'content_pipeline'>('tasks');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterAssignee, setFilterAssignee] = useState('');
    const [showNewTask, setShowNewTask] = useState(false);
    const [expandedTask, setExpandedTask] = useState<number | null>(null);
    const [loadingActivity, setLoadingActivity] = useState<number | null>(null);
    const [runningAction, setRunningAction] = useState<string | null>(null); 
    const [expandedResearch, setExpandedResearch] = useState(false);
    const [researchContent, setResearchContent] = useState<{ topic: string, content: string, taskId: number } | null>(null);

    // Edit mode
    const [editingTask, setEditingTask] = useState<number | null>(null);
    const [editForm, setEditForm] = useState({ title: '', description: '', priority: '', assignee: '' });
    const [researchRunning, setResearchRunning] = useState(false);

    // Task form
    const [taskForm, setTaskForm] = useState({ title: '', description: '', assignee: '', type: 'content_creation', priority: 'medium' });

    // Sync to LocalStorage on changes
    useEffect(() => {
        localStorage.setItem('ai_team_employees', JSON.stringify(employees));
    }, [employees]);

    useEffect(() => {
        localStorage.setItem('ai_team_tasks', JSON.stringify(tasks));
    }, [tasks]);

    useEffect(() => {
        localStorage.setItem('ai_team_task_stats', JSON.stringify(taskStats));
    }, [taskStats]);

    useEffect(() => {
        localStorage.setItem('ai_team_activity_logs', JSON.stringify(activityLogs));
    }, [activityLogs]);

    useEffect(() => {
        // Simulate a brief premium loading sequence
        const t = setTimeout(() => setIsLoading(false), 500);
        return () => clearTimeout(t);
    }, []);

    const toggleTask = (taskId: number) => {
        if (expandedTask === taskId) {
            setExpandedTask(null);
        } else {
            setExpandedTask(taskId);
        }
    };

    const getTaskConfig = (task: Task) => {
        try { return task.config ? JSON.parse(task.config) : {}; }
        catch { return {}; }
    };

    const updateTaskConfig = (taskId: number, configUpdate: Record<string, any>) => {
        setTasks(prev => prev.map(t => {
            if (t.id !== taskId) return t;
            const existing = getTaskConfig(t);
            return { ...t, config: JSON.stringify({ ...existing, ...configUpdate }) };
        }));
    };

    // ── Client-side Simulator Engine ──
    const addSimulatedLog = (taskId: number, action: string, message: string, detailsObj?: any) => {
        const newLog: ActivityLog = {
            id: Date.now() + Math.random(),
            task_id: taskId,
            action,
            message,
            details: detailsObj ? JSON.stringify(detailsObj) : null,
            created_at: new Date().toISOString()
        };

        setActivityLogs(prev => {
            const list = prev[taskId] || [];
            return { ...prev, [taskId]: [newLog, ...list] };
        });
    };

    const incrementEmployeeTaskCount = (role: string) => {
        setEmployees(prev => prev.map(e => {
            if (e.role === role) {
                return { ...e, tasks_completed: e.tasks_completed + 1 };
            }
            return e;
        }));
    };

    const runTaskAction = (taskId: number, action: 'discover' | 'outreach' | 'run') => {
        if (runningAction) return;
        setRunningAction(action);
        setLoadingActivity(taskId);

        // Update task status to in-progress
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'in_progress' } : t));

        if (action === 'discover') {
            addSimulatedLog(taskId, "discover", "Initializing Lead Discovery Module...", null);
            
            setTimeout(() => {
                addSimulatedLog(taskId, "discover", "Scanning target company domain registries...", null);
            }, 1000);

            setTimeout(() => {
                const leadsCount = Math.floor(Math.random() * 50) + 50;
                addSimulatedLog(taskId, "discover", `Discovered ${leadsCount} target domains matching search parameters`, { leads_count: leadsCount });
                setTaskStats(prev => ({
                    ...prev,
                    [taskId]: {
                        totalLeads: leadsCount,
                        withEmail: 0,
                        emailsSent: 0,
                        contacted: 0
                    }
                }));
                setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'completed', output: `Discovered ${leadsCount} leads.` } : t));
                setRunningAction(null);
                setLoadingActivity(null);
                incrementEmployeeTaskCount("OutreachAgent");
            }, 2500);

        } else if (action === 'outreach') {
            const currentStats = taskStats[taskId] || { totalLeads: 85, withEmail: 0, emailsSent: 0, contacted: 0 };
            const verifiedEmails = Math.max(1, Math.floor(currentStats.totalLeads * 0.75));

            addSimulatedLog(taskId, "hunt_email", "Resolving domain MX records and scraping public mailboxes...", null);

            setTimeout(() => {
                addSimulatedLog(taskId, "enrich", `Found ${verifiedEmails} verified contact emails. Setting up personal merge hooks...`, { emails_found: verifiedEmails });
            }, 1200);

            setTimeout(() => {
                addSimulatedLog(taskId, "send_email", `Dispatched ${verifiedEmails} personalized onboarding templates`, { emails_sent: verifiedEmails });
                setTaskStats(prev => ({
                    ...prev,
                    [taskId]: {
                        totalLeads: currentStats.totalLeads || 85,
                        withEmail: verifiedEmails,
                        emailsSent: verifiedEmails,
                        contacted: verifiedEmails
                    }
                }));
                setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'completed', output: `Outreach completed. Sent ${verifiedEmails} emails.` } : t));
                setRunningAction(null);
                setLoadingActivity(null);
                incrementEmployeeTaskCount("OutreachAgent");
            }, 3000);

        } else if (action === 'run') {
            // Run Full Pipeline
            const leadsCount = Math.floor(Math.random() * 60) + 40;
            const verifiedEmails = Math.floor(leadsCount * 0.8);

            addSimulatedLog(taskId, "discover", "Launching Full Agent pipeline...", null);

            setTimeout(() => {
                addSimulatedLog(taskId, "discover", `Scraped and filtered ${leadsCount} targets.`, { leads_count: leadsCount });
            }, 1000);

            setTimeout(() => {
                addSimulatedLog(taskId, "hunt_email", `Extracted ${verifiedEmails} valid leads. Commencing mailbox verification...`, null);
            }, 2000);

            setTimeout(() => {
                addSimulatedLog(taskId, "send_email", `Delivered ${verifiedEmails} onboarding sequences. Listening for triggers...`, { emails_sent: verifiedEmails });
                setTaskStats(prev => ({
                    ...prev,
                    [taskId]: {
                        totalLeads: leadsCount,
                        withEmail: verifiedEmails,
                        emailsSent: verifiedEmails,
                        contacted: verifiedEmails
                    }
                }));
            }, 3500);

            setTimeout(() => {
                addSimulatedLog(taskId, "complete", "Pipeline complete. Status active.", null);
                setTasks(prev => prev.map(t => t.id === taskId ? { 
                    ...t, 
                    status: 'completed', 
                    completed_at: new Date().toISOString(),
                    output: `Pipeline successfully executed. Scraped: ${leadsCount}, Contacted: ${verifiedEmails}.`
                } : t));
                setRunningAction(null);
                setLoadingActivity(null);
                incrementEmployeeTaskCount("OutreachAgent");
            }, 4500);
        }
    };

    const runAlexResearch = (taskId: number, topic: string) => {
        if (researchRunning) return;
        setResearchRunning(true);

        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'in_progress' } : t));

        setTimeout(() => {
            const mockBrief = `Research Brief for Topic: "${topic}"
=====================================================
Target Brand Context: AnalyzeInsta (analyzeinsta.com)
Research Date: June 2026

--- Source: Competitor Growth Curves (analyzeinsta.com) ---
Scraped competitor frameworks indicating standard churn signals:
- Average creator accounts retain only 18% of newly acquired monthly followers.
- Active bios with structured keywords show a +28% increase in organic profile clicks.
- Standard visual hooks decay within 14 days of constant exposure.

--- Source: SEO & Social Search Optimization ---
- Target Keywords: "${topic}", "instagram profile setup", "bio clarity hacks"
- Monthly Search Volume (estimate): 14.5K index hits
- Competitive Index: Medium-Low (Excellent opportunity for a featured blog article)

--- Factual Summary ---
1. Emphasize "Clarity first" (Julian Vance CEO guidelines).
2. Avoid generic headings (No "1. Introduction" or similar boilerplates).
3. Draft visual diagrams showing the retention curve vs. bio CTR.
4. Target a minimum post length of 1,500 words.`;

            setTasks(prev => prev.map(t => t.id === taskId ? { 
                ...t, 
                status: 'completed', 
                input: mockBrief,
                completed_at: new Date().toISOString(),
                output: "Simulated research gathered. Ready to publish blog post draft."
            } : t));
            
            setResearchRunning(false);
            incrementEmployeeTaskCount("ResearchAnalyst");
        }, 3000);
    };

    const createTask = () => {
        const isContent = taskForm.type === 'content_creation';
        const assignee = isContent ? 'ContentWriter' : taskForm.assignee;
        if (!taskForm.title.trim() || !assignee) return;

        const newId = Math.max(0, ...tasks.map(t => t.id)) + 1;
        const newTask: Task = {
            id: newId,
            title: taskForm.title.trim(),
            description: taskForm.description.trim() || `${taskForm.type.replace(/_/g, ' ')} task`,
            type: taskForm.type,
            status: isContent ? 'in_progress' : 'queued',
            priority: taskForm.priority,
            assignee,
            input: '',
            output: '',
            config: null,
            created_at: new Date().toISOString(),
            completed_at: null
        };

        setTasks(prev => [newTask, ...prev]);

        // Auto-trigger simulated research for content creation tasks
        if (isContent) {
            setResearchRunning(true);
            setTimeout(() => {
                const mockBrief = `Research Brief: "${taskForm.title.trim()}"
===================================================
Generated by Alex (AI Researcher) for AnalyzeInsta

--- Source: Search Metrics ---
- High trend score detected for "${taskForm.title.trim()}"
- Top competitors missing targeted comparison tables

--- Content Blueprint ---
- Focus: Step-by-step diagnostic paths
- CTA Target: AnalyzeInsta newsletter signup
- Constraint: Maintain high vocabulary density, write under Julian's voice rules.`;

                setTasks(prev => prev.map(t => t.id === newId ? { 
                    ...t, 
                    status: 'completed',
                    input: mockBrief,
                    completed_at: new Date().toISOString(),
                    output: "Simulated research completed. Ready to publish."
                } : t));
                setResearchRunning(false);
                incrementEmployeeTaskCount("ResearchAnalyst");
            }, 3500);
        }

        setTaskForm({ title: '', description: '', assignee: '', type: 'content_creation', priority: 'medium' });
        setShowNewTask(false);
    };

    const openResearchModal = (taskId: number) => {
        const task = tasks.find(t => t.id === taskId);
        if (task && task.input) {
            setResearchContent({ taskId, topic: task.title, content: task.input });
            setExpandedResearch(true);
        }
    };

    const startEditing = (task: Task) => {
        setEditingTask(task.id);
        setEditForm({ title: task.title, description: task.description || '', priority: task.priority, assignee: task.assignee });
    };

    const saveEdit = (taskId: number) => {
        setTasks(prev => prev.map(t => t.id === taskId ? { 
            ...t, 
            title: editForm.title, 
            description: editForm.description, 
            priority: editForm.priority, 
            assignee: editForm.assignee 
        } : t));
        setEditingTask(null);
    };

    const deleteTask = (taskId: number) => {
        if (!confirm('Delete this task permanently?')) return;
        setTasks(prev => prev.filter(t => t.id !== taskId));
        setExpandedTask(null);
    };

    const getRoleColor = (role: string) => {
        const c: Record<string, string> = {
            ContentWriter: 'from-blue-500/15 to-cyan-500/15 text-cyan-400 border-cyan-500/20',
            OutreachAgent: 'from-violet-500/15 to-purple-500/15 text-violet-400 border-violet-500/20',
            ResearchAnalyst: 'from-emerald-500/15 to-teal-500/15 text-emerald-400 border-emerald-500/20',
            CommunityManager: 'from-amber-500/15 to-orange-500/15 text-amber-400 border-amber-500/20',
            SEOSpecialist: 'from-pink-500/15 to-rose-500/15 text-pink-400 border-pink-500/20',
        };
        return c[role] || 'from-slate-500/15 to-slate-600/15 text-slate-400 border-slate-500/20';
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed': return <CheckCircle2 size={12} className="text-emerald-400" />;
            case 'in_progress': return <Play size={12} className="text-blue-400" />;
            case 'failed': return <AlertCircle size={12} className="text-red-400" />;
            default: return <Clock size={12} className="text-muted-foreground" />;
        }
    };



    const getRoleIcon = (role: string) => {
        const icons: Record<string, string> = {
            ContentWriter: '✍️',
            OutreachAgent: '📧',
            ResearchAnalyst: '🔬',
            CommunityManager: '💬',
            SEOSpecialist: '🎯',
        };
        return icons[role] || '👤';
    };

    const getEmployeeName = (role: string) => {
        const emp = employees.find(e => e.role === role);
        return emp?.name || role;
    };

    const getPriorityDot = (p: string) => {
        switch (p) {
            case 'urgent': return 'bg-red-500 shadow-red-500/50';
            case 'high': return 'bg-orange-400 shadow-orange-400/50';
            case 'medium': return 'bg-blue-400 shadow-blue-400/50';
            default: return 'bg-slate-500 shadow-slate-500/50';
        }
    };

    const getContentReadiness = (task: Task) => {
        if (task.type !== 'content_creation') return null;
        if (task.status === 'completed' && task.input) return { label: 'Research Ready', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' };
        if (task.status === 'in_progress') return { label: 'Researching...', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' };
        return { label: 'Needs Research', color: 'text-slate-400 bg-slate-500/10 border-slate-500/20' };
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'completed': return { text: 'Complete', color: 'text-emerald-400' };
            case 'in_progress': return { text: 'In Progress', color: 'text-blue-400' };
            case 'failed': return { text: 'Failed', color: 'text-red-400' };
            case 'queued': return { text: 'Queued', color: 'text-muted-foreground' };
            default: return { text: status, color: 'text-muted-foreground' };
        }
    };

    const getActionIcon = (action: string) => {
        switch (action) {
            case 'discover': return <Search size={12} className="text-blue-400" />;
            case 'hunt_email': return <Mail size={12} className="text-cyan-400" />;
            case 'enrich': return <Zap size={12} className="text-amber-400" />;
            case 'send_email': return <Send size={12} className="text-emerald-400" />;
            case 'complete': return <CheckCircle2 size={12} className="text-emerald-400" />;
            case 'error': return <XCircle size={12} className="text-red-400" />;
            default: return <Info size={12} className="text-slate-400" />;
        }
    };

    const getActionColor = (action: string) => {
        switch (action) {
            case 'discover': return 'border-blue-500/30 bg-blue-500/5';
            case 'hunt_email': return 'border-cyan-500/30 bg-cyan-500/5';
            case 'enrich': return 'border-amber-500/30 bg-amber-500/5';
            case 'send_email': return 'border-emerald-500/30 bg-emerald-500/5';
            case 'complete': return 'border-emerald-500/30 bg-emerald-500/10';
            case 'error': return 'border-red-500/30 bg-red-500/5';
            default: return 'border-slate-500/20 bg-slate-500/5';
        }
    };

    const formatTime = (dateStr: string) => {
        if (!dateStr) return '';
        try {
            const d = new Date(dateStr);
            const now = new Date();
            const diff = now.getTime() - d.getTime();
            if (diff < 60000) return 'just now';
            if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
            if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
            return d.toLocaleDateString();
        } catch { return ''; }
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return 'N/A';
        try {
            const d = new Date(dateStr);
            return d.toLocaleDateString();
        } catch { return 'N/A'; }
    };

    const filteredTasks = tasks.filter(task => {
        if (filterStatus && task.status !== filterStatus) return false;
        if (filterAssignee && task.assignee !== filterAssignee) return false;
        return true;
    });

    return (
        <div className="space-y-6">
            <header className="animate-fade-in-up flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight gradient-text">Team Delegation Center</h2>
                    <p className="text-muted-foreground mt-2">Manage your virtual employees and delegate marketing campaigns.</p>
                </div>
                
                <div className="flex items-center gap-2 self-start md:self-center bg-secondary/30 p-1.5 rounded-xl border border-border/40">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse ml-2" />
                    <span className="text-xs font-semibold font-mono text-emerald-400 mr-2">Simulated Live Environment</span>
                </div>
            </header>

            {/* View Toggle */}
            <div className="flex items-center gap-2 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <button onClick={() => setActiveView('team')}
                    className={cn("px-4 py-2 rounded-xl text-sm font-medium transition-all border",
                        activeView === 'team'
                            ? "bg-gradient-to-r from-primary/12 to-accent/8 text-foreground border-primary/30"
                            : "text-muted-foreground border-transparent hover:bg-white/[0.03]")}>
                    <span className="flex items-center gap-2"><Users2 size={14} /> Employees</span>
                </button>
                <button onClick={() => setActiveView('tasks')}
                    className={cn("px-4 py-2 rounded-xl text-sm font-medium transition-all border",
                        activeView === 'tasks'
                            ? "bg-gradient-to-r from-primary/12 to-accent/8 text-foreground border-primary/30"
                            : "text-muted-foreground border-transparent hover:bg-white/[0.03]")}>
                    <span className="flex items-center gap-2"><ClipboardList size={14} /> Tasks
                        <span className="text-[10px] bg-primary/15 text-primary px-2 py-0.5 rounded-full font-bold border border-primary/15">
                            {tasks.length}
                        </span>
                    </span>
                </button>
                <button onClick={() => setActiveView('content_pipeline')}
                    className={cn("px-4 py-2 rounded-xl text-sm font-medium transition-all border",
                        activeView === 'content_pipeline'
                            ? "bg-gradient-to-r from-primary/12 to-accent/8 text-foreground border-primary/30"
                            : "text-muted-foreground border-transparent hover:bg-white/[0.03]")}>
                    <span className="flex items-center gap-2"><Sparkles size={14} /> Content Pipeline</span>
                </button>
                {(activeView === 'tasks' || activeView === 'content_pipeline') && (
                    <button onClick={() => setShowNewTask(!showNewTask)}
                        className={cn("ml-auto px-4 py-2 rounded-xl font-semibold flex items-center gap-2 transition-all text-sm btn-glow",
                            "bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg shadow-primary/15")}>
                        <Plus size={14} /> New Task
                    </button>
                )}
            </div>

            {/* Employees View */}
            {activeView === 'team' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    {isLoading ? (
                        [1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="glass-card p-5">
                                <div className="h-8 skeleton-pulse rounded-lg w-1/2 mb-3" />
                                <div className="h-3 skeleton-pulse rounded-lg w-full mb-2" />
                                <div className="h-3 skeleton-pulse rounded-lg w-2/3" />
                            </div>
                        ))
                    ) : employees.length === 0 ? (
                        <div className="col-span-full text-center py-12 text-muted-foreground glass-card">
                            <Users2 size={32} className="mx-auto mb-2 opacity-30" />
                            <p className="text-sm">No employees found — Reset standard team settings.</p>
                        </div>
                    ) : employees.map(emp => (
                        <div key={emp.id} className="glass-card p-5 hover:border-primary/20 transition-all duration-200 hover-lift">
                            <div className="flex items-start gap-3 mb-3">
                                <div className="text-2xl">{getRoleIcon(emp.role)}</div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-foreground text-sm">{emp.name}</p>
                                    <span className={cn("text-[10px] px-2 py-0.5 rounded-full border bg-gradient-to-r font-medium inline-block mt-1", getRoleColor(emp.role))}>
                                        {emp.role}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className={cn("w-2 h-2 rounded-full", emp.status === 'active' ? 'bg-emerald-400' : 'bg-slate-500')} />
                                    <span className="text-[10px] text-muted-foreground capitalize">{emp.status}</span>
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground/70 leading-relaxed mb-3 line-clamp-2">{emp.capabilities}</p>
                            <div className="flex items-center justify-between text-[10px] text-muted-foreground/50 pt-2 border-t border-border/20">
                                <span>Tasks completed: <span className="text-primary font-semibold">{emp.tasks_completed || 0}</span></span>
                                <button onClick={() => { setActiveView('tasks'); setShowNewTask(true); setTaskForm(f => ({ ...f, assignee: emp.role })); }}
                                    className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors font-medium">
                                    <Send size={10} /> Assign Task
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Tasks View */}
            {activeView === 'tasks' && (
                <div className="space-y-4">
                    {/* Filters */}
                    <div className="flex items-center gap-3 animate-fade-in-up">
                        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
                            className="bg-secondary/50 rounded-xl px-4 py-2 text-sm border border-border/50 focus:border-primary outline-none cursor-pointer">
                            <option value="">All Statuses</option>
                            <option value="pending">Pending</option>
                            <option value="queued">Queued</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>
                        <select value={filterAssignee} onChange={(e) => setFilterAssignee(e.target.value)}
                            className="bg-secondary/50 rounded-xl px-4 py-2 text-sm border border-border/50 focus:border-primary outline-none cursor-pointer">
                            <option value="">All Assignees</option>
                            {employees.map(e => <option key={e.role} value={e.role}>{e.name} ({e.role})</option>)}
                        </select>
                    </div>

                    {/* New Task Form */}
                    {showNewTask && (
                        <div className="glass-card p-6 space-y-4 animate-fade-in-up">
                            <h4 className="font-semibold flex items-center gap-2.5">
                                <div className="p-1.5 rounded-lg bg-primary/12 border border-primary/15"><Plus size={14} className="text-primary" /></div>
                                Create Task
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-1.5 block">Type</label>
                                    <select value={taskForm.type} onChange={(e) => setTaskForm({ ...taskForm, type: e.target.value, assignee: e.target.value === 'content_creation' ? 'ContentWriter' : taskForm.assignee })}
                                        className="w-full bg-secondary/50 rounded-xl px-4 py-2.5 text-sm border border-border/50 focus:border-primary outline-none cursor-pointer">
                                        {TASK_TYPES.map(t => <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-1.5 block">Priority</label>
                                    <select value={taskForm.priority} onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                                        className="w-full bg-secondary/50 rounded-xl px-4 py-2.5 text-sm border border-border/50 focus:border-primary outline-none cursor-pointer">
                                        {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                                    </select>
                                </div>

                                {taskForm.type === 'content_creation' ? (
                                    <>
                                        <div className="md:col-span-2">
                                            <label className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-1.5 block">Research Topic *</label>
                                            <input type="text" value={taskForm.title} onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                                                placeholder="e.g. how to increase instagram engagement in 2026"
                                                className="w-full bg-secondary/50 rounded-xl px-4 py-2.5 text-sm border border-border/50 focus:border-primary outline-none input-glow placeholder:text-muted-foreground/40" />
                                        </div>
                                        <div className="md:col-span-2 flex items-start gap-2 p-3 rounded-lg bg-blue-500/5 border border-blue-500/15">
                                            <Sparkles size={14} className="text-blue-400 mt-0.5 shrink-0" />
                                            <p className="text-xs text-blue-300/80 leading-relaxed">
                                                Alex will research this topic automatically. Once complete, you can review details or publish the blog post.
                                            </p>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="md:col-span-2">
                                            <label className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-1.5 block">Title *</label>
                                            <input type="text" value={taskForm.title} onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                                                placeholder="Task title"
                                                className="w-full bg-secondary/50 rounded-xl px-4 py-2.5 text-sm border border-border/50 focus:border-primary outline-none input-glow placeholder:text-muted-foreground/40" />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-1.5 block">Description</label>
                                            <textarea value={taskForm.description} onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                                                placeholder="Additional context for the task..."
                                                className="w-full h-20 bg-secondary/50 rounded-xl px-4 py-3 text-sm border border-border/50 focus:border-primary outline-none resize-none input-glow placeholder:text-muted-foreground/40" />
                                        </div>
                                        <div>
                                            <label className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-1.5 block">Assign To *</label>
                                            <select value={taskForm.assignee} onChange={(e) => setTaskForm({ ...taskForm, assignee: e.target.value })}
                                                className="w-full bg-secondary/50 rounded-xl px-4 py-2.5 text-sm border border-border/50 focus:border-primary outline-none cursor-pointer">
                                                <option value="">Select employee...</option>
                                                {employees.map(e => <option key={e.role} value={e.role}>{getRoleIcon(e.role)} {e.name} — {e.role}</option>)}
                                            </select>
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className="flex gap-3">
                                <button onClick={createTask} disabled={!taskForm.title.trim() || (taskForm.type !== 'content_creation' && !taskForm.assignee)}
                                    className={cn("flex-1 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all btn-glow",
                                        !taskForm.title.trim() || (taskForm.type !== 'content_creation' && !taskForm.assignee) ? "bg-secondary text-muted-foreground cursor-not-allowed"
                                            : "bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg shadow-primary/15")}>
                                    {taskForm.type === 'content_creation' ? (
                                        <><Sparkles size={16} /> Create & Start Research</>
                                    ) : (
                                        <><Send size={16} /> Create Task</>
                                    )}
                                </button>
                                <button onClick={() => setShowNewTask(false)} className="px-4 py-3 rounded-xl bg-secondary text-muted-foreground text-sm font-medium">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Task List */}
                    <div className="glass-card p-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                        {filteredTasks.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground">
                                <ClipboardList size={32} className="mx-auto mb-2 opacity-30" />
                                <p className="text-sm">No tasks found matching current filters.</p>
                            </div>
                        ) : (
                            <div className="space-y-3 max-h-[800px] overflow-y-auto pr-2">
                                {filteredTasks.map(task => {
                                    const config = getTaskConfig(task);
                                    const stats = taskStats[task.id];
                                    return (
                                    <div key={task.id} className="bg-secondary/30 rounded-xl border border-border/30 hover:border-primary/20 hover:bg-secondary/50 transition-all duration-200 group">
                                        <div className="p-4 cursor-pointer" onClick={() => toggleTask(task.id)}>
                                            <div className="flex items-center justify-between gap-3">
                                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                                    <div className={cn("w-2.5 h-2.5 rounded-full shrink-0 shadow-sm", getPriorityDot(task.priority))} title={task.priority} />
                                                    <p className="font-medium text-sm truncate">
                                                        <span className="text-primary/80 font-mono text-sm mr-2 font-bold">#{task.id}</span>
                                                        {task.title}
                                                    </p>
                                                    <span className="text-xs text-muted-foreground/60 shrink-0 hidden md:inline">
                                                        — {getEmployeeName(task.assignee)}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {config.region && (
                                                        <span className="text-[10px] px-2 py-0.5 rounded-full border border-emerald-500/20 bg-emerald-500/8 text-emerald-400 font-medium flex items-center gap-1">
                                                            <MapPin size={8} /> {config.region}
                                                        </span>
                                                    )}
                                                    {(() => {
                                                        const readiness = getContentReadiness(task);
                                                        if (!readiness) return null;
                                                        return (
                                                            <span className={cn("text-[10px] px-2 py-0.5 rounded-full border font-medium", readiness.color)}>
                                                                {readiness.label}
                                                            </span>
                                                        );
                                                    })()}
                                                    {(() => {
                                                        const sl = getStatusLabel(task.status);
                                                        return (
                                                            <span className={cn("text-[10px] font-medium capitalize flex items-center gap-1.5", sl.color)}>
                                                                {getStatusIcon(task.status)}
                                                                {sl.text}
                                                            </span>
                                                        );
                                                    })()}
                                                    <span className={cn("text-[10px] px-2 py-0.5 rounded-full border bg-gradient-to-r font-medium", getRoleColor(task.assignee))}>
                                                        {getRoleIcon(task.assignee)} {getEmployeeName(task.assignee)}
                                                    </span>
                                                    {expandedTask === task.id ? <ChevronUp size={14} className="text-muted-foreground" /> : <ChevronDown size={14} className="text-muted-foreground" />}
                                                </div>
                                            </div>
                                        </div>

                                        {expandedTask === task.id && (
                                            <div className="px-4 pb-4 border-t border-border/20 pt-3 space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex gap-4 text-[10px] text-muted-foreground/60">
                                                        <span>Type: {task.type?.replace(/_/g, ' ')}</span>
                                                        <span>Created: {formatDate(task.created_at)}</span>
                                                        {task.completed_at && <span>Done: {formatDate(task.completed_at)}</span>}
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        {editingTask !== task.id && (
                                                            <button onClick={(e) => { e.stopPropagation(); startEditing(task); }}
                                                                className="p-1.5 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors" title="Edit task">
                                                                <Pencil size={12} />
                                                            </button>
                                                        )}
                                                        <button onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }}
                                                            className="p-1.5 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-colors" title="Delete task">
                                                                <Trash2 size={12} />
                                                        </button>
                                                    </div>
                                                </div>

                                                {editingTask === task.id ? (
                                                    <div className="bg-background/40 rounded-xl border border-primary/20 p-4 space-y-3" onClick={e => e.stopPropagation()}>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                            <div className="md:col-span-2">
                                                                <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1 block">Title</label>
                                                                <input type="text" value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                                                    className="w-full bg-secondary/50 rounded-lg px-3 py-2 text-sm border border-border/50 focus:border-primary outline-none" />
                                                            </div>
                                                            <div className="md:col-span-2">
                                                                <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1 block">Description</label>
                                                                <textarea value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                                                    className="w-full h-16 bg-secondary/50 rounded-lg px-3 py-2 text-sm border border-border/50 focus:border-primary outline-none resize-none" />
                                                            </div>
                                                            <div>
                                                                <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1 block">Priority</label>
                                                                <select value={editForm.priority} onChange={(e) => setEditForm({ ...editForm, priority: e.target.value })}
                                                                    className="w-full bg-secondary/50 rounded-lg px-3 py-2 text-sm border border-border/50 focus:border-primary outline-none cursor-pointer">
                                                                    {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                                                                </select>
                                                            </div>
                                                            <div>
                                                                <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1 block">Assign To</label>
                                                                <select value={editForm.assignee} onChange={(e) => setEditForm({ ...editForm, assignee: e.target.value })}
                                                                    className="w-full bg-secondary/50 rounded-lg px-3 py-2 text-sm border border-border/50 focus:border-primary outline-none cursor-pointer">
                                                                    {employees.map(e => <option key={e.role} value={e.role}>{e.name} — {e.role}</option>)}
                                                                </select>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <button onClick={(e) => { e.stopPropagation(); saveEdit(task.id); }}
                                                                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-gradient-to-r from-primary to-accent text-primary-foreground">
                                                                <Save size={12} /> Save
                                                            </button>
                                                            <button onClick={(e) => { e.stopPropagation(); setEditingTask(null); }}
                                                                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium bg-secondary text-muted-foreground">
                                                                <X size={12} /> Cancel
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    task.description && <p className="text-xs text-muted-foreground">{task.description}</p>
                                                )}

                                                {/* ═══ OUTREACH SPECIFIC UI ═══ */}
                                                {task.type === 'outreach' && (
                                                    <>
                                                        {/* Stats Panel */}
                                                        {stats && (stats.totalLeads > 0 || stats.withEmail > 0) && (
                                                            <div className="grid grid-cols-4 gap-2">
                                                                {[
                                                                    { label: 'Leads', value: stats.totalLeads, color: 'text-blue-400', bg: 'bg-blue-500/8 border-blue-500/15' },
                                                                    { label: 'With Email', value: stats.withEmail, color: 'text-cyan-400', bg: 'bg-cyan-500/8 border-cyan-500/15' },
                                                                    { label: 'Emails Sent', value: stats.emailsSent, color: 'text-emerald-400', bg: 'bg-emerald-500/8 border-emerald-500/15' },
                                                                    { label: 'Contacted', value: stats.contacted, color: 'text-violet-400', bg: 'bg-violet-500/8 border-violet-500/15' },
                                                                ].map(s => (
                                                                    <div key={s.label} className={cn("rounded-lg border p-2.5 text-center", s.bg)}>
                                                                        <p className={cn("text-lg font-bold", s.color)}>{s.value}</p>
                                                                        <p className="text-[9px] text-muted-foreground/60 uppercase tracking-wider font-medium">{s.label}</p>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}

                                                        {/* Targeting & Actions */}
                                                        <div className="bg-background/40 rounded-xl border border-border/20 p-3 space-y-3" onClick={e => e.stopPropagation()}>
                                                            <div className="flex items-center gap-3">
                                                                <div className="flex items-center gap-1.5 shrink-0">
                                                                    <Globe2 size={12} className="text-emerald-400" />
                                                                    <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Target Region</span>
                                                                </div>
                                                                <select
                                                                    value={config.region || ''}
                                                                    onChange={(e) => updateTaskConfig(task.id, { region: e.target.value })}
                                                                    className="flex-1 bg-secondary/60 rounded-lg px-3 py-1.5 text-xs border border-border/40 focus:border-primary outline-none cursor-pointer">
                                                                    {REGIONS.map(r => (
                                                                        <option key={r.value} value={r.value}>{r.label}</option>
                                                                    ))}
                                                                </select>
                                                            </div>

                                                            <div className="flex gap-2 flex-wrap">
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); runTaskAction(task.id, 'discover'); }}
                                                                    disabled={!!runningAction}
                                                                    className={cn(
                                                                        "flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium transition-all border",
                                                                        runningAction === 'discover'
                                                                            ? "bg-blue-500/20 text-blue-300 border-blue-500/30 animate-pulse"
                                                                            : "bg-blue-500/8 text-blue-400 border-blue-500/20 hover:bg-blue-500/15 hover:border-blue-500/30",
                                                                        runningAction && runningAction !== 'discover' && "opacity-40 cursor-not-allowed"
                                                                    )}>
                                                                    <Search size={12} className={runningAction === 'discover' ? 'animate-spin' : ''} />
                                                                    {runningAction === 'discover' ? 'Discovering...' : 'Discover Leads'}
                                                                </button>
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); runTaskAction(task.id, 'outreach'); }}
                                                                    disabled={!!runningAction}
                                                                    className={cn(
                                                                        "flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium transition-all border",
                                                                        runningAction === 'outreach'
                                                                            ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30 animate-pulse"
                                                                            : "bg-emerald-500/8 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/15 hover:border-emerald-500/30",
                                                                        runningAction && runningAction !== 'outreach' && "opacity-40 cursor-not-allowed"
                                                                    )}>
                                                                    <Mail size={12} className={runningAction === 'outreach' ? 'animate-spin' : ''} />
                                                                    {runningAction === 'outreach' ? 'Sending...' : 'Hunt & Send Outreach'}
                                                                </button>
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); runTaskAction(task.id, 'run'); }}
                                                                    disabled={!!runningAction}
                                                                    className={cn(
                                                                        "flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all border",
                                                                        runningAction === 'run'
                                                                            ? "bg-gradient-to-r from-primary/25 to-accent/15 text-primary border-primary/30 animate-pulse"
                                                                            : "bg-gradient-to-r from-primary/10 to-accent/5 text-primary border-primary/20 hover:from-primary/20 hover:to-accent/10",
                                                                        runningAction && runningAction !== 'run' && "opacity-40 cursor-not-allowed"
                                                                    )}>
                                                                    <Rocket size={12} className={runningAction === 'run' ? 'animate-bounce' : ''} />
                                                                    {runningAction === 'run' ? 'Running Pipeline...' : 'Run Full Pipeline'}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </>
                                                )}

                                                {/* ═══ CONTENT CREATION UI ═══ */}
                                                {task.type === 'content_creation' && (
                                                    <div className="bg-background/40 rounded-xl border border-border/20 p-4 space-y-3" onClick={e => e.stopPropagation()}>
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); runAlexResearch(task.id, task.title); }}
                                                                disabled={researchRunning}
                                                                className={cn("flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all border bg-gradient-to-r from-blue-500/10 to-cyan-500/5 text-blue-400 border-blue-500/20 hover:from-blue-500/20 hover:to-cyan-500/10 btn-glow shadow-sm shadow-blue-500/10",
                                                                    researchRunning && "animate-pulse opacity-70 cursor-not-allowed")}>
                                                                <Sparkles size={14} className={researchRunning ? 'animate-spin' : ''} />
                                                                {researchRunning ? 'Researching...' : 'Run Research'}
                                                            </button>
                                                            {task.input && (
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); openResearchModal(task.id); }}
                                                                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all border bg-gradient-to-r from-cyan-500/10 to-blue-500/5 text-cyan-400 border-cyan-500/20 hover:from-cyan-500/20 hover:to-blue-500/10">
                                                                    <Search size={14} />
                                                                    View Research
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* ═══ ACTIVITY FEED ═══ */}
                                                {task.type === 'outreach' && (
                                                <div className="mt-1">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <h5 className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1.5">
                                                            <Activity size={12} className="text-primary" />
                                                            Activity Log
                                                        </h5>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); setLoadingActivity(task.id); setTimeout(() => setLoadingActivity(null), 500); }}
                                                            className="text-[10px] text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                                                            <RefreshCw size={10} className={loadingActivity === task.id ? 'animate-spin' : ''} />
                                                            Refresh
                                                        </button>
                                                    </div>

                                                    {loadingActivity === task.id && !activityLogs[task.id] ? (
                                                        <div className="flex items-center justify-center py-6">
                                                            <RefreshCw size={16} className="animate-spin text-primary/50" />
                                                        </div>
                                                    ) : (activityLogs[task.id] || []).length === 0 ? (
                                                        <div className="text-center py-6 text-muted-foreground/40">
                                                            <Activity size={20} className="mx-auto mb-1.5 opacity-30" />
                                                            <p className="text-[11px]">No activity yet — click an action above to start</p>
                                                        </div>
                                                    ) : (
                                                        <div className="relative pl-5 space-y-0 max-h-[300px] overflow-y-auto pr-1">
                                                            <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-primary/30 via-border/30 to-transparent" />
                                                            {(activityLogs[task.id] || []).map((log) => (
                                                                <div key={log.id} className="relative flex items-start gap-3 py-2 group/log">
                                                                    <div className={cn(
                                                                        "absolute -left-5 top-3 w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center bg-background",
                                                                        log.action === 'complete' ? 'border-emerald-500' :
                                                                        log.action === 'error' ? 'border-red-500' :
                                                                        log.action === 'send_email' ? 'border-emerald-400' :
                                                                        log.action === 'hunt_email' ? 'border-cyan-400' :
                                                                        log.action === 'discover' ? 'border-blue-400' :
                                                                        'border-border'
                                                                    )}>
                                                                        <div className={cn(
                                                                            "w-1.5 h-1.5 rounded-full",
                                                                            log.action === 'complete' ? 'bg-emerald-500' :
                                                                            log.action === 'error' ? 'bg-red-500' :
                                                                            log.action === 'send_email' ? 'bg-emerald-400' :
                                                                            log.action === 'hunt_email' ? 'bg-cyan-400' :
                                                                            log.action === 'discover' ? 'bg-blue-400' :
                                                                            'bg-border'
                                                                        )} />
                                                                    </div>
                                                                    <div className={cn("flex-1 rounded-lg border px-3 py-2 transition-all", getActionColor(log.action))}>
                                                                        <div className="flex items-start justify-between gap-2">
                                                                            <div className="flex items-center gap-1.5 min-w-0">
                                                                                {getActionIcon(log.action)}
                                                                                <p className="text-xs text-foreground/80 truncate">{log.message}</p>
                                                                            </div>
                                                                            <span className="text-[9px] text-muted-foreground/50 whitespace-nowrap flex-shrink-0">
                                                                                {formatTime(log.created_at)}
                                                                            </span>
                                                                        </div>
                                                                        {log.details && (() => {
                                                                            try {
                                                                                const d = JSON.parse(log.details);
                                                                                const keys = Object.keys(d);
                                                                                if (keys.length === 0) return null;
                                                                                return (
                                                                                    <div className="flex gap-3 mt-1 flex-wrap">
                                                                                        {keys.map(k => (
                                                                                            <span key={k} className="text-[9px] text-muted-foreground/60">
                                                                                                {k}: <span className="text-foreground/60 font-medium">{String(d[k])}</span>
                                                                                            </span>
                                                                                        ))}
                                                                                    </div>
                                                                                );
                                                                            } catch { return null; }
                                                                        })()}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                                )}

                                                {task.output && (
                                                    <div className="mt-2 p-3 bg-background/40 rounded-xl border border-border/20">
                                                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">Output</p>
                                                        <p className="text-xs text-foreground/80 whitespace-pre-wrap leading-relaxed">{task.output}</p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Content Pipeline View */}
            {activeView === 'content_pipeline' && (
                <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">Manage your content research and publishing queues.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Queued Column */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between pb-2 border-b border-border/30">
                                <h3 className="text-sm font-semibold flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-slate-500" /> Queued
                                </h3>
                                <span className="text-xs bg-secondary px-2 py-0.5 rounded-md text-muted-foreground font-medium">
                                    {tasks.filter(t => t.type === 'content_creation' && t.status === 'queued' && !t.input).length}
                                </span>
                            </div>
                            <div className="space-y-3">
                                {tasks.filter(t => t.type === 'content_creation' && t.status === 'queued' && !t.input).map(task => (
                                    <div key={task.id} className="bg-secondary/20 p-3 rounded-xl border border-border/30 hover:border-primary/20 transition-all">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className={cn("w-2 h-2 rounded-full shrink-0 shadow-sm", getPriorityDot(task.priority))} title={task.priority} />
                                            <p className="font-medium text-xs leading-snug">
                                                <span className="text-primary/80 font-mono text-xs mr-1.5 font-bold">#{task.id}</span>
                                                {task.title}
                                            </p>
                                        </div>
                                        <div className="flex justify-end">
                                            <button onClick={() => { setActiveView('tasks'); setExpandedTask(task.id); }} className="text-[10px] px-2 py-1 bg-blue-500/10 text-blue-400 rounded-md border border-blue-500/20 hover:bg-blue-500/20 transition-colors">Start Research →</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Researching Column */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between pb-2 border-b border-border/30">
                                <h3 className="text-sm font-semibold flex items-center gap-2 text-blue-400">
                                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" /> Researching
                                </h3>
                                <span className="text-xs bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-md text-blue-400 font-medium">
                                    {tasks.filter(t => t.type === 'content_creation' && t.status === 'in_progress').length}
                                </span>
                            </div>
                            <div className="space-y-3">
                                {tasks.filter(t => t.type === 'content_creation' && t.status === 'in_progress').map(task => (
                                    <div key={task.id} className="bg-blue-500/5 p-3 rounded-xl border border-blue-500/20">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className={cn("w-2 h-2 rounded-full shrink-0 shadow-sm", getPriorityDot(task.priority))} title={task.priority} />
                                            <p className="font-medium text-xs leading-snug truncate">
                                                <span className="text-sm font-bold text-primary/80 mr-1.5">#{task.id}</span>
                                                {task.title}
                                            </p>
                                        </div>
                                        <p className="text-[10px] text-blue-400/80 italic">Alex is gathering data...</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Research Ready Column */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between pb-2 border-b border-emerald-500/30">
                                <h3 className="text-sm font-semibold flex items-center gap-2 text-emerald-400">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" /> Ready to Publish
                                </h3>
                                <span className="text-xs bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md text-emerald-400 font-medium">
                                    {tasks.filter(t => t.type === 'content_creation' && t.status === 'completed' && t.input).length}
                                </span>
                            </div>
                            <div className="space-y-3">
                                {tasks.filter(t => t.type === 'content_creation' && t.status === 'completed' && t.input)
                                    .sort((a, b) => {
                                        const p: Record<string, number> = { urgent: 3, high: 2, medium: 1, low: 0 };
                                        return (p[b.priority] || 0) - (p[a.priority] || 0);
                                    })
                                    .map(task => (
                                    <div key={task.id} className="bg-emerald-500/5 p-3 rounded-xl border border-emerald-500/20 hover:border-emerald-500/40 transition-all hover:shadow-[0_4px_20px_-5px_rgba(16,185,129,0.15)] group">
                                        <div className="flex items-start gap-2 mb-3">
                                            <div className={cn("w-2 h-2 rounded-full shrink-0 shadow-sm mt-1", getPriorityDot(task.priority))} title={task.priority} />
                                            <p className="font-medium text-xs leading-snug">{task.title}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => { setActiveView('tasks'); setExpandedTask(task.id); }} className="flex-1 text-[10px] px-2 py-1.5 bg-secondary text-muted-foreground rounded-lg border border-border/50 hover:bg-secondary/80 transition-colors">View Info</button>
                                            <button 
                                                onClick={() => {
                                                    alert("Simulating publication check... Post published successfully to analyzeinsta.com!");
                                                    setTasks(prev => prev.map(t => t.id === task.id ? {
                                                        ...t,
                                                        output: "Successfully published post to live blog database."
                                                    } : t));
                                                    incrementEmployeeTaskCount("ContentWriter");
                                                }}
                                                className="flex-[2] text-[10px] px-2 py-1.5 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-lg border border-primary/30 hover:shadow-[0_0_10px_rgba(139,92,246,0.3)] transition-all font-semibold flex items-center justify-center gap-1"
                                            >
                                                <Rocket size={10} /> Publish
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ═══ RESEARCH BRIEF MODAL ═══ */}
            {expandedResearch && researchContent && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center p-6 overflow-y-auto" onClick={() => setExpandedResearch(false)}>
                    <div className="bg-background border border-border/40 rounded-2xl w-full max-w-4xl shadow-2xl mt-12" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between p-6 border-b border-border/20">
                            <div>
                                <h2 className="text-xl font-bold text-foreground">Alex's Research Dossier</h2>
                                <p className="text-sm text-muted-foreground mt-1">Topic: <span className="text-cyan-400 font-medium">{researchContent.topic}</span></p>
                            </div>
                            <button onClick={() => setExpandedResearch(false)} className="p-2 rounded-lg hover:bg-secondary/50 transition-colors text-muted-foreground hover:text-foreground">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
                            {researchContent.content.split(/---\s*Source:\s*/).filter(Boolean).map((block, i) => {
                                const titleMatch = block.match(/^(.+?)\s*\((.+?)\)\s*---/);
                                const isSource = !!titleMatch;
                                return (
                                    <div key={i} className="rounded-xl border border-border/30 bg-secondary/20 p-5">
                                        {isSource ? (
                                            <>
                                                <div className="flex items-start justify-between gap-3 mb-3">
                                                    <h3 className="text-base font-bold text-foreground leading-snug">{titleMatch[1].trim()}</h3>
                                                    <a href={titleMatch[2].trim()} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:underline flex-shrink-0 mt-0.5">↗ source link</a>
                                                </div>
                                                <p className="text-sm leading-relaxed text-foreground/70 whitespace-pre-wrap">{block.replace(/^.+?---\n?/, '').trim()}</p>
                                            </>
                                        ) : (
                                            <p className="text-sm leading-relaxed text-foreground/70 whitespace-pre-wrap">{block.trim()}</p>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
