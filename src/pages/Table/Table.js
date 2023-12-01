import React, { useMemo, useEffect, useState } from 'react';
import { MaterialReactTable } from 'material-react-table';
import axios from 'axios';
import { width } from '@mui/system';


export const Table = () => {
  // лучше переименовать свойство
  // для удобочитаемости лучше обозвать что-то в духе columns_table или что-то типа того
    const [dataTable, setDataTable] = useState([])

  const columns =  [
      {
        accessorKey: "n0",
        header: "",
      },
      {
        accessorKey: "n1", 
        header: "Построение трендов ФЕС (карты)"
      },
      {
        accessorKey: "n2",
        header: "Карты трендов"
      },
      {
        accessorKey: "n3",
        header: "Атрибут №4"
      },
      {
        accessorKey: "n4",
        header: "Атрибут №5"
      },
      {
        accessorKey: "n5",
        header: "Атрибут №6"
      },
      {
        accessorKey: "n6",
        header: "Полигоны/плоскости разломов TWT | Charisma Fault Sticks"
      },
      {
        accessorKey: "n7",
        header: "Checkshots (Отбивки пластопересечений во времени и глубине) | txt/xlsx"
      },
      {
        accessorKey: "n8",
        header: "Временной (TWT) куб NP cropped | SEG-Y "
      },
      {
        accessorKey: "n9",
        header: "Кровля пласта TWT | Irap/CPS3 "
      },
      {
        accessorKey: "n10",
        header: "Подошва пласта TWT | Irap/CPS3"
      },
      {
        accessorKey: "n11",
        header: "скоростной закон"
      },
      {
        accessorKey: "n12",
        header: "Полигоны/плоскости разломов TVDSS | Charisma Fault Sticks"
      },
      {
        accessorKey: "n13",
        header: "Структурная поверхность кровли TVDSS | SEG-Y "
      },
      {
        accessorKey: "n14",
        header: "Структурная поверхность подошвы TVDSS | SEG-Y "
      },      {
        accessorKey: "n15",
        header: "Глубинный (TVDSS) куб NP cropped  | SEG-Y "
      },      {
        accessorKey: "n16",
        header: "Структурный каркас TVDSS (Faults) | Charisma Fault Sticks"
      },      {
        accessorKey: "n17",
        header: "Атрибут №1"
      },      {
        accessorKey: "n18",
        header: "Атрибут №2"
      }
    ]
  // лучше переименовать свойство и использовать useState
  // data - по сути своей слово "резерв", data в запросах, data в библиотеках, как в питоне, например, task
  // вынес информацию в json
    useEffect(() => {
        axios
            .get('/api/data_table.json')
            .then((table_response) => {
                setDataTable(table_response.data)
            })
    }, [])
    
return (
    // width лучше поставить в значение 100%
    // то, что ты используешь rem - круто, но лучше для этого задавать функцию в стилях, которая будет переводить из px в rem
    <div style={{width: "100%"}}> 
    <MaterialReactTable
      columns={columns}
      data={dataTable}
      enableColumnVirtualization 
      enableColumnActions={false}
      enableColumnFilters={false}
      enablePagination={false}
      enableSorting={false}
      enableBottomToolbar={false}
      enableTopToolbar={false}
      enableStickyHeader
      muiTableBodyRowProps={{ hover: false }}
      muiTableProps={{
        sx: {
          border: '1px solid rgba(81, 81, 81, 1)',
          bgcolor: '#1D1D1D'
        },
      }}
      muiTableHeadCellProps={{
        sx: {
          border: '1px solid rgba(81, 81, 81, 1)',
          bgcolor: '#1D1D1D',
          color: "#B3B3B3"
        },
      }}
      muiTableBodyCellProps={{
        sx: {
          border: '1px solid rgba(81, 81, 81, 1)',
          bgcolor: '#1D1D1D',
          color: "#B3B3B3"
        },

      }}
      muiTableContainerProps={{ 
        sx: { 
          maxHeight: '100vh'
        } 
      }}
    />
    </div>
  );
};

export default Table;
