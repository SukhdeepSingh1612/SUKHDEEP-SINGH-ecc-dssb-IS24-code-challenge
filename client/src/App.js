import { SearchOutlined } from "@ant-design/icons";
import { useEffect, useState, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Button, Input, Space, Table } from "antd";
import Highlighter from "react-highlight-words";
import request from "helpers/request";
import ProductModal from "components/ProductModal";
import { DeleteIcon, EditIcon } from "lib/Icons";


function App() {
  const [data, setData] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [visibleEntriesCount, setVisibleEntriesCount] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [isUpdateModal, setIsUpdateModal] = useState(false);
  const searchInput = useRef(null);
  const productModalRef = useRef(null);

  
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  
  const handleReset = (clearFilters, confirm) => {
    clearFilters();
    setSearchText("");
    confirm();
  };

  function filterIcon(filtered) {
    return (
      <SearchOutlined
        style={{
          color: filtered ? "#1890ff" : "#ffffff",
        }}
      />
    );
  }

  function filterIconBlack(filtered) {
    return (
      <SearchOutlined
        style={{
          color: filtered ? "#1890ff" : "#000000",
        }}
      />
    );
  }

  
  function onFilter(value, record, dataIndex) {
    console.log(value, record, dataIndex);

    return record[dataIndex]
      .toString()
      .toLowerCase()
      .includes(value.toLowerCase());
  }

  function onFilterDropdownOpenChange(visible) {
    if (visible) {
      setTimeout(() => searchInput.current?.select(), 100);
    }
  }

  
  function filterDropdown(
    { setSelectedKeys, selectedKeys, confirm, clearFilters, close },
    dataIndex,
    placeholder
  ) {
    return (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${placeholder}`}
          value={selectedKeys[0]}
          onChange={(e) => {
            const value = e.target.value ? [e.target.value] : [];

            setSelectedKeys(value);
          }}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          className="block mb-2"
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            className="flex items-center"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters, confirm)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
        </Space>
      </div>
    );
  }

  function openAddModal() {
    setIsUpdateModal(false);
    setModalOpen(true);
  }

  
  function renderText(value, record, index, dataIndex) {
    if (searchedColumn === dataIndex) {
      return (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#FECE02",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={value ? value.toString() : ""}
        />
      );
    } else {
      return value;
    }
  }

  
  function renderDate(date, record, dataIndex) {
    return date;
  }

  
  function renderArray(values, record, index, dataIndex) {
    if (searchedColumn === dataIndex) {
      return (
        <div className="flex flex-col">
          {values.map((value, idx) => {
            return (
              <Highlighter
                key={idx}
                highlightStyle={{
                  backgroundColor: "#BB86FC",
                  padding: 0,
                }}
                searchWords={[searchText]}
                autoEscape
                textToHighlight={value ? value.toString() : ""}
              />
            );
          })}
        </div>
      );
    } else {
      return (
        <div className="flex flex-col">
          {values.map((value, idx) => {
            return <div key={idx}>{value}</div>;
          })}
        </div>
      );
    }
  }

  
  function renderAction(value, record, dataIndex) {
    async function editRecord() {
      productModalRef.current.setFormFields(value);

      setIsUpdateModal(true);
      setModalOpen(true);
    }

  
  async function deleteRecord() {
    try {
      await request.delete(`/product/${value.productId}`);
      await fetchProductData();

      toast.success("Product Deleted Succesfully!");
    } catch (err) {
      toast.error(err.response.data.message);
    }
  }

    return (
      <Space size="middle">
        <div className="cursor-pointer h-fit w-fit" onClick={editRecord}>
          <EditIcon className="h-4 w-4"/>
        </div>
        <div className="cursor-pointer h-fit w-fit" onClick={deleteRecord}>
          <DeleteIcon className="h-4 w-4"/>
        </div>
      </Space>
    );
  }

  
  async function fetchProductData() {
    setIsDataLoading(true);

    try {
      const response = await request.get("/product");

      setVisibleEntriesCount(response.data.length);
      setData(response.data);
    } catch (err) {
      toast.error(err?.response?.data?.message);
    } finally {
      setIsDataLoading(false);
    }
  }

  
  useEffect(() => {
    fetchProductData();
  }, []);

  return (
    <>
      <main className="min-h-screen w-full py-8 px-4 flex items-center justify-center bg-[#121212]">
        <div className="h-full w-fit flex flex-col gap-4">
          <div className="flex items-center justify-between shrink-0">
            <Button onClick={openAddModal}>Add New Product</Button>
            <h1 className="text-[#ffffff]">Product Catalog</h1>
            <div className="flex flex-col">
              <span className="text-[#ffffff] italic">All Product Count: {data.length}</span>
              <span className="text-[#ffffff] italic">Filtered Products Count: {visibleEntriesCount}</span>
            </div>
          </div>
          <div className="overflow-auto relative flex-1">
            <Table
              loading={isDataLoading}
              dataSource={data}
              pagination={false}
              sticky={true}
              className="max-w-full"
              onChange={(
                pagination,
                filters,
                sorter,
                { currentDataSource }
              ) => {
                setVisibleEntriesCount(currentDataSource.length);
              }}
            >
              <Table.Column
                width="11.11%"
                title="Product ID"
                dataIndex="productId"
                key="productId"
                render={renderText}
                className="!bg-bc-blue !text-[#ffffff]"
              />
              <Table.Column
                width="11.11%"
                title="Product Name"
                dataIndex="productName"
                key="productName"
                render={renderText}
                className="!bg-bc-gold !text-[#121212]"
              />
              <Table.Column
                width="11.11%"
                title="Product Owner"
                dataIndex="productOwnerName"
                key="productOwnerName"
                render={renderText}
                className="!bg-bc-blue !text-[#ffffff]"
              />
              <Table.Column
                width="11.11%"
                title="Developers"
                dataIndex="Developers"
                key="Developers"
                render={(...args) => renderArray(...args, "Developers")}
                onFilter={(...args) => onFilter(...args, "Developers")}
                filterDropdown={(props) =>
                  filterDropdown(props, "Developers", "Developer")
                }
                filterIcon={filterIconBlack}
                onFilterDropdownOpenChange={onFilterDropdownOpenChange}
                className="!bg-bc-gold !text-[#121212]"
              />
              <Table.Column
                width="11.11%"
                title="Scrum Master"
                dataIndex="scrumMasterName"
                key="scrumMasterName"
                render={(...args) => renderText(...args, "scrumMasterName")}
                onFilter={(...args) => onFilter(...args, "scrumMasterName")}
                filterDropdown={(props) =>
                  filterDropdown(props, "scrumMasterName", "Scrum Master")
                }
                filterIcon={filterIcon}
                onFilterDropdownOpenChange={onFilterDropdownOpenChange}
                className="!bg-bc-blue !text-[#ffffff]"
              />
              <Table.Column
                width="11.11%"
                title="Start Date"
                dataIndex="startDate"
                key="startDate"
                render={renderDate}
                className="!bg-bc-gold !text-[#121212]"
              />
              <Table.Column
                width="11.11%"
                title="Location"
                dataIndex="location"
                key="location"
                render={renderText}
                className="!bg-bc-blue !text-[#ffffff]"
              />
              <Table.Column
                width="11.11%"
                title="Methodology"
                dataIndex="methodology"
                key="methodology"
                render={renderText}
                className="!bg-bc-gold !text-[#121212]"
              />
              <Table.Column
                width="12%"
                title="Action"
                key="action"
                render={renderAction}
                className="!bg-bc-blue !text-[#ffffff]"
              />
            </Table>
          </div>
        </div>
      </main>
      <ProductModal
        ref={productModalRef}
        open={modalOpen}
        setOpen={setModalOpen}
        isUpdateModal={isUpdateModal}
        refetchData={fetchProductData}
      />
      <Toaster />
    </>
  );
}

export default App;
