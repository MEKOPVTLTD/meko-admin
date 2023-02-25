import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Users from "./pages/list/Users";
import Single from "./pages/single/Single";
import UserNew from "./pages/new/UserNew";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { productInputs, userInputs } from "./formSource";
import "./style/dark.scss";
import { useContext } from "react";
import { DarkModeContext } from "./context/darkModeContext";
import { AuthContext } from "./context/AuthContext";

function App() {
  const { darkMode } = useContext(DarkModeContext);

  const {currentUser} = useContext(AuthContext)

  const RequireAuth = ({ children }) => {
    return currentUser ? children : <Navigate to="/login" />;
  };

  return (
    <div className={darkMode ? "app dark" : "app"}>
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route path="login" element={<Login />} />
            <Route
              index
              element={
                <RequireAuth>
                  <Home />
                </RequireAuth>
              }
            />
            <Route path="users">
              <Route
                index
                element={
                  <RequireAuth>
                    <Users/>
                  </RequireAuth>
                }
              />
              <Route
                path=":userId"
                element={
                  <RequireAuth>
                    <Single />
                  </RequireAuth>
                }
              />
              <Route
                path="new"
                element={
                  <RequireAuth>
                    <UserNew inputs={userInputs} title="Add UserNew User" />
                  </RequireAuth>
                }
              />
            </Route>
            <Route path="categories">
                  <Route
                      index
                      element={
                          <RequireAuth>
                              <Users/>
                          </RequireAuth>
                      }
                  />
                  <Route
                      path=":categoryId"
                      element={
                          <RequireAuth>
                              <Single />
                          </RequireAuth>
                      }
                  />
                  <Route
                      path="new"
                      element={
                          <RequireAuth>
                              <UserNew inputs={userInputs} title="Add UserNew Category" />
                          </RequireAuth>
                      }
                  />
              </Route>
            <Route path="products">
              <Route
                index
                element={
                  <RequireAuth>
                    <Users />
                  </RequireAuth>
                }
              />
              <Route
                path=":productId"
                element={
                  <RequireAuth>
                    <Single />
                  </RequireAuth>
                }
              />
              <Route
                path="new"
                element={
                  <RequireAuth>
                    <UserNew inputs={productInputs} title="Add UserNew Product" />
                  </RequireAuth>
                }
              />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
