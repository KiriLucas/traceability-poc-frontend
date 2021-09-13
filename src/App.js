import './App.css';
import React, { Component } from 'react'
import { CContainer, CRow, CCol, CAlert, CModalHeader, CModal, CModalTitle, CModalBody } from '@coreui/react';
import jsQR from "jsqr";
import axios from 'axios';
import ReactTable from "react-table";

 export default class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      plainData: '',
      batchsId: '',
      potatoTable: [],
      tableData: [],
      visibleXL: false,
      title: 'QRCode data: ',
    }
  }
  renderListModal = () => {
    // onClick para abrir modal, esse on click vai setar um state e o state vai ser usado num map pra mapear 

    if (this.state.visibleXL) {
      return (
        <CModal size="xl" visible={this.state.visibleXL}>
          <CModalHeader onDismiss={() => this.setState({ setVisibleXL: false })}>
            <CModalTitle>Batch list</CModalTitle>
          </CModalHeader>
          <CModalBody></CModalBody>
        </CModal>
      );
    }
  }

  async renderToast() {
    if (this.state.batchsId) {
      return (
        <CAlert color="success" dismissible="true">
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

    this.setState({plainData: qrCodeData})
    this.setState({batchsId: request.data})

  }

  onListChange = async () => {
    this.setState({visibleXL: true})
  }

  async fillData(){
    const potato = await axios.get(`http://localhost:3001/batch/list`)
    this.setState({tableData: potato.data})
    console.log(this.state.tableData)
  }

  componentDidMount(){
    this.fillData()
  }

  render() {

    const columns = [
      {
        name: 'Title',
        selector: 'ammount',
      },
      {
        name: 'Title',
        selector: 'batchId',
      },
      {
        name: 'Title',
        selector: 'createdAt',
      },
      {
        name: 'Title',
        selector: 'id',
      },
      {
        name: 'Title',
        selector: 'manufacturingDate',
      },
      {
        name: 'Title',
        selector: 'pieceModel',
      },
      {
        name: 'Title',
        selector: 'provider',
      },
      {
        name: 'Title',
        selector: 'updatedAt',
      },
    ]

    return (
      <CContainer>

        {this.renderToast()}
        {this.renderListModal()}
{/* 
        <ReactTable
          data={[]}
          columns={columns}
        /> */}

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

          {/* <CCol>
          <p class="title">New batch</p>
          <label class="btn btn-dark" for="upload"><i class="cil-basket"></i></label>
          <input type="file" id="upload" onChange={onChange} />
          <p class="title">{title}{plainData}</p>
        </CCol>

        <CCol>
          <p class="title">New piece</p>
          <label class="btn btn-dark" for="upload"><i class="cil-qr-code"></i></label>
          <input type="file" id="upload" onChange={onChange} />
          <p class="title">{title}{plainData}</p>
        </CCol> */}

        </CRow>
        <CRow>

        </CRow>
      </CContainer>
    )
  }
}