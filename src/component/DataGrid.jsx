import 'react-data-grid/lib/styles.css';

import {map, filter, pipe, keys, head, last, prop, sortBy, sortWith, descend, any, values, curry} from 'ramda';
import {useState, useEffect} from 'react';
import ReactDataGrid, {textEditor, SelectCellFormatter} from 'react-data-grid';

import './DataGrid.css';
import {exportToCsv, debounce} from '../helper/util';
import {formatFirebaseDateTime} from '../helper/datetime-helper';
import Input from './Input';
import Checkbox from './Checkbox';
import ButtonDefault from './ButtonDefault';
import Row from './Row';

const renderDateTime = key => props => formatFirebaseDateTime(props.row[key]);

let i = 0;
const keyInfo = {
    name: {label: '이름', width: '90px', order: i++},
    nameEnglish: {label: '영문 이름', width: '130px', order: i++,},
    age: {label: '나이', width: '80px', order: i++},
    ageRange: {label: '나이', width: '80px', order: i++},
    email: {label: '이메일', width: '200px', order: i++},
    phone: {label: '전화', width: '120px', order: i++},
    address: {label: '주소', width: '100px', order: i++},
    area: {label: '지역', width: '110px', order: i++},
    city: {label: '도시', width: '100px', order: i++},
    church: {label: '교회', width: '100px', order: i++},
    event: {label: '행사', width: '100px', order: i++},
    nursery: {label: '데이케어', width: '80px', order: i++},
    createdAt: {label: '등록날짜', width: '180px', renderCell: renderDateTime("createdAt"), order: i++},
    status: {label: '상태', width: '80px', order: i++},
    paid: {label: '입금액', width: '60px',  order: i++},
    paidAt: {label: '입금날짜', width: '100px',  order: i++},
    note: {label: '노트', width: '200px', order: i++},
    receiptComplete: {label: '접수완료', width: '80px', order: i++},
};

const defaultColumnOptions = {sortable: true, resizable: true};

const checkBoxCell = ({column, row, onRowChange, tabIndex}) => {
    const handleChange = e => {
        const checked = e.target.checked;
        //const checked = !row[column.key];
        onRowChange({...row, [column.key]: checked});
    };
    return <div className="flex justify-center items-center h-full"><input type="checkbox" checked={row[column.key]} onChange={handleChange} /></div>;
    //return <SelectCellFormatter value={row[column.key]} onChange={handleChange} tabIndex={tabIndex} />;
};

const getColumns = pipe(
    keys,
    filter(d => d !== "id" && d !== "updatedAt" && d !== 'event'),
    map((key, i) => {
        const info = keyInfo[key];
        if(info){
            const {label, order, ...otherProps} = info;
            let res = {key, name: label, frozen: order === 0, order, ...otherProps};
            if(key === 'receiptComplete'){
                return {...res, renderCell: checkBoxCell};
            } else {
                return {...res, renderEditCell: textEditor};
            }
        } else {
            return {key, name: key};
        }
    }),
    sortBy(prop('order')),
);

const getKeyString = (columns) => map(prop('key'), columns).join();

const rowKeyGetter = (row) => row.id;

const hasAnyValues = curry((search, obj) => any(d => `${d}`.indexOf(search.toLowerCase()) >= 0, map(d => `${d}`.toLowerCase(), values(obj))));

export default function DataGrid({data, className, usingSearch=true, downloadFileName, onRowsChange, onSave}){
    const [columns, setColumns] = useState([]);
    const [sortColumns, setSortColumns] = useState([]);
    const [rows, setRows] = useState();
    const [searchTerm, setSearchTerm] = useState('');
    const [excludeSearch, setExcludeSearch] = useState(false);

    useEffect(() => {
        if(data.length){
            const newColumns = getColumns(last(data));
            if(getKeyString(columns) !== getKeyString(newColumns)){
                setColumns(newColumns);
            }
        }
    }, [data]);

    useEffect(() => {
        sortRows();
    }, [sortColumns]);

    useEffect(() => {
        filterRows().then(sortRows);
    }, [searchTerm, excludeSearch, data]);

    const sortRows = (filteredData) => {
        if(sortColumns.length){
            const {columnKey, direction} = head(sortColumns);
            const sortByDesc = key =>  sortWith([descend(prop(key))]);
            const sortFn = direction === "ASC" ? sortBy(prop(columnKey)) : sortByDesc(columnKey);
            setRows(filteredData ? sortFn(filteredData) : sortFn);
        } else if(filteredData){
            setRows(filteredData);
        } else{
            setRows(data);
        }
    };

    const filterRows = () => new Promise((resolve, reject) => {
        debounce(() => {
            if(searchTerm){
                resolve(filter(d => {
                    const hasValue = hasAnyValues(searchTerm, d);
                    return excludeSearch ? !hasValue : hasValue;
                }, data));
            } else {
                resolve(data);
            }
        });
    });

    const handleDownload = () => {
        exportToCsv(gridElement, downloadFileName);
    };

    const handleChangeSearchTerm = e => {
        setSearchTerm(e.target.value);
    };

    const handleChangeExceptSearch = e => {
        setExcludeSearch(e.target.checked);
    };

    if(!columns.length){
        return null;
    }

    const gridElement = (
        <ReactDataGrid 
            columns={columns}
            rows={rows}
            defaultColumnOptions={defaultColumnOptions}
            rowKeyGetter={rowKeyGetter}
            sortColumns={sortColumns}
            onRowsChange={onRowsChange}
            onSortColumnsChange={setSortColumns}
        />
    );

    return (
        <div className={className}>
            <Row className='justify-between mb-2'>
                <div className='mb-2'>
                    {downloadFileName && <ButtonDefault className="w-20 btn-sm" onClick={handleDownload}>다운로드</ButtonDefault>}
                </div>
                {
                    usingSearch &&
                    <div className='flex flex-1 justify-end items-center mb-2'>
                        검색:&nbsp;<Input value={searchTerm} onChange={handleChangeSearchTerm} className="w-32 md:ml-3 md:mr-1 md:w-48"/>&nbsp;<Checkbox label="제외" onChange={handleChangeExceptSearch} />&nbsp;({rows.length})
                    </div>
                }
            </Row>
            {gridElement}
        </div>
    );
}