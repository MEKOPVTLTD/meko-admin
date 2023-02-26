export const categoryColumns = [
    {field: "name", headerName: "Name", width: 300},
    {
        field: "imageName", headerName: "Image", width: 300,
        renderCell: (params) => {
            return (
                <div className="cellWithImg">
                    <img className="cellImg" src={params.row.imageName} alt="category image" height={300}/>
                    {params.row.username}
                </div>
            );
        },
    },
    {field: "categoryName", headerName: "Belongs To Category", width: 300,
    renderCell: (params) => {
        return(
            <div>
                {params.row.category ? params.row.category.name : "No Category Selected"}
            </div>
        )
    }},

    {field: "serviceFor", headerName: "Service For", width: 300},

    {field: "index", headerName: "Index", width: 70}
];
