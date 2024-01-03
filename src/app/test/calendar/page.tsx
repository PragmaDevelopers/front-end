"use client";

import { DateValue } from "@/app/types/KanbanTypes";
import { useState } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';

export default function Page() {
    const [calendarDate, setCalendarDate] = useState<DateValue>(new Date());

    const onDateChange = (newValue: any) => {
        console.log(newValue.toISOString());
        setCalendarDate(newValue);
    }

    return (
        <main className="w-full h-full flex justify-center items-center">
            <div className="flex justify-center items-center flex-col">
                <Calendar onChange={onDateChange} value={calendarDate} />
            </div>
        </main>
    );
}