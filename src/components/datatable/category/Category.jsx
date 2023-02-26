import "../../../pages/list/list.scss"
import Sidebar from "../../sidebar/Sidebar"
import Navbar from "../../navbar/Navbar"
import CategoryTable from "./CategoryTable";

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