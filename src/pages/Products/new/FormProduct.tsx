import React from 'react'
import {
  Grid, MenuItem, Select,
} from '@mui/material'

import FormInput from 'components/atoms/Inputs/InputForm'
import useUtils from 'shared/hooks/useUtils'
import InputText from 'components/atoms/Inputs/InputText'
import InputSufix from 'components/atoms/Inputs/InputSufix'
import ShipingOptions from '../fragments/constants'

interface IProps {
  parentFormik: any
}

const FormProduct = ({ parentFormik }: IProps) => {
  const { formatFormCurrency, formatNumber } = useUtils()

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, prop: string) => {
    const { value } = event.target
    const numericValue = formatNumber(value, 'float')
    const formattedValue = formatFormCurrency(numericValue)

    parentFormik.setFieldValue(prop, formattedValue)
  }

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} sm={6} md={3}>
        <FormInput fullWidth title="Título do produto*" helperText formik={parentFormik} propField="title">
          <InputText
            placeholder="Informe um título"
            {...parentFormik.getFieldProps('title')}
            error={parentFormik.touched.title && !!parentFormik.errors.title}
            value={parentFormik.values.title}
          />
        </FormInput>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <FormInput fullWidth title="Subtítulo do produto">
          <InputText
            placeholder="Informe um subtítulo"
            {...parentFormik.getFieldProps('subtitle')}
            error={parentFormik.touched.subtitle && !!parentFormik.errors.subtitle}
            value={parentFormik.values.subtitle}
          />
        </FormInput>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <FormInput fullWidth title="Valor unitário*" helperText formik={parentFormik} propField="value">
          <InputText
            placeholder="Informe um valor"
            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            {...parentFormik.getFieldProps('value')}
            error={parentFormik.touched.value && !!parentFormik.errors.value}
            value={parentFormik.values.value}
            onChange={(event) => handleChange(event, 'value')}
          />
        </FormInput>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <FormInput fullWidth title="Valor com promoção/desconto" helperText formik={parentFormik} propField="valueUnique">
          <InputText
            placeholder="Informe um valor"
            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            {...parentFormik.getFieldProps('valueUnique')}
            error={parentFormik.touched.valueUnique && !!parentFormik.errors.valueUnique}
            value={parentFormik.values.valueUnique}
            onChange={(event) => handleChange(event, 'valueUnique')}
          />
        </FormInput>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <FormInput fullWidth title="Peso do produto*" helperText formik={parentFormik} propField="weight">
          <InputSufix
            placeholder="Informe o peso"
            text="gramas"
            {...parentFormik.getFieldProps('weight')}
            error={parentFormik.touched.weight && !!parentFormik.errors.weight}
            value={parentFormik.values.weight}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              const value = formatNumber(event?.target?.value || '', 'int')
              parentFormik.setFieldValue('weight', value)
            }}
          />
        </FormInput>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <FormInput fullWidth title="Altura do produto*" helperText formik={parentFormik} propField="height">
          <InputSufix
            placeholder="Informe a altura"
            text="cm."
            {...parentFormik.getFieldProps('height')}
            error={parentFormik.touched.height && !!parentFormik.errors.height}
            value={parentFormik.values.height}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              const value = formatNumber(event?.target?.value || '', 'int')
              parentFormik.setFieldValue('height', value)
            }}
          />
        </FormInput>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <FormInput fullWidth title="Comprimento do produto*" helperText formik={parentFormik} propField="length">
          <InputSufix
            placeholder="Informe o comprimento"
            text="cm."
            {...parentFormik.getFieldProps('length')}
            error={parentFormik.touched.length && !!parentFormik.errors.length}
            value={parentFormik.values.length}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              const value = formatNumber(event?.target?.value || '', 'int')
              parentFormik.setFieldValue('length', value)
            }}
          />
        </FormInput>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <FormInput fullWidth title="Largura do produto*" helperText formik={parentFormik} propField="width">
          <InputSufix
            placeholder="Informe a largura"
            text="cm."
            {...parentFormik.getFieldProps('width')}
            error={parentFormik.touched.width && !!parentFormik.errors.width}
            value={parentFormik.values.width}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              const value = formatNumber(event?.target?.value || '', 'int')
              parentFormik.setFieldValue('width', value)
            }}
          />
        </FormInput>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <FormInput fullWidth title="Tipo de frete*">
          <Select
            size="small"
            variant="outlined"
            value={parentFormik.values.shipping}
            {...parentFormik.getFieldProps('shipping')}
            error={parentFormik.touched.shipping && !!parentFormik.errors.shipping}
          >
            <MenuItem value="n/a" disabled>
              Selecione tipo de frete
            </MenuItem>
            {ShipingOptions.map((item, index) => (
              <MenuItem key={`shipping-opt-${index}`} value={item.key}>
                {item.label}
              </MenuItem>
            ))}
          </Select>
        </FormInput>
      </Grid>
    </Grid>
  )
}

export default FormProduct
