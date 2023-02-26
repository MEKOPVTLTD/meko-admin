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

    {field: "index", headerName: "Index", width: 70}
];
