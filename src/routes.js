import Task from "./components/tasks/task";
import TaskList from "./components/tasks/task-list";
import Setting from "./components/settings/setting";

var routes = [
    {
        path: "/setting",
        component: Setting
    },
    {
        path: "/tasks",
        component: TaskList
    },
    {
        path: "/tasks/new",
        component: Task
    },
    {
        path: "/tasks/detail/:id",
        component: Task
    },
];
export default routes;
