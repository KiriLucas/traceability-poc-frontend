import './App.css';
import React, { Component } from 'react'
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

const decodeQrCode = async (file) => {

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
      checkButtonA: '',
      checkButtonB: '',
      disabledA: false,
      disabledB: true,
      pieceA: '',
      pieceB: '',
      fileButtonA: 'cil-plus',
      fileButtonB: 'cil-plus',
      batchId: '',
      batchTableData: [],
      pieceTableData: [],
      batchData: [],
      batchListVisible: false,
      pieceListVisible: false,
      visibleTwo: false,
      groupModal: false,
      title: 'QRCode data: ',
      renderToast: false,
      selectedRow: null,
    }
  }


  renderBatchListModal = () => {
    const columns = [
      {
        title: 'Quantidade',
        field: 'amount',
      },
      {
        title: 'Lote',
        field: 'batchId',
      },
      {
        title: 'Criação',
        field: 'createdAt',
      },
      {
        title: 'Fabricação',
        field: 'manufacturingDate',
      },
      {
        title: 'Modelo',
        field: 'pieceModel',
      },
      {
        title: 'Fornecedor',
        field: 'provider',
      },
    ]
    return (
      <CModal size="xl" visible={this.state.batchListVisible} backdrop={true} keyboard>
        <CModalHeader onDismiss={() => this.setState({ batchListVisible: false })}>
        </CModalHeader>
        <CModalBody>
          <MaterialTable
            title="Lista de lotes"
            data={this.state.batchTableData}
            columns={columns}
            icons={tableIcons}
            onRowClick={async (evt, selectedRow) => {
              this.setState({ selectedRow: selectedRow })
              const url = `http://localhost:3001/batch/findBatch/${selectedRow.batchId}`
              const request = await axios.get(url)
              this.setState({ batchData: request.data })
              this.setState({ visibleTwo: true })
              this.setState({ batchListVisible: false })
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

  renderPieceListModal = () => {
    const columns = [
      {
        title: 'Id da Peça',
        field: 'pieceId',
      },
      {
        title: 'Id do Lote',
        field: 'batchId',
      },
      {
        title: 'Id do Grupo',
        field: 'groupId',
      },
    ]
    return (
      <CModal size="xl" visible={this.state.pieceListVisible} backdrop={true} keyboard>
        <CModalHeader onDismiss={() => this.setState({ pieceListVisible: false })}>
        </CModalHeader>
        <CModalBody>
          <MaterialTable
            title="Lista de Peças"
            data={this.state.pieceTableData}
            columns={columns}
            icons={tableIcons}
            onRowClick={async (evt, selectedRow) => {
              this.setState({ selectedRow: selectedRow })
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
        <CModalHeader onDismiss={() => this.setState({ visibleTwo: false, batchListVisible: true })}>
          <CModalTitle>{this.state.batchData.batchId}</CModalTitle>
        </CModalHeader>
        <CModalBody>

          <CListGroup flush>
            <CListGroupItem><b className="dataTitle">LOTE:</b> <dataTag>{this.state.batchData.batchId}</dataTag></CListGroupItem>
            <CListGroupItem><b className="dataTitle">MODELO:</b> <dataTag>{this.state.batchData.pieceModel}</dataTag></CListGroupItem>
            <CListGroupItem><b className="dataTitle">QUANTIDADE:</b> <dataTag>{this.state.batchData.amount}</dataTag></CListGroupItem>
            <CListGroupItem><b className="dataTitle">FORNECEDOR:</b> <dataTag>{this.state.batchData.provider}</dataTag></CListGroupItem>
          </CListGroup>

        </CModalBody>
      </CModal>
    );
  }

  newPieceOnChange = async ({ target: { files } }) => {
    try {
      const qrCodeData = await decodeQrCode(files[0])

      const url = `http://localhost:3001/piece/new`
      const request = await axios.post(url, JSON.parse(qrCodeData), { headers: { 'Content-Type': 'application/json' } })
      this.setState({ batchId: request.data })

      const successMessage = 'Peça ' + request.data + ' criada'
      this.fillData();
      toast.success(successMessage);
    } catch (error) {
      toast.error("Algo deu errado!")
    }
  }

  addFirstPiece = async ({ target: { files } }) => {
    try {
      const piece = await decodeQrCode(files[0])

      this.setState({ checkButtonA: 'checkButton', fileButtonA: 'cil-check-alt', disabledA: true, disabledB: false })
      this.setState({ pieceA: piece })
    } catch (error) {
      toast.error("Algo deu errado!")
    }
  }

  addSecondPiece = async ({ target: { files } }) => {
    try {
      const piece = await decodeQrCode(files[0])

      this.setState({ checkButtonB: 'checkButton', fileButtonB: 'cil-check-alt' })
      this.setState({ pieceB: piece })
      this.groupPieces()
    } catch (error) {
      toast.error("Algo deu errado!")
    }
  }

  groupPieces = async () => {
    try {
      const pieceAId = JSON.parse(this.state.pieceA).pieceId
      const pieceBId = JSON.parse(this.state.pieceB).pieceId
      const body = { pieceAId, pieceBId }
      const url = `http://localhost:3001/piece/group`
      const request = await axios.post(url, body, { headers: { 'Content-Type': 'application/json' } })

      this.fillData()
      this.setState({ pieceB: '' })
      setTimeout(() => {
        this.setState({ checkButtonB: '' })
      }, 1500);
      const successMessage = `${request.data}: Novo grupo criado!`
      toast.success(successMessage)
    } catch (error) {
      toast.error("Algo deu errado!")
    }
  }


  newBatchOnChange = async ({ target: { files } }) => {
    try {
      const qrCodeData = await decodeQrCode(files[0])
      const url = `http://localhost:3001/batch/new`
      const request = await axios.post(url, JSON.parse(qrCodeData), { headers: { 'Content-Type': 'application/json' } })

      this.setState({ batchId: request.data })

      this.fillData();
      const successMessage = 'Lote ' + request.data + ' criado'
      toast.success(successMessage);
    } catch (error) {
      toast.error("Algo deu errado!")
    }
  }

  renderGroupModal = () => {
    return (
      <CModal size="xl" visible={this.state.groupModal} backdrop={true} >
        <CModalHeader onDismiss={() => this.setState({ groupModal: false })}>
          <CModalTitle>Agrupar Peças</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow fluid>
            <CCol className="qcolumn">
              <p class="title">Peça A</p>
              <label class={`${this.state.fileButtonA} groupButton ${this.state.checkButtonA}`} for="group"></label>
              <input type="file" id="group" onChange={this.addFirstPiece} disabled={this.state.disabledA} />
            </CCol>
            <CCol className="qcolumn">
              <p class="title">Peça B</p>
              <label class={`${this.state.fileButtonB} groupButton ${this.state.checkButtonB}`} for="groupB"></label>
              <input type="file" id="groupB" onChange={this.addSecondPiece} disabled={this.state.disabledB} />
            </CCol>
          </CRow>
        </CModalBody>
      </CModal>
    );
  }

  openBatchOnClick = async () => {
    this.setState({ batchListVisible: true })
  }

  openPieceOnClick = async () => {
    this.setState({ pieceListVisible: true })
  }

  openGroupModal = async () => {
    this.setState({ groupModal: true })
  }

  async fillData() {
    const batchListRequest = await axios.get(`http://localhost:3001/batch/list`)
    const pieceListRequest = await axios.get(`http://localhost:3001/piece/list`)
    this.setState({ batchTableData: batchListRequest.data })
    this.setState({ pieceTableData: pieceListRequest.data })
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

        {this.renderBatchListModal()}
        {this.renderPieceListModal()}
        {this.renderDetailModal()}
        {this.renderGroupModal()}

        <CRow fluid>
          <CCol className="qcolumn">
            <p class="title">Novo lote</p>
            <label class="cil-qr-code qicon" for="upload"></label>
            <input type="file" id="upload" onChange={this.newBatchOnChange} />
          </CCol>

          <CCol className="qcolumn">
            <p class="title">Listar lotes</p>
            <label class="cil-list-rich qicon" onClick={this.openBatchOnClick}></label>
          </CCol>

          <CCol className="qcolumn">
            <p class="title">Nova peça</p>
            <label class="cil-qr-code qicon" for="uploadPiece"></label>
            <input type="file" id="uploadPiece" onChange={this.newPieceOnChange} />
          </CCol>

          <CCol className="qcolumn">
            <p class="title">Listar peças</p>
            <label class="cil-list-rich qicon" onClick={this.openPieceOnClick}></label>
          </CCol>

          <CCol className="qcolumn">
            <p class="title">Agrupar peças</p>
            <label class="cil-object-group qicon" for="groupButton" onClick={this.openGroupModal}></label>
          </CCol>
        </CRow>
        <CRow>
        </CRow>
      </CContainer>
    )
  }
}