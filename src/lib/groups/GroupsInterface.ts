interface GroupInterface {
    id: number,
    name: string
}

interface CourseInterface {
    course: number,
    groups: Array<GroupInterface>
}

interface GroupsInterface {
    count: number,
    courses: Array<CourseInterface>
}

export { GroupsInterface, CourseInterface, GroupInterface };