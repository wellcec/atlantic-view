import React, { useEffect, useState } from 'react'
import ReactQuill from 'react-quill'
import { Box, Checkbox, FormControlLabel, FormGroup } from '@mui/material'
import { type StatusProductProps, type StatusProductType } from '~/models/products'
import { useProductsContext } from '../context'
import 'react-quill/dist/quill.snow.css'
import '../../../start/editor.css'

const Quill = ReactQuill.Quill
const Font = Quill.import('formats/font')
Font.whitelist = ['Poppins']
Quill.register(Font, true)

// const FontAttributor = Quill.import('attributors/class/font')
// FontAttributor.whitelist = [
//   'sofia',
//   'slabo',
//   'roboto',
//   'inconsolata',
//   'ubuntu'
// ]
// Quill.register(FontAttributor, true)

interface IProps {
  statusProduct: StatusProductType
  setStatusProduct: (statusProduct: StatusProductType) => void
}

const FormDescriptions = (): React.JSX.Element => {
  // const { product, setProduct } = useProductsContext()
  const [value, setValue] = useState('')

  const formats = [
    'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'script',
    'header', 'blockquote', 'code-block',
    'indent', 'list',
    'direction', 'align',
    'link', 'image', 'video', 'formula'
  ]

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }, { font: Font.whitelist }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image'],
      ['clean']
    ]
  }

  return (
    <Box>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={setValue}
        modules={modules}
        formats={formats}
        bounds={'.app-editor'}
        className='app-editor'
        placeholder='Digite algo aqui...'
      />
    </Box>
  )
}

export default FormDescriptions
