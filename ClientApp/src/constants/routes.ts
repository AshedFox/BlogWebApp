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
    createPost: "/createPost"
}

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
        path: routes.posts + "/:page?",
        component: PostsPage
    }
]

export const privateRoutes = [
    {
        path: routes.createPost,
        component: CreatePostPage
    },
]
