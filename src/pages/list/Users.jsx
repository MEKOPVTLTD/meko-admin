import "./list.scss"
import Sidebar from "../../components/sidebar/Sidebar"
import Navbar from "../../components/navbar/Navbar"
import UsersTable from "../../components/datatable/UsersTable"

const Users = () => {
  return (
    <div className="list">
      <Sidebar/>
      <div className="listContainer">
        <Navbar/>
        <UsersTable/>
      </div>
    </div>
  )
}

export default Users