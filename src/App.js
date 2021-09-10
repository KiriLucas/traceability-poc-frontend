import './App.css';
import { useState } from 'react'
import { CContainer, CRow, CCol } from '@coreui/react';
import jsQR from "jsqr";
import axios from 'axios';

function App() {

  const [plainData, setPlainData] = useState('')
  const title = 'QRCode data: '

  const onChange = ({ target: { files } }) => {
    console.log('batata')

    createImageBitmap(files[0]).then(image => {
      const canvas = document.createElement('canvas')
      canvas.width = image.width
      canvas.height = image.height

      const context = canvas.getContext('2d')
      context.drawImage(image, 0, 0)

      const imageData = context.getImageData(0, 0, image.width, image.height)
      const qrCodeData = jsQR(imageData.data, imageData.width, imageData.height).data

      setPlainData(qrCodeData)
    
      const url = `http://localhost:3001/batch/new`      
      axios.post(url, {qrCodeData})

    })
  }

  return (

    <CContainer>
          <p class="title">{title}{plainData}</p>

      <CRow>
        <CCol className="qcolumn">
          <p class="title">New batch</p>
          <label class="cil-qr-code qicon" for="upload"></label>
          <input type="file" id="upload" onChange={onChange} />
        </CCol>

        <CCol className="qcolumn">
          <p class="title">List batches</p>
          <label class="cil-list-rich qicon" for="upload"></label>
          <input type="file" id="upload" onChange={onChange} />
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



// Difference between
// const onChange = ({target: {files}}) => {
//   createImageBitmap(files[0]).then(bmp =>{
//     console.log(bmp)
//   })  
//     // console.log(image.target.files[0])
//   }
// and
// const onChange = (image) => {
//   createImageBitmap(image.target.files[0]).then(bmp =>{
//     console.log(bmp)
//   })  
//     // console.log(image.target.files[0])
//   }
