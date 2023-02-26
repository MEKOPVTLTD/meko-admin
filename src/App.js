import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Users from "./pages/list/Users";
import Single from "./pages/single/Single";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./style/dark.scss";
import { useContext } from "react";
import { DarkModeContext } from "./context/darkModeContext";
import { AuthContext } from "./context/AuthContext";
import Categories from "./components/datatable/category/Category";
import New from "./pages/new/New";
import {CATEGORY_COLLECTION} from "./firebase";
import {categoryInput} from "./components/datatable/category/categoryForm";
import SubCategories from "./components/datatable/subCategory/SubCategory";

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
            </Route>
            <Route path="category">
                  <Route
                      index
                      element={
                          <RequireAuth>
                              <Categories/>
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
                              <New inputs={categoryInput} title="Add New Category" collectionName = {CATEGORY_COLLECTION}/>
                          </RequireAuth>
                      }
                  />
              </Route>
            <Route path="subCategory">
                  <Route
                      index
                      element={
                          <RequireAuth>
                              <SubCategories/>
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
                              <New inputs={categoryInput} title="Add New Sub Category" collectionName = {CATEGORY_COLLECTION}/>
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
