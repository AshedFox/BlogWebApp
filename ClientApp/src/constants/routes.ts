import LoginPage from "../components/LoginPage/LoginPage";
import SignUpPage from "../components/SignUpPage/SignUpPage";
import MainPage from "../components/MainPage/MainPage";
import PostsPage from "../components/PostsPage/PostsPage";
import PostPage from "../components/PostPage/PostPage";
import CreatePostPage from "../components/CreatePostPage/CreatePostPage";
import ProfilePage from "../components/ProfilePage/ProfilePage";

//TODO: Revise routing (main, posts, post and other pages most likely should be available without login)

export const routes = {
    login: "/login",
    signUp: "/signUp",
    myProfile: "/profile",
    profile: "/profile/:id",
    main: "/",
    posts: "/posts",
    post: "/posts/:id",
    createPost: "/posts/create"
}

export const privateRoutes = [
    {
        path: routes.login,
        component: LoginPage
    },
    {
        path: routes.signUp,
        component: SignUpPage
    }
]

export const publicRoutes = [
    {
        path: routes.myProfile,
        component: ProfilePage
    },
    {
        path: routes.profile,
        component: undefined
    },
    {
        path: routes.main,
        component: MainPage
    },
    {
        path: routes.posts,
        component: PostsPage
    },
    {
        path: routes.createPost,
        component: CreatePostPage
    },
    {
        path: routes.post,
        component: PostPage
    },
]
