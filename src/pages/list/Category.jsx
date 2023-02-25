import "./list.scss"
import Sidebar from "../../components/sidebar/Sidebar"
import Navbar from "../../components/navbar/Navbar"
import CategoryTable from "../../components/datatable/CategoryTable";

const Categories = () => {
  return (
    <div className="list">
      <Sidebar/>
      <div className="listContainer">
        <Navbar/>
        <CategoryTable/>
      </div>
    </div>
  )
}

export default Categories