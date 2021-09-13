import './App.css';
import React, { Component } from 'react'
import { CContainer, CRow, CCol, CAlert, CModalHeader, CModal, CModalTitle, CModalBody } from '@coreui/react';
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
      plainData: '',
      batchsId: '',
      tableData: [],
      visibleXL: false,
      title: 'QRCode data: ',
      renderToast: false,
      selectedRow: null,
    }
  }

  renderListModal = () => {
    const columns = [
      {
        title: 'Amount',
        field: 'ammount',
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

    if (this.state.visibleXL) {
      return (
        <CModal size="xl" visible={this.state.visibleXL} backdrop={true} >
          <CModalHeader onDismiss={() => this.setState({ visibleXL: false })}>
            <CModalTitle>Batch list</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <MaterialTable
              title="Batch details"
              data={this.state.tableData}
              columns={columns}
              icons={tableIcons}
              onRowClick={(evt, selectedRow) => {
                this.setState({selectedRow: selectedRow.tableData.id})
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
  }

  renderToast = () => {
    if (this.state.renderToast) {
      return (
        <CAlert color="info">
          Batch {this.state.batchsId} created
        </CAlert>
      );
    }
  }

  onChange = async ({ target: { files } }) => {
    const image = await createImageBitmap(files[0])
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    const url = `http://localhost:3001/batch/new`

    canvas.width = image.width
    canvas.height = image.height
    context.drawImage(image, 0, 0)

    const imageData = context.getImageData(0, 0, image.width, image.height)
    const qrCodeData = jsQR(imageData.data, imageData.width, imageData.height).data
    const request = await axios.post(url, JSON.parse(qrCodeData), { headers: { 'Content-Type': 'application/json' } })

    this.setState({ plainData: qrCodeData })
    this.setState({ batchsId: request.data })
    this.setState({ renderToast: true }, () => {
      window.setTimeout(() => {
        this.setState({ renderToast: false })
      }, 3000)
    })

  }

  onListChange = async () => {
    this.setState({ visibleXL: true })
  }

  async fillData() {
    const potato = await axios.get(`http://localhost:3001/batch/list`)
    this.setState({ tableData: potato.data })
    console.log(this.state.tableData)
  }

  componentDidMount() {
    this.fillData()
  }

  render() {
    return (
      <CContainer>

        {this.renderToast()}
        {this.renderListModal()}

        <CRow>
          <CCol className="qcolumn">
            <p class="title">New batch</p>
            <label class="cil-qr-code qicon" for="upload"></label>
            <input type="file" id="upload" onChange={this.onChange} />
          </CCol>

          <CCol className="qcolumn">
            <p class="title">List batches</p>
            <label class="cil-list-rich qicon" onClick={this.onListChange}></label>
            {/* <button type="file" id="upload" onChange={onListChange} /> */}
          </CCol>

          <CCol className="qcolumn">
            <p class="title">New piece</p>
            <label class="cil-qr-code qicon" for="upload"></label>
            <input type="file" id="upload" onChange={this.onChange} />
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