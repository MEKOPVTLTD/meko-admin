import "../../../pages/list/list.scss"
import Sidebar from "../../sidebar/Sidebar"
import Navbar from "../../navbar/Navbar"
import ProductTable from "./ProductTable";

const Products = () => {
  return (
    <div className="list">
      <Sidebar/>
      <div className="listContainer">
        <Navbar/>
        <ProductTable/>
      </div>
    </div>
  )
}

export default Products