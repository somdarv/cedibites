'use client';

import { useState, useMemo, useEffect } from 'react';
import { useAdminDashboard } from '@/lib/api/hooks/useAdminDashboard';
import { useAnalytics } from '@/lib/api/hooks/useAnalytics';
import { STATUS_CONFIG } from '@/app/staff/orders/constants';
import Link from 'next/link';
import {
    CurrencyCircleDollarIcon,
    ReceiptIcon,
    CircleNotchIcon,
    XCircleIcon,
    TrendUpIcon,
    ArrowUpIcon,
    ArrowDownIcon,
    ArrowUpRightIcon,
    ListIcon,
    DownloadSimpleIcon,
    WifiHighIcon,
    DatabaseIcon,
    ClockIcon,
    CheckCircleIcon,
} from '@phosphor-icons/react';
import { useOrderStore } from '@/app/components/providers/OrderStoreProvider';


function greeting() {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
}

function formatGHS(v: number) {
    return `₵${v.toLocaleString('en-GH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

type OrderSource = 'WhatsApp' | 'Phone' | 'Online' | 'POS' | 'Instagram' | 'Facebook';


const SOURCE_COLORS: Record<OrderSource, string> = {
    WhatsApp: 'bg-[#25D366]/10 text-[#128C7E]',
    Instagram: 'bg-pink-50 text-pink-600',
    Facebook: 'bg-blue-50 text-blue-600',
    Phone: 'bg-neutral-light text-neutral-gray',
    Online: 'bg-primary/10 text-primary',
    POS: 'bg-secondary/10 text-secondary',
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function KpiCard({
    icon: Icon,
    label,
    value,
    trend,
    sub,
    subAlert,
    accent = false,
}: {
    icon: React.ElementType;
    label: string;
    value: string;
    trend: number;
    sub?: string;
    subAlert?: string;
    accent?: boolean;
}) {
    const up = trend >= 0;
    return (
        <div className={`rounded-2xl px-5 py-4 flex flex-col gap-2 ${accent ? 'bg-primary' : 'bg-neutral-card border border-[#f0e8d8]'}`}>
            <div className="flex items-center gap-2">
                <Icon size={14} weight="fill" className={accent ? 'text-white/70' : 'text-neutral-gray'} />
                <span className={`text-[10px] font-bold font-body uppercase tracking-widest ${accent ? 'text-white/80' : 'text-neutral-gray'}`}>{label}</span>
            </div>
            <p className={`text-2xl font-bold font-body leading-none ${accent ? 'text-white' : 'text-text-dark'}`}>{value}</p>
            {sub && <p className={`text-xs font-body ${accent ? 'text-white/70' : 'text-neutral-gray'}`}>{sub}</p>}
            {subAlert && <p className="text-xs font-semibold font-body text-orange-500">{subAlert}</p>}
            <div className="flex items-center gap-1">
                {up
                    ? <ArrowUpIcon size={11} weight="bold" className={accent ? 'text-white/70' : 'text-secondary'} />
                    : <ArrowDownIcon size={11} weight="bold" className={accent ? 'text-white/70' : 'text-error'} />
                }
                <span className={`text-xs font-semibold font-body ${accent ? 'text-white/80' : (up ? 'text-secondary' : 'text-error')}`}>
                    {Math.abs(trend)}% vs last week
                </span>
            </div>
        </div>
    );
}

function BranchStatusDot({ status }: { status: 'open' | 'closed' | 'busy' }) {
    const cfg = {
        open: { color: 'bg-secondary', label: 'Open' },
        closed: { color: 'bg-error', label: 'Closed' },
        busy: { color: 'bg-warning', label: 'Busy' },
    }[status];
    return (
        <span className="inline-flex items-center gap-1">
            <span className={`w-2 h-2 rounded-full ${cfg.color} animate-pulse`} />
            <span className="text-[10px] font-body font-medium text-neutral-gray">{cfg.label}</span>
        </span>
    );
}

function Sparkline({ data }: { data: number[] }) {
    const max = Math.max(...data);
    const w = 60;
    const h = 24;
    const pts = data.map((v, i) => {
        const x = (i / (data.length - 1)) * w;
        const y = h - (v / max) * h;
        return `${x},${y}`;
    }).join(' ');
    return (
        <svg width={w} height={h} className="shrink-0">
            <polyline
                points={pts}
                fill="none"
                stroke="#e49925"
                strokeWidth="1.5"
                strokeLinejoin="round"
                strokeLinecap="round"
            />
        </svg>
    );
}

function SourceBadge({ source }: { source: OrderSource }) {
    return (
        <span className={`text-[10px] font-medium font-body px-2 py-0.5 rounded-full ${SOURCE_COLORS[source]}`}>
            {source}
        </span>
    );
}

function StatusDot({ status }: { status: string }) {
    const cfg = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.received;
    return (
        <span className="inline-flex items-center gap-1.5 text-xs font-body font-medium text-text-dark">
            <span className={`h-2 w-2 rounded-full shrink-0 ${cfg.dot} ${cfg.pulse ? 'animate-pulse' : ''}`} />
            {cfg.label}
        </span>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminDashboardPage() {
    const [_refresh] = useState(0);
    const [mounted, setMounted] = useState(false);
    const { orders } = useOrderStore();
    const { userName, kpis, branches, liveOrders, isLoading } = useAdminDashboard();
    const { sales } = useAnalytics('week');
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-GH', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    useEffect(() => {
        setMounted(true);
    }, []);

    const startOfDay = useMemo(() => {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        return d.getTime();
    }, []);

    const liveKpis = useMemo(() => {
        const todayOrders = orders.filter(o => o.placedAt >= startOfDay);
        const cancelledToday = todayOrders.filter(o => o.status === 'cancelled' || o.status === 'cancel_requested');
        const activeStatuses = new Set(['received', 'accepted', 'preparing', 'ready', 'out_for_delivery', 'ready_for_pickup', 'cancel_requested']);
        return {
            revenueToday: todayOrders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0),
            ordersToday: todayOrders.length,
            activeOrders: todayOrders.filter(o => activeStatuses.has(o.status)).length,
            cancelledToday: cancelledToday.length,
            cancelledValue: cancelledToday.reduce((s, o) => s + o.total, 0),
            cancelReqCount: orders.filter(o => o.status === 'cancel_requested').length,
        };
    }, [orders, startOfDay]);

    const displayKpis = {
        revenueToday: kpis?.revenue_today ?? liveKpis.revenueToday,
        ordersToday: kpis?.orders_today ?? liveKpis.ordersToday,
        activeOrders: kpis?.active_orders ?? liveKpis.activeOrders,
        cancelledToday: kpis?.cancelled_today ?? liveKpis.cancelledToday,
    };

    // Prevent hydration mismatch by only showing dynamic content after mount
    if (!mounted) {
        return (
            <div className="px-4 md:px-8 py-6 max-w-6xl mx-auto">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-7">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-24 bg-gray-200 rounded-2xl"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="px-4 md:px-8 py-6 max-w-6xl mx-auto">

            {/* ── Header ──────────────────────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-7">
                <div>
                    <h1 className="text-text-dark text-2xl font-bold font-body">
                        {greeting()}, {userName}
                    </h1>
                    <p className="text-neutral-gray text-sm font-body mt-1 flex items-center gap-2">
                        {dateStr}
                        <span className="inline-flex items-center gap-1 text-secondary">
                            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                            All branches operational
                        </span>
                    </p>
                </div>
                <button
                    type="button"
                    className="flex items-center gap-2 px-4 py-2 bg-neutral-card border border-[#f0e8d8] rounded-xl text-text-dark text-sm font-medium font-body hover:border-primary/40 transition-colors cursor-pointer shrink-0"
                >
                    <DownloadSimpleIcon size={16} weight="bold" className="text-primary" />
                    Export today&apos;s report
                </button>
            </div>

            {/* ── Cross-branch KPI row ─────────────────────────────────────────── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-7">
                <KpiCard icon={CurrencyCircleDollarIcon} label="Revenue Today" value={isLoading ? '…' : formatGHS(displayKpis.revenueToday)} trend={0} accent />
                <KpiCard icon={ReceiptIcon} label="Orders Today" value={isLoading ? '…' : String(displayKpis.ordersToday)} trend={0} />
                <KpiCard icon={CircleNotchIcon} label="Active Now" value={isLoading ? '…' : String(displayKpis.activeOrders)} trend={0} />
                <KpiCard
                    icon={XCircleIcon}
                    label="Cancelled Today"
                    value={isLoading ? '…' : String(displayKpis.cancelledToday)}
                    sub={liveKpis.cancelledToday > 0 ? formatGHS(liveKpis.cancelledValue) + ' lost' : undefined}
                    subAlert={liveKpis.cancelReqCount > 0 ? `${liveKpis.cancelReqCount} pending approval` : undefined}
                    trend={0}
                />
            </div>

            {/* ── Branch performance strip ─────────────────────────────────────── */}
            <div className="mb-7">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-text-dark font-bold text-sm font-body uppercase tracking-wider">Branch Performance</h2>
                    <Link href="/admin/branches" className="text-primary text-xs font-body hover:text-primary-hover flex items-center gap-1 transition-colors">
                        <ArrowUpRightIcon size={13} weight="bold" />
                        Manage branches
                    </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {branches.map((branch) => (
                        <Link
                            key={branch.id}
                            href={`/admin/analytics?branch=${branch.id}`}
                            className="bg-neutral-card border border-[#f0e8d8] rounded-2xl px-4 py-4 flex flex-col gap-2 hover:border-primary/30 hover:shadow-sm transition-all group"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-text-dark text-sm font-bold font-body">{branch.name}</span>
                                <BranchStatusDot status={(branch.status as 'open') || 'open'} />
                            </div>
                            <div className="flex items-end justify-between gap-3">
                                <div>
                                    <p className="text-primary text-lg font-bold font-body leading-none">{formatGHS(branch.revenue_today ?? 0)}</p>
                                    <p className="text-neutral-gray text-xs font-body mt-1">{branch.orders_today ?? 0} orders today</p>
                                </div>
                                <Sparkline data={[40, 55, 70, 62, 80, 95, 88]} />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* ── Revenue chart (7-day) ────────────────────────────────────────── */}
            <RevenueChart salesByDay={sales?.sales_by_day} />

            {/* ── Live order feed ──────────────────────────────────────────────── */}
            <div className="mb-7">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-text-dark font-bold text-sm font-body uppercase tracking-wider">Live Order Feed</h2>
                    <Link href="/admin/orders" className="text-primary text-xs font-body hover:text-primary-hover flex items-center gap-1 transition-colors">
                        <ListIcon size={13} />
                        View all orders
                    </Link>
                </div>
                <div className="bg-neutral-card border border-[#f0e8d8] rounded-2xl overflow-hidden">
                    <div className="hidden md:grid grid-cols-[1.5fr_1fr_1fr_1.2fr_1fr_1fr] gap-4 px-4 py-3 border-b border-[#f0e8d8] bg-[#faf6f0]">
                        {['Customer', 'Branch', 'Source', 'Status', 'Time', 'Amount'].map(h => (
                            <span key={h} className="text-neutral-gray text-[10px] font-bold font-body uppercase tracking-wider">{h}</span>
                        ))}
                    </div>
                    {liveOrders.length === 0 && !isLoading ? (
                        <div className="px-4 py-8 text-center text-neutral-gray text-sm font-body">No active orders</div>
                    ) : (
                        liveOrders.map((order, i) => (
                            <div
                                key={order.id}
                                className={`px-4 py-3 flex flex-col md:grid md:grid-cols-[1.5fr_1fr_1fr_1.2fr_1fr_1fr] gap-2 md:gap-4 md:items-center hover:bg-neutral-light/60 transition-colors ${i < liveOrders.length - 1 ? 'border-b border-[#f0e8d8]' : ''}`}
                            >
                                <div className="min-w-0">
                                    <p className="text-text-dark text-sm font-semibold font-body truncate">{order.customer}</p>
                                    <p className="text-neutral-gray text-xs font-body">#{order.id}</p>
                                </div>
                                <span className="text-text-dark text-xs font-body">{order.branch}</span>
                                <SourceBadge source={order.source as OrderSource} />
                                <StatusDot status={order.status} />
                                <span className="text-neutral-gray text-xs font-body">{order.time_ago} ago</span>
                                <span className="text-text-dark text-sm font-bold font-body">₵{order.amount}</span>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* ── System health ────────────────────────────────────────────────── */}
            <SystemHealth />

        </div>
    );
}

// ─── Revenue chart ────────────────────────────────────────────────────────────

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const BRANCH_REVENUE: Record<string, number[]> = {
    'Osu': [2800, 3100, 2600, 3400, 3200, 4100, 2100],
    'East Legon': [3100, 3400, 2900, 3800, 3500, 4600, 2400],
    'Spintex': [1200, 1400, 1100, 1600, 1500, 2000, 1000],
};

const BRANCH_COLORS = ['#e49925', '#6c833f', '#c8a87a'];

function RevenueChart({ salesByDay }: { salesByDay?: Array<{ date: string; total: number; orders: number }> }) {
    const [stacked, setStacked] = useState(true);
    const branches = Object.keys(BRANCH_REVENUE);
    const totals = DAYS.map((_, i) => branches.reduce((s, b) => s + BRANCH_REVENUE[b][i], 0));
    const maxVal = stacked ? Math.max(...totals, 1) : Math.max(...Object.values(BRANCH_REVENUE).flat(), 1);
    const weekTotal = salesByDay?.length
        ? salesByDay.reduce((s, d) => s + Number(d.total), 0)
        : totals.reduce((a, b) => a + b, 0);

    const dayLabels = salesByDay?.length
        ? salesByDay.map((d) => DAYS[(new Date(d.date).getDay() + 6) % 7] ?? d.date)
        : DAYS;
    const values = salesByDay?.length
        ? salesByDay.map((d) => Number(d.total))
        : totals;
    const chartMax = salesByDay?.length ? Math.max(...values, 1) : maxVal;

    return (
        <div className="bg-neutral-card border border-[#f0e8d8] rounded-2xl p-5 mb-7">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                <div>
                    <p className="text-text-dark text-sm font-bold font-body">Revenue — All Branches (7 days)</p>
                    <p className="text-primary text-base font-bold font-body mt-0.5">{formatGHS(weekTotal)}</p>
                </div>
                {!salesByDay?.length && (
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setStacked(true)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-body transition-all cursor-pointer ${stacked ? 'bg-primary text-white' : 'bg-neutral-light text-neutral-gray hover:text-text-dark'}`}
                        >
                            Stacked
                        </button>
                        <button
                            type="button"
                            onClick={() => setStacked(false)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-body transition-all cursor-pointer ${!stacked ? 'bg-primary text-white' : 'bg-neutral-light text-neutral-gray hover:text-text-dark'}`}
                        >
                            Grouped
                        </button>
                    </div>
                )}
            </div>

            <div className="flex items-end gap-2 h-32">
                {salesByDay?.length ? (
                    dayLabels.map((day, di) => {
                        const val = values[di] ?? 0;
                        const h = Math.round((val / chartMax) * 112) || 4;
                        return (
                            <div key={`${day}-${di}`} className="flex-1 flex flex-col items-center gap-1">
                                <div className="w-full rounded-sm bg-primary/85" style={{ height: h, minHeight: 4, transition: 'height 0.3s ease' }} />
                                <span className="text-[9px] text-neutral-gray font-body">{day}</span>
                            </div>
                        );
                    })
                ) : (
                    DAYS.map((day, di) => (
                        <div key={day} className="flex-1 flex flex-col items-center gap-1">
                            <div className={`w-full flex ${stacked ? 'flex-col-reverse' : 'flex-row'} items-end gap-0.5`} style={{ height: 112 }}>
                                {branches.map((b, bi) => {
                                    const val = BRANCH_REVENUE[b][di];
                                    const h = Math.round((val / maxVal) * 112);
                                    return (
                                        <div
                                            key={`${b}-${bi}`}
                                            className="rounded-sm"
                                            style={{
                                                height: h,
                                                width: stacked ? '100%' : `${100 / branches.length}%`,
                                                background: BRANCH_COLORS[bi],
                                                opacity: 0.85,
                                                transition: 'height 0.3s ease',
                                                flexShrink: 0,
                                            }}
                                        />
                                    );
                                })}
                            </div>
                            <span className="text-[9px] text-neutral-gray font-body">{day}</span>
                        </div>
                    ))
                )}
            </div>

            {!salesByDay?.length && (
                <div className="flex gap-4 mt-4">
                    {branches.map((b, bi) => (
                        <div key={`${b}-${bi}`} className="flex items-center gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-sm" style={{ background: BRANCH_COLORS[bi] }} />
                            <span className="text-[11px] text-neutral-gray font-body">{b}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// ─── System health panel ──────────────────────────────────────────────────────

function SystemHealth() {
    const items = [
        { icon: CheckCircleIcon, label: 'Hubtel API', value: 'Connected', color: 'text-secondary' },
        { icon: WifiHighIcon, label: 'WebSocket', value: '3 active', color: 'text-secondary' },
        { icon: DatabaseIcon, label: 'Database', value: '42ms', color: 'text-secondary' },
        { icon: ClockIcon, label: 'Last order', value: '2 mins ago', color: 'text-neutral-gray' },
    ];
    return (
        <div className="bg-neutral-card border border-[#f0e8d8] rounded-2xl px-4 py-4 flex flex-wrap gap-4">
            <p className="text-neutral-gray text-xs font-bold font-body uppercase tracking-wider w-full mb-1">System Health</p>
            {items.map(({ icon: Icon, label, value, color }) => (
                <div key={label} className="flex items-center gap-2">
                    <Icon size={14} weight="fill" className={color} />
                    <span className="text-neutral-gray text-xs font-body">{label}:</span>
                    <span className={`text-xs font-semibold font-body ${color}`}>{value}</span>
                </div>
            ))}
        </div>
    );
}
