import './App.css';
import React, { Component, useState } from 'react'
import { CContainer, CRow, CCol, CModalHeader, CModal, CModalTitle, CModalBody, CListGroup, CListGroupItem } from '@coreui/react';
import jsQR from "jsqr";
import axios from 'axios';
import MaterialTable from "material-table";
import { forwardRef } from 'react';

import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const createImage = async (file) => {
  const image = await createImageBitmap(file)
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')

  canvas.width = image.width
  canvas.height = image.height
  context.drawImage(image, 0, 0)

  const imageData = context.getImageData(0, 0, image.width, image.height)
  const qrCodeData = jsQR(imageData.data, imageData.width, imageData.height).data

  return qrCodeData
}

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

export default class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      batchId: '',
      batchTableData: [],
      batchData: [],
      visibleXL: false,
      visibleTwo: false,
      title: 'QRCode data: ',
      renderToast: false,
      selectedRow: null,
    }
  }


  renderListModal = () => {
    const columns = [
      {
        title: 'Amount',
        field: 'amount',
      },
      {
        title: 'Batch',
        field: 'batchId',
      },
      {
        title: 'Creation',
        field: 'createdAt',
      },
      {
        title: 'Manufactured',
        field: 'manufacturingDate',
      },
      {
        title: 'Model',
        field: 'pieceModel',
      },
      {
        title: 'Provider',
        field: 'provider',
      },
    ]
    return (
      <CModal size="xl" visible={this.state.visibleXL} backdrop={true} keyboard>
        <CModalHeader onDismiss={() => this.setState({ visibleXL: false })}>
        </CModalHeader>
        <CModalBody>
          <MaterialTable
            title="Batch list"
            data={this.state.batchTableData}
            columns={columns}
            icons={tableIcons}
            onRowClick={async (evt, selectedRow) => {
              this.setState({ selectedRow: selectedRow })
              const url = `http://localhost:3001/batch/findBatch/${selectedRow.batchId}`
              const request = await axios.get(url)
              this.setState({ batchData: request.data })
              this.setState({ visibleTwo: true })
              this.setState({ visibleXL: false })
            }}
            options={{
              rowStyle: rowData => ({
                backgroundColor:
                  this.state.selectedRow === rowData.tableData.id ? '#fefff2' : '#FFF'
              })
            }} />
        </CModalBody>
      </CModal>
    );
  }

  renderDetailModal = () => {
    return (
      <CModal size="md" visible={this.state.visibleTwo} backdrop={true} >
        <CModalHeader onDismiss={() => this.setState({ visibleTwo: false, visibleXL: true })}>
          <CModalTitle>{this.state.batchData.batchId}</CModalTitle>
        </CModalHeader>
        <CModalBody>

          <CListGroup flush>
            <CListGroupItem><b className="dataTitle">BATCH:</b> <dataTag>{this.state.batchData.batchId}</dataTag></CListGroupItem>
            <CListGroupItem><b className="dataTitle">MODEL:</b> <dataTag>{this.state.batchData.pieceModel}</dataTag></CListGroupItem>
            <CListGroupItem><b className="dataTitle">AMOUNT:</b> <dataTag>{this.state.batchData.amount}</dataTag></CListGroupItem>
            <CListGroupItem><b className="dataTitle">PROVIDER:</b> <dataTag>{this.state.batchData.provider}</dataTag></CListGroupItem>
          </CListGroup>

        </CModalBody>
      </CModal>
    );
  }

  newPieceOnChange = async ({ target: { files } }) => {
    try {
      const qrCodeData = await createImage(files[0])
      const url = `http://localhost:3001/piece/new`
      const request = await axios.post(url, JSON.parse(qrCodeData), { headers: { 'Content-Type': 'application/json' } })

      this.setState({ batchId: request.data })

      const creationMessage = 'Batch ' + this.state.batchId + ' created'
      toast.success(creationMessage);
    } catch (error) {
      toast.error("Error!")
    }
  }

  newBatchOnChange = async ({ target: { files } }) => {
    try {
      const qrCodeData = await createImage(files[0])
      const url = `http://localhost:3001/batch/new`
      const request = await axios.post(url, JSON.parse(qrCodeData), { headers: { 'Content-Type': 'application/json' } })

      this.setState({ batchId: request.data })

      const creationMessage = 'Batch ' + this.state.batchId + ' created'
      toast.success(creationMessage);
    } catch (error) {
      toast.error("Error!")
    }
  }

  openBatchOnClick = async () => {
    this.setState({ visibleXL: true })
  }

  async fillData() {
    const request = await axios.get(`http://localhost:3001/batch/list`)
    this.setState({ batchTableData: request.data })
    console.log(this.state.batchTableData)
  }

  componentDidMount() {
    this.fillData()
  }

  render() {

    return (
      <CContainer>

        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />

        {this.renderListModal()}
        {this.renderDetailModal()}

        <CRow>
          <CCol className="qcolumn">
            <p class="title">New batch</p>
            <label class="cil-qr-code qicon" for="upload"></label>
            <input type="file" id="upload" onChange={this.newBatchOnChange} />
          </CCol>

          <CCol className="qcolumn">
            <p class="title">List batches</p>
            <label class="cil-list-rich qicon" onClick={this.openBatchOnClick}></label>
          </CCol>

          <CCol className="qcolumn">
            <p class="title">New piece</p>
            <label class="cil-qr-code qicon" for="upload"></label>
            <input type="file" id="upload" onChange={this.newPieceOnChange} />
          </CCol>

          <CCol className="qcolumn">
            <p class="title">Group pieces</p>
            <label class="cil-object-group qicon" for="upload"></label>
            <input type="file" id="upload" onChange={this.onChange} />
          </CCol>
        </CRow>
        <CRow>
        </CRow>
      </CContainer>
    )
  }
}