// app/components/order/OrderTimeline.tsx
'use client';

import { CheckCircleIcon } from '@phosphor-icons/react';
import type { OrderTimelineEvent } from '@/types/order';
import { formatTime } from '@/types/order';

interface OrderTimelineProps {
    timeline: OrderTimelineEvent[];
}

export default function OrderTimeline({ timeline }: OrderTimelineProps) {
    return (
        <div className="relative">
            {timeline.map((event, index) => {
                const isLast = index === timeline.length - 1;

                return (
                    <div key={event.status} className="relative pb-8 last:pb-0">
                        {/* Connecting Line */}
                        {!isLast && (
                            <div className={`absolute left-[19px] top-10 w-0.5 h-full ${
                                event.done ? 'bg-primary' : 'bg-neutral-gray/20'
                            }`} />
                        )}

                        {/* Content */}
                        <div className="relative flex items-start gap-4">
                            {/* Icon */}
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all ${
                                event.active
                                    ? 'bg-primary ring-4 ring-primary/20'
                                    : event.done
                                    ? 'bg-primary'
                                    : 'bg-neutral-gray/10'
                            }`}>
                                {event.done || event.active ? (
                                    <CheckCircleIcon
                                        size={20}
                                        weight="fill"
                                        className="text-white"
                                    />
                                ) : (
                                    <div className="w-2 h-2 rounded-full bg-neutral-gray" />
                                )}
                            </div>

                            {/* Text */}
                            <div className="flex-1 min-w-0 pt-1">
                                <div className="flex items-baseline justify-between gap-2 mb-1">
                                    <h3 className={`font-semibold ${
                                        event.active
                                            ? 'text-primary'
                                            : 'text-text-dark dark:text-text-light'
                                    }`}>
                                        {event.label}
                                    </h3>
                                    {event.timestamp && (
                                        <span className="text-xs text-neutral-gray shrink-0">
                                            {formatTime(event.timestamp)}
                                        </span>
                                    )}
                                </div>
                                <p className={`text-sm ${
                                    event.active ? 'text-text-dark dark:text-text-light' : 'text-neutral-gray'
                                }`}>
                                    {event.description}
                                </p>

                                {/* Active indicator */}
                                {event.active && (
                                    <div className="flex items-center gap-2 mt-2">
                                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                        <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                                            Current Status
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
