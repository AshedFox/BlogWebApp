import LoginPage from "../components/LoginPage/LoginPage";
import SignUpPage from "../components/SignUpPage/SignUpPage";
import MainPage from "../components/MainPage/MainPage";
import PostsPage from "../components/PostsPage/PostsPage";
import PostPage from "../components/PostPage/PostPage";
import CreatePostPage from "../components/CreatePostPage/CreatePostPage";
import ProfilePage from "../components/ProfilePage/ProfilePage";

export const routes = {
    login: "/login",
    signUp: "/signUp",
    profile: "/profile",
    main: "/",
    posts: "/posts",
    post: "/post",
    createPost: "/create"
}

export const noAuthRoutes = [
    {
        path: routes.login,
        component: LoginPage
    },
    {
        path: routes.signUp,
        component: SignUpPage
    },
]

export const publicRoutes = [
    {
        path: routes.post + "/:id",
        component: PostPage
    },
    {
        path: routes.profile + "/:id",
        component: ProfilePage
    },
    {
        path: routes.main,
        component: MainPage
    },
    {
        path: routes.posts + "/:page?",
        component: PostsPage
    },
]

export const privateRoutes = [
    {
        path: routes.createPost,
        component: CreatePostPage
    },
]
