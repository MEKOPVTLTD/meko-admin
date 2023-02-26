import CurrencyRupee from '@mui/icons-material/CurrencyRupeeOutlined';

export const productColumns = [
    {field: "name", headerName: "Name", width: 200},
    {field: "type", headerName: "Type", width: 200},
    {
        field: "price",
        headerName: "Price",
        width: 100,
        renderCell: params => {
            return (
                <div className="currencyContainer">
                    <CurrencyRupee className="icon"></CurrencyRupee>
                    <div>{params.row.price}</div>
                </div>
            )
        }
    },
    {
        field: "serviceFor",
        headerName: "Service For",
        width: 150,
        renderCell: (params) => {
            return (
                <div>
                    {params.row.subCategory? params.row.subCategory.serviceFor : "No Sub Category"}
                </div>
            )
        }
    },
    {
        field: "subCategoryName",
        headerName: "Belongs To Sub Category",
        width: 250,
        renderCell: (params) => {
            return (
                <div>
                    {params.row.subCategory? params.row.subCategory.name: "No Sub Category"}
                </div>
            )
        }
    },
    {
        field: "categoryName",
        headerName: "Belongs To Category",
        width: 250,
        renderCell: (params) => {
            return (
                <div>
                    {params.row.category ? params.row.category.name : "No Category"}
                </div>
            )
        }
    }

];
