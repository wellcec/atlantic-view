import React, { useCallback, useEffect, useState } from 'react'
import {
  Autocomplete, Box, Chip, Paper, TextField, Typography, useTheme
} from '@mui/material'
import Divider from '~/components/atoms/Divider'
import Modal from '~/components/molecules/Modal'
import { type CategoryType, type GetAllCategoriesType, type SubCategoryType } from '~/models/categories'
import useCategoriesService from '~/services/useCategoriesService'
import useAlerts from '~/shared/alerts/useAlerts'
import { type ISampleFilter } from '~/models'
import colors from '~/shared/theme/colors'
import EmptyDataText from '~/components/atoms/EmptyDataText'
import { IconCheckCircule } from '~/constants/icons'
import ChipsCategories from '../../pages/Products/new/ChipsCategories'

const CustomPaper = ({ ...props }): React.JSX.Element => (
  <Paper {...props} sx={{ boxShadow: useTheme().shadows[14] }} />
)

const MAX_REGISTERS = 10000
const emptyFilter: ISampleFilter = {
  term: '',
  page: 1,
  pageSize: MAX_REGISTERS
}

interface IProps {
  open: boolean
  handleClose: () => void
  data: CategoryType[]
  setData: React.Dispatch<React.SetStateAction<any[]>>
}

const AddCategories = ({
  open, handleClose, data, setData
}: IProps): React.JSX.Element => {
  const [selected, setSelected] = useState<CategoryType | null>(null)
  const [categoriesOptions, setCategoriesOptions] = useState<CategoryType[]>([])

  console.log('selected', selected)
  const { getCategories } = useCategoriesService()
  const { notifyError } = useAlerts()

  const getAllCategories = useCallback(() => {
    getCategories(emptyFilter).then(
      (response: GetAllCategoriesType) => {
        const { data: dataRes = [] } = response.data ?? {}
        setCategoriesOptions(dataRes)
      },
      (err) => {
        const { message } = err
        notifyError(message)
      }
    )
  }, [getCategories, notifyError])

  const handleChange = (_: React.SyntheticEvent<Element, Event>, value: CategoryType | null): void => { setSelected(value) }

  const handleAddCategory = (newSubCategory: SubCategoryType): void => {
    if (selected) {
      const existCategory = data.find((cat) => cat._id === selected._id)

      if (!existCategory) {
        const newCategory: CategoryType = {
          ...selected,
          subCategories: [
            newSubCategory
          ]
        }

        const newarr = [...data, newCategory]
        setData(newarr)
      } else {
        const existSubcat = existCategory
          .subCategories.find((subCat) => subCat._id === newSubCategory._id)

        if (!existSubcat) {
          const newSubcats = [...existCategory.subCategories, newSubCategory]
          const index = data.indexOf(existCategory)
          data[index].subCategories = newSubcats

          setData([...data])
        }
      }
    }
  }

  const handleRemove = (category: CategoryType, subCategory: SubCategoryType): void => {
    const newSubcats = category.subCategories.filter((subCat) => subCat._id !== subCategory._id)
    const index = data.indexOf(category)
    data[index].subCategories = newSubcats

    if (newSubcats.length === 0) {
      data.splice(index, 1)
    }

    setData([...data])
  }

  const isAlreadyAdd = (subCategory: SubCategoryType): boolean => {
    const category = data
      .find((catItem) => catItem.subCategories
        .find((subCatItem) => subCatItem._id === subCategory._id))
    return !!category
  }

  useEffect(() => {
    getAllCategories()
  }, [])

  return (
    <Modal open={open} handleClose={handleClose} title="Adicionar categoria">
      <Box minWidth={500}>
        <Box>
          <Box mb={2}>
            <Divider title="Procure categorias" />
          </Box>

          <Box mb={2}>
            <Autocomplete
              sx={{ width: '100%' }}
              renderOption={(props, option) => {
                const { name } = option
                return (
                  // @ts-expect-error
                  <Box component="div" {...props} style={{ borderBottom: `1px solid ${colors.text.ligth}` }}>
                    <Typography variant="body2">{name}</Typography>
                  </Box>
                )
              }}
              handleHomeEndKeys
              autoSelect={false}
              options={categoriesOptions}
              getOptionLabel={(item) => item?.name || ''}
              onChange={handleChange}
              noOptionsText="Nenhuma opção correspondente"
              ListboxProps={{ style: { fontSize: 16 } }}
              PaperComponent={CustomPaper}
              isOptionEqualToValue={(option, value) => option._id === value._id}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  size="small"
                  color="secondary"
                  variant="outlined"
                  label="Informe uma categoria existente"
                  title="Informe uma categoria existente"
                />
              )}
            />
          </Box>

          <Box mb={2}>
            <Divider title="Selecione as subcategorias" />
          </Box>

          <Box mb={2}>
            {!selected && (
              <EmptyDataText text="Nenhuma categoria selecionada" />
            )}

            {selected?.subCategories && (
              <Box display="flex" flexWrap="wrap" justifyContent="center" gap={2}>
                {selected?.subCategories.map((item, index) => (
                  <Chip
                    key={`chip-subCategories-${index}`}
                    label={item?.name}
                    variant="outlined"
                    onClick={() => { handleAddCategory(item) }}
                    onDelete={() => { }}
                    deleteIcon={(
                      <Box display="flex" alignItems="center">
                        {isAlreadyAdd(item) && (<IconCheckCircule color={colors.success.main} />)}
                      </Box>
                    )}
                  />
                ))}
              </Box>
            )}
          </Box>

          <Box mb={2}>
            <Divider title="Categorias/Subcategorias selecionadas" />
          </Box>

          <Box mb={2}>
            {data?.length === 0 && (
              <EmptyDataText text="Nenhuma categoria/subcategoria selecionada" />
            )}

            {data?.length > 0 && (
              <Box display="flex" flexWrap="wrap" justifyContent="center" gap={2}>
                {data?.map((cat, indexCat) => (
                  <React.Fragment key={`add-cat-${indexCat}`}>
                    <ChipsCategories
                      category={cat}
                      handleRemove={handleRemove}
                    />
                  </React.Fragment>
                ))}
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Modal>
  )
}

export default AddCategories
