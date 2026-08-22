import React, { useEffect, useState } from "react";
import { getAnalytics, getMyTasks } from "../services/api";
import { logout } from "../utils/auth";

import AdminTasks from "./AdminTasks";
import AdminDocuments from "./AdminDocuments";
import Analytics from "./Analytics";
import AIAssistant from "./AIAssistant";

export default function AdminDashboard() {

    const [page, setPage] = useState("dashboard");
    const [tasks, setTasks] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [showAI, setShowAI] = useState(false);


    // Load dashboard data
    const load = async () => {

        try {

            const taskData = await getMyTasks();

            setTasks(taskData);


            try {

                const analyticsData = await getAnalytics();

                setAnalytics(analyticsData);

            } catch (error) {

                console.log("Analytics loading failed:", error);

                setAnalytics(null);

            }

        } catch (error) {

            console.error("Failed to load dashboard:", error);

        }

    };


    useEffect(() => {

        load();

    }, []);


    // -----------------------------
    // PAGE NAVIGATION
    // -----------------------------

    if (page === "tasks") {

        return (
            <AdminTasks
                onBack={() => {

                    setPage("dashboard");

                    load();

                }}
            />
        );

    }


    if (page === "documents") {

        return (
            <AdminDocuments
                onBack={() => setPage("dashboard")}
            />
        );

    }


    if (page === "analytics") {

        return (
            <Analytics
                onBack={() => setPage("dashboard")}
            />
        );

    }


    if (showAI) {

        return (
            <AIAssistant
                onBack={() => setShowAI(false)}
            />
        );

    }


    // -----------------------------
    // ADMIN DASHBOARD
    // -----------------------------

    return (

        <div className="app-page">


            {/* Navbar */}

            <Navbar
                title="TaskFlow"
                badge="ADMIN"
                onLogout={logout}
            />


            {/* Header */}

            <header className="page-header">

                <h1>
                    Admin Dashboard 👨‍💼
                </h1>

                <p>
                    Manage tasks, documents and system activity.
                </p>

            </header>


            {/* Dashboard Cards */}

            <div className="card-grid">


                {/* Task Management */}

                <DashboardCard
                    icon="📋"
                    title="Task Management"
                >

                    <p>
                        Create and assign tasks to users.
                    </p>

                    <button
                        onClick={() => setPage("tasks")}
                    >
                        Manage Tasks →
                    </button>

                </DashboardCard>


                {/* Document Management */}

                <DashboardCard
                    icon="📄"
                    title="Document Management"
                >

                    <p>
                        Upload and manage knowledge documents.
                    </p>

                    <button
                        onClick={() => setPage("documents")}
                    >
                        Manage Documents →
                    </button>

                </DashboardCard>


                {/* AI Assistant */}

                <DashboardCard
                    icon="🤖"
                    title="AI Assistant"
                >

                    <p>
                        Ask questions from your uploaded documents.
                    </p>

                    <button
                        onClick={() => setShowAI(true)}
                    >
                        Ask AI →
                    </button>

                </DashboardCard>


                {/* Analytics */}

                <DashboardCard
                    icon="📊"
                    title="Analytics"
                >

                    <p>
                        View task and document search statistics.
                    </p>

                    <button
                        onClick={() => setPage("analytics")}
                    >
                        View Analytics →
                    </button>

                </DashboardCard>


            </div>


            {/* Summary */}

            <div className="summary-strip">


                <div>

                    <strong>
                        {tasks.length}
                    </strong>

                    <span>
                        Tasks visible
                    </span>

                </div>


                <div>

                    <strong>
                        {analytics?.completed_tasks ?? "-"}
                    </strong>

                    <span>
                        Completed
                    </span>

                </div>


                <div>

                    <strong>
                        {analytics?.pending_tasks ?? "-"}
                    </strong>

                    <span>
                        Pending
                    </span>

                </div>


            </div>


        </div>

    );

}


/*
    Reusable Dashboard Card
*/

function DashboardCard({
    icon,
    title,
    children
}) {

    return (

        <div className="dashboard-card">

            <div className="card-icon">

                {icon}

            </div>


            <h2>

                {title}

            </h2>


            <div className="card-body">

                {children}

            </div>

        </div>

    );

}


/*
    Navbar
*/

function Navbar({
    title,
    badge,
    onLogout
}) {

    return (

        <nav className="navbar">


            <div className="logo">

                <span className="brand-icon small">
                    AI
                </span>


                <strong>
                    {title}
                </strong>


                {badge && (

                    <span className="role-badge">
                        {badge}
                    </span>

                )}

            </div>


            <button
                className="secondary-button"
                onClick={onLogout}
            >
                Logout
            </button>


        </nav>

    );

}