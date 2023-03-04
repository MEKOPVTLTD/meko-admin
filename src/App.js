import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Users from "./pages/list/Users";
import Single from "./pages/single/Single";
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import "./style/dark.scss";
import {useContext} from "react";
import {DarkModeContext} from "./context/darkModeContext";
import {AuthContext} from "./context/AuthContext";
import Categories from "./components/datatable/category/Category";
import CategoryNew from "./components/datatable/category/CategoryNew";
import {CATEGORY_COLLECTION, PRODUCT_COLLECTION, SUB_CATEGORY_COLLECTION} from "./firebase";
import {categoryInput} from "./components/datatable/category/categoryForm";
import SubCategories from "./components/datatable/subCategory/SubCategory";
import SubCategoryNew from "./components/datatable/subCategory/SubCategoryNew";
import {subCategoryInput} from "./components/datatable/subCategory/subCategoryForm";
import Products from "./components/datatable/products/Product";
import ProductNew from "./components/datatable/products/ProductNew";
import {productInput} from "./components/datatable/products/productForm";

function App() {
    const {darkMode} = useContext(DarkModeContext);

    const {currentUser} = useContext(AuthContext)

    const RequireAuth = ({children}) => {
        return currentUser ? children : <Navigate to="/login"/>;
    };

    return (
        <div className={darkMode ? "app dark" : "app"}>
            <BrowserRouter>
                <Routes>
                    <Route path="/">
                        <Route path="login" element={<Login/>}/>
                        <Route
                            index
                            element={
                                <RequireAuth>
                                    <Home/>
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
                                        <Single/>
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
                                        <CategoryNew inputs={categoryInput}
                                                     title="Edit CategoryNew Category"
                                                     collectionName={CATEGORY_COLLECTION}/>
                                    </RequireAuth>
                                }
                            />
                            <Route
                                path="new"
                                element={
                                    <RequireAuth>
                                        <CategoryNew inputs={categoryInput} title="Add New Category"
                                                     collectionName={CATEGORY_COLLECTION}/>
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
                                        <Single/>
                                    </RequireAuth>
                                }
                            />
                            <Route
                                path="new"
                                element={
                                    <RequireAuth>
                                        <SubCategoryNew inputs={subCategoryInput} title="Add New Sub Category"
                                                        collectionName={SUB_CATEGORY_COLLECTION}/>
                                    </RequireAuth>
                                }
                            />
                        </Route>
                        <Route path="products">
                            <Route
                                index
                                element={
                                    <RequireAuth>
                                        <Products/>
                                    </RequireAuth>
                                }
                            />
                            <Route
                                path=":productId"
                                element={
                                    <RequireAuth>
                                        <Single/>
                                    </RequireAuth>
                                }
                            />
                            <Route
                                path="new"
                                element={
                                    <RequireAuth>
                                        <ProductNew inputs={productInput} title="Add New Product Category"
                                                    collectionName={PRODUCT_COLLECTION}/>
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
