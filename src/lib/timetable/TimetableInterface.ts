
interface LessonInfoInterface {
    name: string,
    teacher: string,
    cabinet: string,
    canceled: boolean
}

interface LessonInterface {
    number: number,
    start: string,
    end: string,
    info: Array<LessonInfoInterface>
}

interface WeekDayInterface {
    day: string,
    lessons: Array<LessonInterface>
}

interface TimetableInterface {
    week: number,
    days: Array<WeekDayInterface>
}

export { TimetableInterface, WeekDayInterface, LessonInterface, LessonInfoInterface };
