export const userColumns = [
  { field: "id", headerName: "ID", width: 70 },
  {
    field: "user",
    headerName: "Name",
    width: 150,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          {params.row.name}
        </div>
      );
    },
  },
  {
    field: "email",
    headerName: "Email",
    width: 230,
  },
  {
    field: "gender",
    headerName: "Gender",
    width: 100,
  },
  {
    field: "phone",
    headerName: "Phone",
    width: 150,
  },

  {
    field: "addressBook",
    headerName: "Address",
    width: 350,
    renderCell: params => {

      return(
         <div>
           {params.row.addressBook.map(address => {
             console.log(address);
             return(
                 <div>
                   <div>
                     {address.name + ", " + address.street+ ", " + address.locality}
                   </div>
                   <div>
                     {address.administrativeArea + ", " + address.country  + ", " + address.postalCode}
                   </div>
                 </div>
             )
           })}
         </div>
      )
    }
  }
];
