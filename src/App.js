import './App.css';
import { useState } from 'react'
import { CContainer, CRow, CCol, CAlert, CModalHeader, CModal, CModalTitle, CModalBody } from '@coreui/react';
import jsQR from "jsqr";
import axios from 'axios';

function App() {

  const [plainData, setPlainData] = useState('')
  const [batchId, setBatchId] = useState('')
  const [potatoTable, setPotatoTable] = useState([])

  const [visibleXL, setVisibleXL] = useState(false)
  const title = 'QRCode data: '

  const onChange = async ({ target: { files } }) => {
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

    setPlainData(qrCodeData)
    setBatchId(request.data)
  }

  const onListChange = () => {
    setVisibleXL(true)
  }

  function renderToast() {
    if (batchId) {
      return (
        <CAlert color="success" dismissible="true">
          Batch {batchId} created
        </CAlert>
      );
    }
}

 async function tableData() {
    const potato = await axios.get(`http://localhost:3001/batch/list`)
    setPotatoTable(potato)
    console.log(potato) 
  }

  function renderListModal() {
    if (visibleXL) {
      return (
        <CModal size="xl" visible={visibleXL}>
          <CModalHeader onDismiss={() => setVisibleXL(false)}>
            <CModalTitle>Batch list</CModalTitle>
          </CModalHeader>
          <CModalBody>...</CModalBody>

        </CModal>
      );
    }
  }

  // function onBatata() {
  //   return axios.get(`http://localhost:3001/batch/list`)
  // }
  

  return (
    <CContainer>
      {renderToast()}
      {renderListModal()}
      <CRow>
        <CCol className="qcolumn">
          <p class="title">New batch</p>
          <label class="cil-qr-code qicon" for="upload"></label>
          <input type="file" id="upload" onChange={onChange} />
        </CCol>

        <CCol className="qcolumn">
          <p class="title">List batches</p>
          <label class="cil-list-rich qicon" onClick={onListChange}></label>
          {/* <button type="file" id="upload" onChange={onListChange} /> */}
        </CCol>

        <CCol className="qcolumn">
          <p class="title">New piece</p>
          <label class="cil-qr-code qicon" for="upload"></label>
          <input type="file" id="upload" onChange={onChange} />
        </CCol>

        <CCol className="qcolumn">
          <p class="title">Group pieces</p>
          <label class="cil-object-group qicon" for="upload"></label>
          <input type="file" id="upload" onChange={onChange} />
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
  );
}

export default App;
