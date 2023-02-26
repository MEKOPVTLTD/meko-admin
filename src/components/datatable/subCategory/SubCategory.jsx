import "../../../pages/list/list.scss"
import Sidebar from "../../sidebar/Sidebar"
import Navbar from "../../navbar/Navbar"
import SubCategoryTable from "./SubCategoryTable";

const SubCategories = () => {
  return (
    <div className="list">
      <Sidebar/>
      <div className="listContainer">
        <Navbar/>
        <SubCategoryTable/>
      </div>
    </div>
  )
}

export default SubCategories