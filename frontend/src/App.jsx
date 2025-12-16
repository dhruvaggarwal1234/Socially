import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "antd/dist/reset.css";

import RootLayout from "./RootLayout";
import ProtectedRoute from "./routes/ProtectedRoute";

// Pages
import Home from "./pages/Home";
import MessagesList from "./components/MessagesList";
import Messages from "./pages/Messages";
import Bookmarks from "./pages/Bookmarks";
import Profile from "./pages/Profile";
import SinglePost from "./pages/SinglePost";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Logout from "./pages/Logout";
import ErrorPage from "./pages/ErrorPage";

import { Provider } from "react-redux";
import store from "./store/store";

const router = createBrowserRouter([
  {
    element: <ProtectedRoute />, 
    children: [
      {
        path: "/",
        element: <RootLayout />,
        errorElement: <ErrorPage />,
        children: [
          { index: true, element: <Home /> },
          { path: "messages", element: <MessagesList /> },
          { path: "messages/:receiverId", element: <Messages /> },
          { path: "bookmarks", element: <Bookmarks /> },
          { path: "users/:id", element: <Profile /> },
          { path: "posts/:id", element: <SinglePost /> },
        ],
      },
    ],
  },

  
 
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
    

  { path: "/logout", element: <Logout /> },
]);

function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;
